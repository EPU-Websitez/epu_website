"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaMagnifyingGlassMinus, FaMagnifyingGlassPlus } from "react-icons/fa6";
import { FaCompress } from "react-icons/fa";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const TAP_SCALE = 2.5;

/** A press counts as a tap only if it barely moved and was short. */
const TAP_MOVE_PX = 12;
const TAP_MS = 350;
/**
 * After a tap toggles the zoom, ignore taps for this long. People double-tap
 * out of habit (every other photo viewer trains them to), and without this the
 * second tap would immediately undo the first and nothing would appear to
 * happen — which is exactly how the old double-click-only version felt.
 */
const TOGGLE_COOLDOWN_MS = 400;

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
  /**
   * A tiny variant that is ALREADY in the browser cache — the gallery strip's
   * thumbnail. Shown, upscaled and blurred, until `src` finishes downloading,
   * so switching pictures responds instantly instead of going blank while a
   * large file is fetched. next.config sets images.unoptimized, so passing the
   * same URL the thumbnail used is a guaranteed cache hit.
   */
  placeholderSrc?: string | null;
  /** reset zoom whenever this changes (e.g. the gallery item id) */
  resetKey?: string | number;
  sizes?: string;
  fallbackSrc?: string;
}

/**
 * Pan/zoom viewer: wheel, pinch, tap-to-toggle, drag, and explicit buttons.
 *
 * The image sits in a layer transformed as translate(t) scale(s) about its
 * centre. To keep the point under the cursor fixed while scaling from s to s',
 * the offset becomes  t' = c - (s'/s)(c - t)  where c is the cursor measured
 * from the container's centre.
 *
 * Gestures are driven entirely by pointer events. `dblclick` is deliberately
 * NOT used: mobile Safari synthesises it unreliably on an element with
 * `touch-action: none` that also captures pointers, so double-tap-to-zoom
 * worked only every few attempts.
 */
