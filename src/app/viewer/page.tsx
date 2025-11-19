"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sofa, formatDimensions } from "@/lib/sofa-data";

const ModelViewer = dynamic(
  () => import("@/components/ModelViewer").then((mod) => mod.ModelViewer),
  { ssr: false }
);

export default function ViewerPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobile);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-black">3D Viewer</h1>
            <p className="text-sm text-black/60">{sofa.name}</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Full Screen Viewer */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="relative h-[80vh] overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-2xl">
          <ModelViewer
            src={sofa.modelPath}
            iosSrc="/models/sofa.usdz"
            alt={sofa.name}
            autoRotate={true}
            cameraControls={true}
            ar={true}
            arModes="webxr scene-viewer quick-look"
            className="h-full w-full"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-black/50">
          {isMobile ? (
            <>
              <span>👆 Touch to rotate</span>
              <span>•</span>
              <span>🤏 Pinch to zoom</span>
              <span>•</span>
              <span>🎯 Tap AR button to view in your space</span>
            </>
          ) : (
            <>
              <span>🖱️ Click and drag to rotate</span>
              <span>•</span>
              <span>🔍 Scroll to zoom</span>
              <span>•</span>
              <span>📱 Open on mobile for AR</span>
            </>
          )}
        </div>
      </section>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="rounded-2xl border border-black/10 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-black">{sofa.name}</h2>
          <p className="mt-2 text-black/70">{sofa.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-black/50">Price</p>
              <p className="mt-1 text-xl font-bold text-black">${sofa.price}</p>
            </div>
            <div>
              <p className="text-sm text-black/50">Dimensions</p>
              <p className="mt-1 font-medium text-black">{formatDimensions(sofa.dimensions)}</p>
            </div>
            <div>
              <p className="text-sm text-black/50">Material</p>
              <p className="mt-1 font-medium text-black">{sofa.material}</p>
            </div>
            <div>
              <p className="text-sm text-black/50">Capacity</p>
              <p className="mt-1 font-medium text-black">3 Seater</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
