/**
 * Checks whether immersive AR sessions are supported on the current device/browser.
 * The call gracefully handles browsers that expose no `navigator.xr` implementation.
 */
export async function isARSupported(): Promise<boolean> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check if we're on a mobile device (AR is primarily supported on mobile)
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check if we're in a secure context (required for WebXR)
  const isSecureContext = typeof window !== "undefined" && (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );

  if (!isSecureContext) {
    console.warn("WebXR requires HTTPS or localhost");
    return false;
  }

  const xrNavigator = navigator as Navigator & {
    xr?: XRSystem & { isSessionSupported?: (mode: XRSessionMode) => Promise<boolean> };
  };

  if (!xrNavigator.xr || typeof xrNavigator.xr.isSessionSupported !== "function") {
    console.warn("WebXR not supported in this browser");
    return false;
  }

  try {
    const supported = (await xrNavigator.xr.isSessionSupported("immersive-ar")) ?? false;
    console.log("WebXR immersive-ar supported:", supported, "Mobile device:", isMobile);
    return supported;
  } catch (error) {
    console.warn("WebXR detection failed", error);
    return false;
  }
}

/**
 * Utility helper for producing a consistent AR error message that can be surfaced in UI copy.
 */
export function getARUnsupportedMessage(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "AR requires a compatible browser and device.";
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isSecureContext = window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isSecureContext) {
    return "AR requires HTTPS. Please access this site via https:// or localhost.";
  }

  if (!isMobile) {
    return "AR is designed for mobile devices. Try opening this page on your phone or tablet with a WebXR-compatible browser.";
  }

  if (isIOS) {
    return "For iOS, use Safari 15+ or the latest Chrome. Make sure WebXR is enabled in Settings > Safari > Advanced > WebXR. Camera access will be requested when you start AR.";
  }

  if (isAndroid) {
    return "For Android, use Chrome 90+ or Firefox Reality. Make sure ARCore is installed and up to date. Camera permissions will be requested when you start AR.";
  }

  return "AR is not available on this device yet. Try the 3D viewer instead, or update your browser and OS.";
}

/**
 * Safely ends an XR session if one exists.
 */
export async function endXRSession(session?: XRSession | null): Promise<void> {
  try {
    if (session && session.end) {
      await session.end();
    }
  } catch (error) {
    console.warn("Failed to end XR session", error);
  }
}

/**
 * Request camera permissions explicitly (useful for mobile devices)
 */
export async function requestCameraPermissions(): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  try {
    // First try the Permissions API
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName });
      if (result.state === "granted") {
        return true;
      }
      if (result.state === "denied") {
        return false;
      }
    }

    // Fallback: try getUserMedia to request permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer back camera for AR
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Immediately stop the stream as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    }

    return false;
  } catch (error) {
    console.warn("Camera permission request failed:", error);
    return false;
  }
}

/**
 * Get camera permission status
 */
export async function getCameraPermissionStatus(): Promise<PermissionState | null> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return null;
  }

  try {
    const result = await navigator.permissions.query({ name: "camera" as PermissionName });
    return result.state;
  } catch (error) {
    console.warn("Could not query camera permissions:", error);
    return null;
  }
}

/**
 * Get device type information for better UX messaging.
 */
export function getDeviceInfo(): {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  browser: string;
} {
  if (typeof navigator === "undefined") {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isDesktop: true,
      browser: "unknown"
    };
  }

  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isDesktop = !isMobile;

  // Detect browser
  let browser = "unknown";
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  return { isMobile, isIOS, isAndroid, isDesktop, browser };
}
