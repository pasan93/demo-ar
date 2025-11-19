"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { Canvas } from "@react-three/fiber";
import {
  XR,
  ARButton,
  createXRStore,
  useXR,
  useXRHitTest,
} from "@react-three/xr";
import { Box3, Euler, Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { Html, useGLTF } from "@react-three/drei";
import { Controls } from "./Controls";
import { LoadingSpinner } from "./LoadingSpinner";
import { sofa } from "@/lib/sofa-data";
import { endXRSession } from "@/lib/webxr-utils";

const MIN_SCALE = 0.8;
const MAX_SCALE = 1.2;
const ROTATION_INCREMENT = Math.PI / 12; // 15 degrees

function SofaModelAR({ position, rotation, scale }: { position: [number, number, number]; rotation: number; scale: number }) {
  const gltf = useGLTF(sofa.modelPath);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const [normalizedScale, setNormalizedScale] = useState(1);

  useEffect(() => {
    // Measure the mesh so we can normalize to meter scale and keep AR placement predictable.
    // The GLB should use centimeters (1 unit = 1 cm), so we convert it to roughly 2.1 m width here.
    const boundingBox = new Box3().setFromObject(scene);
    const size = new Vector3();
    boundingBox.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    setNormalizedScale(2.1 / maxDimension);
    const center = new Vector3();
    boundingBox.getCenter(center);
    scene.position.sub(center);
  }, [scene]);

  return <primitive object={scene} position={position} rotation-y={rotation} scale={normalizedScale * scale} />;
}

useGLTF.preload(sofa.modelPath);

function HitTestReticle({ onHit, visible }: { onHit: (pose: { position: Vector3; quaternion: Quaternion } | null) => void; visible: boolean }) {
  const ref = useRef<Mesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);
  const position = useMemo(() => new Vector3(), []);
  const quaternion = useMemo(() => new Quaternion(), []);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        onHit(null);
        if (ref.current) {
          ref.current.visible = false;
        }
        return;
      }
      const result = results[0];
      // Translate XR hit-test matrices into world-space transforms so the reticle tracks the detected plane.
      getWorldMatrix(matrix, result);
      quaternion.setFromRotationMatrix(matrix);
      position.setFromMatrixPosition(matrix);
      if (ref.current) {
        ref.current.visible = visible;
        ref.current.position.copy(position);
        ref.current.quaternion.copy(quaternion);
      }
      onHit({ position: position.clone(), quaternion: quaternion.clone() });
    },
    "viewer",
    ["plane", "mesh"]
  );

  return (
    <mesh ref={ref} visible={visible} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.2, 0.24, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
    </mesh>
  );
}

function SessionEvents({ onSelect }: { onSelect: () => void }) {
  const session = useXR((xr) => xr.session);

  useEffect(() => {
    if (!session) return;
    const handleSelect = () => onSelect();
    session.addEventListener("select", handleSelect);
    return () => session.removeEventListener("select", handleSelect);
  }, [session, onSelect]);

  return null;
}