export default function ZoomableImage({
  src,
  zoomSrc,
  alt,
  placeholderSrc,
  resetKey,
  sizes = "90vw",
  fallbackSrc = "/images/placeholder.svg",
}: ZoomableImageProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  /** any finger/button down — kills the transition so gestures track 1:1 */
  const [gesturing, setGesturing] = useState(false);
  // Once the hi-res source has been fetched, keep it: flipping back on
  // zoom-out would re-download the large file on every gesture. Dropped when
  // the picture changes — see the reset effect.
  const [hiRes, setHiRes] = useState(false);
  /** has the resting-size picture painted yet? false = still fetching it */
  const [baseLoaded, setBaseLoaded] = useState(false);
  /** has the full-resolution overlay painted yet? */
  const [hiResLoaded, setHiResLoaded] = useState(false);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Gesture handlers run between renders, so they must not read `offset` /
  // `scale` from a stale closure — a pinch changes both many times per frame.
  const offsetRef = useRef(offset);
  offsetRef.current = offset;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  /** Intrinsic size of the loaded image, for clamping against the real picture. */
  const naturalRef = useRef<{ w: number; h: number } | null>(null);
  /** Where the press started, to tell a tap from a drag. */
  const press = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null);
  const lastToggle = useRef(0);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setBaseLoaded(false);
  }, [src]);

  useEffect(() => {
    setHiResLoaded(false);
  }, [zoomSrc]);

  useEffect(() => {
    reset();
    // Drop back to the light variant for the new picture. Without this, zooming
    // ONCE left hiRes latched on for the rest of the session, so every later
    // gallery image was fetched at full original size — several MB apiece —
    // before it would appear. That was the "changing image takes time".
    setHiRes(false);
  }, [resetKey, reset]);

  /**
   * Keep the picture's own edges inside the viewport.
   *
   * Clamping against the VIEWPORT (the previous behaviour) is wrong whenever
   * the image is letterboxed by `object-contain`: on a phone, a landscape photo
   * in a tall box could be dragged far into the empty bands above and below it,
   * so panning went nowhere useful and the photo could vanish off-screen.
   */
  const clamp = useCallback((x: number, y: number, s: number) => {
    const el = viewportRef.current;
    if (!el || s <= 1) return { x: 0, y: 0 };

    const vw = el.clientWidth;
    const vh = el.clientHeight;
    const natural = naturalRef.current;

    // Rendered size at scale 1 under object-contain; fall back to the viewport
    // until the image has reported its intrinsic size.
    let iw = vw;
    let ih = vh;
    if (natural && natural.w > 0 && natural.h > 0) {
      const ratio = Math.min(vw / natural.w, vh / natural.h);
      iw = natural.w * ratio;
      ih = natural.h * ratio;
    }

    const maxX = Math.max(0, (iw * s - vw) / 2);
    const maxY = Math.max(0, (ih * s - vh) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  /** Scale to `next` while holding the point (cx, cy) — client coords — still. */
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

  /** (Re)start a one-finger pan from wherever the image currently sits. */
  const beginDrag = useCallback((x: number, y: number) => {
    dragStart.current = {
      x,
      y,
      ox: offsetRef.current.x,
      oy: offsetRef.current.y,
    };
    setDragging(true);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    // The controls sit inside the viewport, so a press on them bubbles here.
    // Starting a drag would call setPointerCapture on the viewport, which
    // retargets the follow-up click away from the button — the buttons then
    // silently stop working the moment you are zoomed in.
    if ((e.target as HTMLElement).closest("[data-zoom-controls]")) return;

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);
    // Capture every pointer, not just drags: without it a finger that strays
    // outside the box mid-pinch stops reporting and the gesture dies.
    e.currentTarget.setPointerCapture(e.pointerId);

    if (pointers.current.size === 1) {
      press.current = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
      if (scaleRef.current > 1) beginDrag(e.clientX, e.clientY);
      return;
    }

    // Second finger down: pinch takes over, and a pinch is never a tap.
    if (press.current) press.current.moved = true;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: scaleRef.current };
      setDragging(false);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (press.current && !press.current.moved) {
      const dx = e.clientX - press.current.x;
      const dy = e.clientY - press.current.y;
      if (Math.hypot(dx, dy) > TAP_MOVE_PX) press.current.moved = true;
    }

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > 0) {
        zoomTo(
          (pinch.current.scale * dist) / pinch.current.dist,
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        );
      }
      return;
    }

    if (!dragging) return;
    setOffset(
      clamp(
        dragStart.current.ox + (e.clientX - dragStart.current.x),
        dragStart.current.oy + (e.clientY - dragStart.current.y),
        scaleRef.current,
      ),
    );
  };

  /** Tap toggles: zoom in where you tapped, or back out again. */
  const handleTap = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastToggle.current < TOGGLE_COOLDOWN_MS) return;
    lastToggle.current = now;
    if (scaleRef.current > 1) reset();
    else zoomTo(TAP_SCALE, x, y);
  };

  const endPointer = (e: React.PointerEvent) => {
    const wasTracked = pointers.current.delete(e.pointerId);
    if (!wasTracked) return;

    const remaining = [...pointers.current.entries()];

    if (remaining.length < 2) pinch.current = null;

    if (remaining.length === 1) {
      // Lifting one finger of a pinch used to leave the survivor doing nothing
      // (drag was never armed) or panning from the pre-pinch origin (a violent
      // jump). Re-baseline so the remaining finger just keeps panning.
      const [, pt] = remaining[0];
      if (scaleRef.current > 1) beginDrag(pt.x, pt.y);
      else setDragging(false);
      // Whatever happens next is a continuation, not a tap.
      press.current = null;
      return;
    }

    if (remaining.length === 0) {
      setDragging(false);
      setGesturing(false);
      const p = press.current;
      press.current = null;
      if (p && !p.moved && Date.now() - p.t < TAP_MS && e.type === "pointerup") {
        handleTap(e.clientX, e.clientY);
      }
    }
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
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center",
          transition: gesturing ? "none" : "transform 150ms ease-out",
        }}
      >
        {/*
          Three stacked layers, so nothing ever goes blank:
            1. the gallery thumbnail, already cached — visible immediately
            2. the resting-size picture, fading in over it
            3. the full original, only once someone zooms, fading in over that
          The old single <Image> meant a picture change showed an empty box for
          as long as the download took, and a zoom swapped the source outright.
        */}
        {placeholderSrc && !baseLoaded && (
          <Image
            src={placeholderSrc}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            className="object-contain scale-[1.02] blur-[6px]"
            draggable={false}
            unoptimized
            priority
          />
        )}

        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-contain transition-opacity duration-200 ${
            baseLoaded ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
          unoptimized
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight };
              // The allowed pan range just changed — pull the image back inside it.
              setOffset((o) => clamp(o.x, o.y, scaleRef.current));
            }
            setBaseLoaded(true);
          }}
          onError={(e) => {
            e.currentTarget.src = fallbackSrc;
            setBaseLoaded(true);
          }}
        />

        {hiRes && zoomSrc && zoomSrc !== src && (
          <Image
            key={zoomSrc}
            src={zoomSrc}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            className={`object-contain transition-opacity duration-200 ${
              hiResLoaded ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
            unoptimized
            onLoad={() => setHiResLoaded(true)}
            onError={() => setHiResLoaded(false)}
          />
        )}
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
