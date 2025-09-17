// components/MapComponent.tsx
"use client";

import { useEffect, useRef } from "react";

interface MapComponentProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
  zoom?: number;
  className?: string;
}

const MapComponent = ({
  lat,
  lng,
  title,
  address,
  zoom = 15,
  className = "w-full h-full rounded-lg",
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      // Prevent multiple initializations
      if (!mapRef.current || initialized.current || !isMounted) {
        return;
      }

      try {
        // Dynamic import of Leaflet
        const L = (await import("leaflet")).default;

        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);

          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve;
            setTimeout(resolve, 1000); // Fallback timeout
          });
        }

        // ★ custom gold pin CSS injector (only once)
        if (!document.getElementById("gold-pin-css")) {
          const style = document.createElement("style");
          style.id = "gold-pin-css";
          style.textContent = `
            .gold-pin {
              position: relative;
              width: 20px !important;
              height: 20px !important;
              border-radius: 50%;
              background: #dcc48c;
              border: 3px solid #ffffff;
              transform: translate(-50%, -100%);
              box-shadow: 0 2px 10px rgba(0,0,0,.15);
              cursor: pointer;
              transition: transform .15s ease, box-shadow .15s ease;
            }
            .gold-pin--hover {
              transform: translate(-50%, -100%) scale(1.05);
              box-shadow: 0 4px 14px rgba(0,0,0,.18);
            }
            .gold-pin--active {
              width: 28px !important;
              height: 28px !important;
            }
            .gold-pin--pulse::after {
              content: "";
              position: absolute;
              left: 50%;
              top: 50%;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              transform: translate(-50%, -50%);
              background: rgba(220,196,140,0.35);
              animation: gold-pulse 1.8s ease-out infinite;
              pointer-events: none;
            }
            @keyframes gold-pulse {
              0%   { opacity: .65; transform: translate(-50%, -50%) scale(.6); }
              70%  { opacity: 0;   transform: translate(-50%, -50%) scale(1.6); }
              100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.6); }
            }
          `;
          document.head.appendChild(style);
        }

        // Check if still mounted after async operations
        if (!isMounted || !mapRef.current) return;

        // Fix default markers (kept, harmless even though we use divIcon)
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create map
        mapInstance.current = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: zoom,
        });

        // --- CHANGE START: Updated tile layer to CARTO Positron style ---
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
          }
        ).addTo(mapInstance.current);
        // --- CHANGE END ---

        // ★ custom gold pin icon
        const goldIcon = L.divIcon({
          className: "gold-pin gold-pin--pulse", // pulse on by default; remove if you want static
          html: "",
          iconSize: [20, 20],
          iconAnchor: [10, 20],
        });

        // Add marker (with custom icon)
        const marker = L.marker([lat, lng], { icon: goldIcon }).addTo(
          mapInstance.current
        );

        // optional hover feedback
        marker.on("mouseover", () => {
          const el = (marker as any)._icon as HTMLElement | null;
          el?.classList.add("gold-pin--hover");
        });
        marker.on("mouseout", () => {
          const el = (marker as any)._icon as HTMLElement | null;
          el?.classList.remove("gold-pin--hover");
        });

        marker
          .bindPopup(
            `
          <div style="text-align: center; min-width: 200px;">
            <strong style="font-size: 14px; color: #333;">${title}</strong><br/>
            <span style="font-size: 12px; color: #666; margin-top: 4px; display: block;">${address}</span>
          </div>
        `
          )
          .openPopup();

        initialized.current = true;

        // Force map to resize after a short delay
        setTimeout(() => {
          if (mapInstance.current && isMounted) {
            mapInstance.current.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);

        // Show fallback content
        if (mapRef.current && isMounted) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100%; 
              background: #f3f4f6; 
              border-radius: 8px; 
              color: #6b7280;
              font-size: 14px;
              text-align: center;
              padding: 20px;
            ">
              <div>
                <div style="margin-bottom: 8px; font-size: 24px;">📍</div>
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 12px;">${address}</div>
              </div>
            </div>
          `;
        }
      }
    };

    // Start initialization after a small delay
    const timer = setTimeout(initMap, 50);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);

      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstance.current = null;
      }
      initialized.current = false;
    };
  }, []); // Only run once on mount

  // Update map when props change
  useEffect(() => {
    if (mapInstance.current && initialized.current) {
      try {
        mapInstance.current.setView([lat, lng], zoom);

        // Update marker
        mapInstance.current.eachLayer((layer: any) => {
          if (layer.setLatLng && layer.getLatLng) {
            layer.setLatLng([lat, lng]);
            layer.setPopupContent(`
              <div style="text-align: center; min-width: 200px;">
                <strong style="font-size: 14px; color: #333;">${title}</strong><br/>
                <span style="font-size: 12px; color: #666; margin-top: 4px; display: block;">${address}</span>
              </div>
            `);
          }
        });
      } catch (error) {
        console.warn("Error updating map:", error);
      }
    }
  }, [lat, lng, title, address, zoom]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{
        minHeight: "200px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        position: "relative",
      }}
    />
  );
};

export default MapComponent;