export function ARViewer() {
  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    // Request camera permissions explicitly for mobile devices
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions.query({ name: "camera" as PermissionName })
        .then((result) => {
          console.log("Camera permission status:", result.state);
          setCameraPermission(result.state === "granted");

          // Listen for permission changes
          result.addEventListener("change", () => {
            console.log("Camera permission changed to:", result.state);
            setCameraPermission(result.state === "granted");
          });
        })
        .catch((error) => {
          console.warn("Could not query camera permissions:", error);
          // Try to request camera access via getUserMedia as fallback
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
              .then((stream) => {
                console.log("Camera access granted via getUserMedia");
                setCameraPermission(true);
                // Stop the stream immediately as we just needed permission
                stream.getTracks().forEach(track => track.stop());
              })
              .catch((error) => {
                console.warn("Camera access denied:", error);
                setCameraPermission(false);
              });
          }
        });
    }
  }, []);

  const [store] = useState(() =>
    createXRStore({
      hand: false,
      controller: false,
      transientPointer: false,
      gaze: false,
      screenInput: true,
      planeDetection: true,
      meshDetection: false,
      hitTest: true,
      domOverlay: typeof document === "undefined" ? true : document.body,
      bounded: false,
    })
  );
  // WebXR session initialization happens inside createXRStore – we request hit-test + DOM overlay features
  // so the browser continuously provides floor intersections while keeping our UI visible atop the camera feed.
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [reticleVisible, setReticleVisible] = useState(true);
  const [hasPlaced, setHasPlaced] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<[number, number, number] | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const latestHitRef = useRef<{ position: Vector3; quaternion: Quaternion } | null>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const gestureState = useRef<{
    initialDistance: number;
    initialAngle: number;
    initialScale: number;
    initialRotation: number;
  } | null>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    initialPosition: [number, number, number];
  } | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => setIsSessionActive(Boolean(state.session)));
    return () => unsubscribe();
  }, [store]);

  const handleHitUpdate = useCallback((pose: { position: Vector3; quaternion: Quaternion } | null) => {
    latestHitRef.current = pose;
    setReticleVisible(Boolean(pose));
  }, []);

  // Tap-to-place: convert the XR hit pose into local position/heading by pulling the yaw component from the quaternion.
  const placeOrMoveSofa = useCallback(() => {
    if (!latestHitRef.current) return;
    const { position: hitPosition, quaternion } = latestHitRef.current;
    setPosition([hitPosition.x, hitPosition.y, hitPosition.z]);
    const euler = new Euler().setFromQuaternion(quaternion, "YXZ");
    setRotation(euler.y);
    setHasPlaced(true);
  }, []);

  const handleRotateLeft = () => setRotation((prev) => prev + ROTATION_INCREMENT);
  const handleRotateRight = () => setRotation((prev) => prev - ROTATION_INCREMENT);
  const handleReset = () => {
    setScale(1);
    if (position) {
      setPosition([position[0], position[1], position[2]]);
    }
    setRotation(0);
  };

  const handleDelete = () => {
    setPosition(null);
    setHasPlaced(false);
  };

  const handleScaleChange = (value: number) => setScale(value);

  const handleExitAR = async () => {
    await endXRSession(store.getState().session);
  };

  const handlePhoto = () => {
    const canvas = canvasParentRef.current?.querySelector("canvas");
    if (!canvas) {
      setSessionError("Unable to access camera feed for capture.");
      return;
    }
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "sofa-ar.png";
      link.click();
    } catch (error) {
      console.error(error);
      setSessionError("Capturing a screenshot failed. Try again or use your device's OS capture feature.");
    }
  };

  // Touch gesture handling: two-finger pinch rotates/scales, single-finger drag repositions along the ground plane
  // by mapping screen deltas to horizontal translations. The logic is debounced through refs to avoid rerenders.
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasPlaced) return;
    if (event.touches.length === 2) {
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const dx = b.clientX - a.clientX;
      const dy = b.clientY - a.clientY;
      gestureState.current = {
        initialDistance: Math.hypot(dx, dy),
        initialAngle: Math.atan2(dy, dx),
        initialScale: scale,
        initialRotation: rotation,
      };
    } else if (event.touches.length === 1 && position) {
      dragState.current = {
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
        initialPosition: [...position] as [number, number, number],
      };
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasPlaced) return;
    if (event.touches.length === 2 && gestureState.current) {
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const dx = b.clientX - a.clientX;
      const dy = b.clientY - a.clientY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const distanceRatio = distance / gestureState.current.initialDistance;
      setScale(() => {
        const next = gestureState.current!.initialScale * distanceRatio;
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      });
      const deltaAngle = angle - gestureState.current.initialAngle;
      setRotation(gestureState.current.initialRotation + deltaAngle);
    } else if (event.touches.length === 1 && dragState.current) {
      event.preventDefault();
      const touch = event.touches[0];
      const deltaX = (touch.clientX - dragState.current.startX) / window.innerWidth;
      const deltaY = (touch.clientY - dragState.current.startY) / window.innerHeight;
      const movementScale = 2.2; // convert normalized drag into ~meters on the horizontal plane
      const initialPosition = dragState.current.initialPosition;
      setPosition([
        initialPosition[0] + deltaX * movementScale,
        initialPosition[1],
        initialPosition[2] + deltaY * movementScale,
      ]);
    }
  };

  const handleTouchEnd = () => {
    gestureState.current = null;
    dragState.current = null;
  };

  return (
    <div className="relative flex h-[80vh] flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900 text-white">
      <div className="flex items-center justify-between rounded-t-3xl bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] sm:px-6 sm:py-4 sm:text-sm">
        <span>
          {hasPlaced
            ? (isMobile ? "👆 Drag · 🤏 Pinch" : "🖱️ Drag · 🔍 Scroll")
            : "👆 Tap floor to place sofa"
          }
        </span>
        <button
          type="button"
          onClick={handleExitAR}
          disabled={!isSessionActive}
          className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-40"
        >
          Exit AR
        </button>
      </div>

      <div
        ref={canvasParentRef}
        className="relative flex-1 touch-none overflow-hidden rounded-b-3xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas
          camera={{ fov: isMobile ? 60 : 50 }}
          dpr={isMobile ? [0.5, 1.5] : [1, 2]}
          performance={{ min: 0.5 }}
        >
          <XR store={store}>
            <Suspense
              fallback={
                <Html center>
                  <LoadingSpinner label="Scanning room" />
                </Html>
              }
            >
              {position && <SofaModelAR position={position} rotation={rotation} scale={scale} />}
              <HitTestReticle onHit={handleHitUpdate} visible={!hasPlaced || reticleVisible} />
              <SessionEvents onSelect={placeOrMoveSofa} />
            </Suspense>
          </XR>
        </Canvas>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0">
          <div className="pointer-events-auto flex flex-col items-center gap-2 px-4 sm:gap-3">
            <Controls
              className="w-full max-w-sm sm:max-w-md"
              onRotateLeft={hasPlaced ? handleRotateLeft : undefined}
              onRotateRight={hasPlaced ? handleRotateRight : undefined}
              onReset={hasPlaced ? handleReset : undefined}
              onDelete={hasPlaced ? handleDelete : undefined}
              showScale={hasPlaced}
              scale={scale}
              minScale={MIN_SCALE}
              maxScale={MAX_SCALE}
              onScaleChange={(value) => handleScaleChange(Math.min(MAX_SCALE, Math.max(MIN_SCALE, value)))}
            />
            <div className="flex w-full max-w-sm items-center justify-between gap-2 sm:max-w-xl sm:gap-3">
              <button
                type="button"
                onClick={handlePhoto}
                className="w-full rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg sm:px-6 sm:py-3 sm:text-base"
              >
                📸 Take Photo
              </button>
              <ARButton
                store={store}
                onError={(error) => {
                  console.error("AR session error:", error);
                  let errorMessage = "We could not start the AR session.";

                  if (cameraPermission === false) {
                    errorMessage += " Camera access is required for AR. Please allow camera permissions in your browser settings.";
                  } else if (error?.message?.includes("permission")) {
                    errorMessage += " Please allow camera access when prompted.";
                  } else {
                    errorMessage += " Please check your device settings and try again.";
                  }

                  setSessionError(errorMessage);
                }}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base ${
                  cameraPermission === false ? "bg-red-500" : "bg-blue-500"
                }`}
                disabled={cameraPermission === false}
              >
                {(status) => {
                  if (cameraPermission === false) {
                    return "📷 Allow Camera First";
                  }
                  if (status === "unsupported") {
                    return "AR Unsupported";
                  }
                  if (status === "entered") {
                    return "🔄 Restart Session";
                  }
                  return "🎯 Start AR";
                }}
              </ARButton>
            </div>
          </div>
        </div>
      </div>

      {sessionError && (
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-rose-100/80 p-4 text-sm font-medium text-rose-700">
          {sessionError}
        </div>
      )}
    </div>
  );
}
