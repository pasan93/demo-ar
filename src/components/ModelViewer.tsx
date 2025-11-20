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
  const [resolvedIosSrc, setResolvedIosSrc] = useState<string | undefined>(iosSrc);
  const [iosAssetStatus, setIosAssetStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent);
    setIsIOS(iOS);

    if (!iosSrc) {
      setResolvedIosSrc(undefined);
      return;
    }

    try {
      const absoluteUrl = iosSrc.startsWith("http")
        ? iosSrc
        : new URL(iosSrc, window.location.origin).href;
      console.log("iOS AR URL:", absoluteUrl, "UserAgent iOS:", iOS, "Origin:", window.location.origin);
      setResolvedIosSrc(absoluteUrl);
    } catch (error) {
      console.error("Unable to resolve iosSrc into an absolute URL", error);
      setResolvedIosSrc(iosSrc);
    }
  }, [iosSrc]);

  useEffect(() => {
    const viewer = viewerRef.current as any;
    if (!viewer) return;

    const handleLoad = () => {
      console.log("Model loaded successfully");
      setIsModelLoaded(true);
    };
    const handleError = (event: any) => {
      console.error("Model loading error:", event);
      setIsModelLoaded(false);
    };
    const handleArStatus = (event: any) => {
      console.log("AR status:", event.detail);
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("ar-status", handleArStatus);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("ar-status", handleArStatus);
    };
  }, []);

  useEffect(() => {
    if (!resolvedIosSrc || !resolvedIosSrc.startsWith("http")) {
      setIosAssetStatus(resolvedIosSrc ? "ok" : "idle");
      return;
    }

    const controller = new AbortController();
    setIosAssetStatus("checking");

    fetch(resolvedIosSrc, { method: "HEAD", signal: controller.signal })
      .then((response) => {
        if (response.ok) {
          console.log("USDZ asset reachable:", resolvedIosSrc);
          setIosAssetStatus("ok");
        } else {
          console.warn("USDZ asset request failed:", resolvedIosSrc, response.status);
          setIosAssetStatus("error");
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Unable to reach USDZ asset:", resolvedIosSrc, error);
        setIosAssetStatus("error");
      });

    return () => controller.abort();
  }, [resolvedIosSrc]);

  const iosArHref = resolvedIosSrc || iosSrc;
  const downloadFileName =
    (iosSrc ?? "").split("/").filter(Boolean).pop() ?? "model.usdz";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <model-viewer
        ref={viewerRef}
        src={src}
        ios-src={iosArHref}
        alt={alt}
        auto-rotate={autoRotate}
        camera-controls={cameraControls}
        ar={ar}
        ar-modes={arModes}
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
        {iosArHref && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a
              rel="ar"
              href={iosArHref}
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
              onClick={() => console.log("Quick Look AR clicked, URL:", iosArHref)}
            >
              📱 Quick Look AR ({isIOS ? 'iOS' : 'Test'})
            </a>
            <a
              href={iosArHref}
              download={downloadFileName}
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
        {iosArHref && iosAssetStatus === "error" && (
          <span
            style={{
              fontSize: "12px",
              color: "#DC2626",
              textAlign: "right",
              maxWidth: "240px",
            }}
          >
            USDZ file can&apos;t be reached. Check file path & MIME headers.
          </span>
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
