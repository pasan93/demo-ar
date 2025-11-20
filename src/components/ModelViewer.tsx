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

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

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
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        auto-rotate={autoRotate}
        camera-controls={cameraControls}
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

      {/* AR button positioned outside model-viewer */}
      {isIOS && iosSrc ? (
        <a
          rel="ar"
          href={iosSrc}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            padding: "12px 24px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "24px",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
            zIndex: 10,
          }}
        >
          🎯 View in AR
        </a>
      ) : (
        <button
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            padding: "12px 24px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "24px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
            zIndex: 10,
          }}
          onClick={() => {
            // Trigger AR on Android
            const viewer = viewerRef.current as any;
            if (viewer && viewer.activateAR) {
              viewer.activateAR();
            }
          }}
        >
          🎯 View in AR
        </button>
      )}
    </div>
  );
}

