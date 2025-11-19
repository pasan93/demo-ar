"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Group, MathUtils, Vector3 } from "three";
import * as THREE from "three";
import { sofa } from "@/lib/sofa-data";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { Controls } from "./Controls";

const ROTATION_INCREMENT = MathUtils.degToRad(15);

function SofaModel({ rotation }: { rotation: number }) {
  const gltf = useGLTF(sofa.modelPath);
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    try {
      // Auto-scale model so that it fits inside the viewer regardless of GLB units.
      const boundingBox = new Box3().setFromObject(clonedScene as Group);
      const size = new Vector3();
      boundingBox.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);
      console.log('Bounding box size:', size);
      console.log('Max dimension:', maxDimension);

      if (maxDimension > 0) {
        // Target roughly 2.5 meters across (1 unit == 1 meter inside the viewer)
        const newScale = 2.5 / maxDimension;
        setScale(newScale);
        console.log('Calculated scale:', newScale);
      }
      const center = new Vector3();
      boundingBox.getCenter(center);
      console.log('Model center:', center);
      clonedScene.position.sub(center); // Center the model around (0,0,0) for better orbits.
      console.log('Model repositioned');
    } catch (error) {
      console.error('Error processing model:', error);
    }
  }, [clonedScene]);

  return <primitive object={clonedScene} rotation-y={rotation} scale={scale} castShadow receiveShadow />;
}

// Important: remind integrators where to place the GLB.
// Place your sofa.glb file in /public/models/ and keep it centered at the origin facing +Z.

interface SofaViewerProps {
  arSupported: boolean;
  onTryAR?: () => void;
}

export function SofaViewer({ arSupported, onTryAR }: SofaViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const rotateLeft = useCallback(() => setRotation((prev) => prev + ROTATION_INCREMENT), []);
  const rotateRight = useCallback(() => setRotation((prev) => prev - ROTATION_INCREMENT), []);
  const reset = useCallback(() => setRotation(0), []);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-900/90 shadow-2xl">
      <ErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 1.4, 4], fov: isMobile ? 50 : 45 }}
          className="h-full w-full touch-none"
          dpr={isMobile ? [0.5, 2] : [1, 2]}
          performance={{ min: 0.5 }}
          onCreated={({ scene, gl }) => {
            scene.background = null;
            // Optimize for mobile
            if (isMobile) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.shadowMap.enabled = false; // Disable shadows on mobile for performance
            }
          }}
        >
          <color attach="background" args={["#0f172a"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <directionalLight position={[-4, 2, -2]} intensity={0.4} />
          <Suspense
            fallback={
              <Html center>
                <LoadingSpinner label="Loading sofa" />
              </Html>
            }
          >
            <SofaModel rotation={rotation} />
          </Suspense>
          <mesh rotation-x={-Math.PI / 2} position={[0, -0.6, 0]} receiveShadow>
            <circleGeometry args={[6, 48]} />
            <meshStandardMaterial color="#0f172a" opacity={0.6} transparent />
          </mesh>
          <gridHelper args={[10, 40, "#1e293b", "#1e293b"]} position={[0, -0.6, 0]} />
          <OrbitControls
            enablePan
            enableZoom
            enableDamping
            dampingFactor={isMobile ? 0.1 : 0.05}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={2}
            maxDistance={8}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }}
          />
        </Canvas>
      </ErrorBoundary>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <Controls
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onReset={reset}
          onTryAR={arSupported ? onTryAR : undefined}
          tryARLabel={arSupported ? "🎯 Try in AR" : "AR unavailable"}
        />
      </div>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.3em] text-slate-200">
        {isMobile ? "👆 Touch · 🤏 Pinch" : "🖱️ Drag · 🔍 Scroll"}
      </p>
    </div>
  );
}

useGLTF.preload(sofa.modelPath);
