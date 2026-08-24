"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaMagnifyingGlassMinus, FaMagnifyingGlassPlus } from "react-icons/fa6";
import { FaCompress } from "react-icons/fa";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;

interface ZoomableImageProps {
  /** shown at rest — a downscaled variant is fine here */
  src: string;
  /**
   * Full-resolution source, swapped in the moment the user zooms. Without this
   * zooming would just magnify the downscaled variant and look blurry, which
   * defeats the point of zoom.
   */
  zoomSrc?: string;
  alt: string;
  /** reset zoom whenever this changes (e.g. the gallery item id) */
  resetKey?: string | number;
  sizes?: string;
  fallbackSrc?: string;
}

/**
 * Pan/zoom viewer: wheel, pinch, double-click/tap, drag, and explicit buttons.
 *
 * The image sits in a layer transformed as translate(t) scale(s) about its
 * centre. To keep the point under the cursor fixed while scaling from s to s',
 * the offset becomes  t' = c - (s'/s)(c - t)  where c is the cursor measured
 * from the container's centre.
 */
export default function ZoomableImage({
  src,
  zoomSrc,
  alt,
  resetKey,
  sizes = "90vw",
  fallbackSrc = "/images/placeholder.svg",
}: ZoomableImageProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  // Once the hi-res source has been fetched, keep it: flipping back on
  // zoom-out would re-download the large file on every gesture.
  const [hiRes, setHiRes] = useState(false);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    reset();
  }, [resetKey, reset]);

  /** Keep the image from being dragged entirely out of view. */
  const clamp = useCallback((x: number, y: number, s: number) => {
    const el = viewportRef.current;
    if (!el || s <= 1) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (s - 1)) / 2;
    const maxY = (el.clientHeight * (s - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  /** Scale to `next` while holding the point (cx, cy) — viewport coords — still. */
  const zoomTo = useCallback(
    (next: number, cx?: number, cy?: number) => {
      const el = viewportRef.current;
      if (!el) return;
      const target = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      if (target > 1) setHiRes(true);

      setScale((prev) => {
        const rect = el.getBoundingClientRect();
        const px = (cx ?? rect.left + rect.width / 2) - rect.left - rect.width / 2;
        const py = (cy ?? rect.top + rect.height / 2) - rect.top - rect.height / 2;
        const k = target / prev;
        setOffset((o) => clamp(px - k * (px - o.x), py - k * (py - o.y), target));
        return target;
      });
    },
    [clamp],
  );

  // Wheel must be bound natively: React's onWheel is passive, so preventDefault
  // there is ignored and the page scrolls behind the zoom.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY / 500);
      setScale((prev) => {
        const target = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
        if (target > 1) setHiRes(true);
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left - rect.width / 2;
        const py = e.clientY - rect.top - rect.height / 2;
        const k = target / prev;
        setOffset((o) => clamp(px - k * (px - o.x), py - k * (py - o.y), target));
        return target;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clamp]);

  const onPointerDown = (e: React.PointerEvent) => {
    // The controls sit inside the viewport, so a press on them bubbles here.
    // Starting a drag would call setPointerCapture on the viewport, which
    // retargets the follow-up click away from the button — the buttons then
    // silently stop working the moment you are zoomed in.
    if ((e.target as HTMLElement).closest("[data-zoom-controls]")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      return;
    }
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomTo(
        (pinch.current.scale * dist) / pinch.current.dist,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
      );
      return;
    }
    if (!dragging) return;
    setOffset(
      clamp(
        dragStart.current.ox + (e.clientX - dragStart.current.x),
        dragStart.current.oy + (e.clientY - dragStart.current.y),
        scale,
      ),
    );
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const zoomed = scale > 1;

  return (
    <div
      ref={viewportRef}
      // touch-none stops the browser panning the page instead of the image.
      className={`relative h-full w-full overflow-hidden touch-none select-none ${
        zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={endPointer}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-zoom-controls]")) return;
        zoomed ? reset() : zoomTo(DOUBLE_TAP_SCALE, e.clientX, e.clientY);
      }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center",
          transition: dragging || pinch.current ? "none" : "transform 150ms ease-out",
        }}
      >
        <Image
          src={hiRes && zoomSrc ? zoomSrc : src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-contain"
          draggable={false}
          unoptimized={hiRes}
          onError={(e) => {
            e.currentTarget.src = fallbackSrc;
          }}
        />
      </div>

      <div
        data-zoom-controls
        className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 p-1 text-white backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={() => zoomTo(scale - 0.5)}
          disabled={scale <= MIN_SCALE}
          className="rounded-full p-2 transition-colors hover:bg-white/20 disabled:opacity-40"
          aria-label="zoom out"
          title="Zoom out"
        >
          <FaMagnifyingGlassMinus />
        </button>
        <span className="min-w-[3rem] text-center text-xs tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => zoomTo(scale + 0.5)}
          disabled={scale >= MAX_SCALE}
          className="rounded-full p-2 transition-colors hover:bg-white/20 disabled:opacity-40"
          aria-label="zoom in"
          title="Zoom in"
        >
          <FaMagnifyingGlassPlus />
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!zoomed}
          className="rounded-full p-2 transition-colors hover:bg-white/20 disabled:opacity-40"
          aria-label="reset zoom"
          title="Reset zoom"
        >
          <FaCompress />
        </button>
      </div>
    </div>
  );
}
