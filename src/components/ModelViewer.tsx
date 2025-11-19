"use client";

import { useEffect, useRef } from "react";
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
}: ModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Log when model is loaded
    const viewer = viewerRef.current as any;
    if (viewer) {
      viewer.addEventListener("load", () => {
        console.log("Model loaded successfully");
      });
      viewer.addEventListener("error", (event: any) => {
        console.error("Model loading error:", event);
      });
    }
  }, []);

  return (
    <model-viewer
      ref={viewerRef}
      src={src}
      ios-src={iosSrc}
      alt={alt}
      auto-rotate={autoRotate}
      camera-controls={cameraControls}
      ar={ar}
      ar-modes={arModes}
      shadow-intensity="1"
      exposure="1"
      environment-image="neutral"
      loading="eager"
      reveal="auto"
      ar-scale="auto"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <div slot="ar-button" className="ar-button-container">
        <button
          className="ar-button"
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
        >
          🎯 View in AR
        </button>
      </div>
      
      <div
        slot="progress-bar"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "14px",
          color: "#333",
        }}
      >
        Loading 3D model...
      </div>
    </model-viewer>
  );
}

