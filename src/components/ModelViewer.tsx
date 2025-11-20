"use client";

import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
  arModes?: string;
  className?: string;
  poster?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          ar?: boolean;
          "ar-modes"?: string;
          "shadow-intensity"?: string;
          "exposure"?: string;
          "environment-image"?: string;
          poster?: string;
          loading?: string;
          "reveal"?: string;
          "ar-scale"?: string;
          "ar-placement"?: string;
          "xr-environment"?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

export function ModelViewer({
  src,
  iosSrc,
  alt = "3D Model",
  autoRotate = true,
  cameraControls = true,
  ar = true,
  arModes = "webxr scene-viewer quick-look",
  className = "",
  poster,
}: ModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [absoluteIosSrc, setAbsoluteIosSrc] = useState<string>("");

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Construct absolute URL for iOS AR
    if (iOS && iosSrc) {
      // For Vercel deployments, use the known deployment URL
      const baseUrl = window.location.hostname.includes('vercel.app')
        ? window.location.origin
        : window.location.origin; // fallback for local development
      const absoluteUrl = new URL(iosSrc, baseUrl).href;
      console.log("iOS AR URL:", absoluteUrl, "UserAgent iOS:", iOS, "Origin:", window.location.origin);
      setAbsoluteIosSrc(absoluteUrl);
    }

    // Handle model loading states
    const viewer = viewerRef.current as any;
    if (viewer) {
      viewer.addEventListener("load", () => {
        console.log("Model loaded successfully");
        setIsModelLoaded(true);
      });
      viewer.addEventListener("error", (event: any) => {
        console.error("Model loading error:", event);
        setIsModelLoaded(false);
      });
      viewer.addEventListener("ar-status", (event: any) => {
        console.log("AR status:", event.detail);
      });
    }
  }, [iosSrc]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <model-viewer
        ref={viewerRef}
        src={src}
        ios-src={iosSrc}
        alt={alt}
        auto-rotate={autoRotate}
        camera-controls={cameraControls}
        ar={true}
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        xr-environment={true}
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        loading="eager"
        reveal="auto"
        poster={poster}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <div slot="progress-bar" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "14px",
          color: "#333",
        }}>
          Loading 3D model...
        </div>
      </model-viewer>

      {/* AR/VR buttons - Multiple options for iOS users */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 10,
      }}>
        {absoluteIosSrc && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a
              rel="ar"
              href={absoluteIosSrc}
              style={{
                padding: "10px 16px",
                backgroundColor: "#007AFF",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                textAlign: "center",
              }}
              onClick={() => console.log("Quick Look AR clicked, URL:", absoluteIosSrc)}
            >
              📱 Quick Look AR ({isIOS ? 'iOS' : 'Test'})
            </a>
            <a
              href={absoluteIosSrc}
              download="sofa.usdz"
              style={{
                padding: "8px 12px",
                backgroundColor: "#6B7280",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "500",
                textDecoration: "none",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              ⬇️ Download USDZ
            </a>
          </div>
        )}
        <button
          style={{
            padding: "10px 16px",
            backgroundColor: isIOS ? "#34C759" : "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: isIOS
              ? "0 4px 12px rgba(52, 199, 89, 0.4)"
              : "0 4px 12px rgba(0, 122, 255, 0.4)",
          }}
          onClick={() => {
            // Trigger WebXR AR/VR
            const viewer = viewerRef.current as any;
            if (viewer && viewer.activateAR) {
              viewer.activateAR();
            }
          }}
        >
          {isIOS ? "🕶️ WebXR VR/AR" : "🎯 View in AR"}
        </button>
      </div>
    </div>
  );
}

