"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sofa, formatDimensions } from "@/lib/sofa-data";

const ModelViewer = dynamic(
  () => import("@/components/ModelViewer").then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center rounded-3xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const ios = /iPhone|iPad|iPod/i.test(userAgent);
    setIsMobile(mobile);
    setIsIOS(ios);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">AR Furniture</h1>
            <p className="text-sm text-black/60">Try before you buy</p>
          </div>
          <Link
            href="/viewer"
            className="rounded-full border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            3D Viewer
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-black/40">
                Modern Collection
              </p>
              <h2 className="mt-2 text-4xl font-bold text-black sm:text-5xl">
                {sofa.name}
              </h2>
              <p className="mt-4 text-lg text-black/70">{sofa.description}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-black">${sofa.price}</span>
              <span className="text-sm text-black/60">+ free shipping</span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-black/10 p-4">
                <div className="text-2xl">📐</div>
                <div className="mt-2 text-sm font-medium text-black">
                  {formatDimensions(sofa.dimensions)}
                </div>
                <div className="text-xs text-black/60">Dimensions</div>
              </div>
              <div className="rounded-xl border border-black/10 p-4">
                <div className="text-2xl">🎨</div>
                <div className="mt-2 text-sm font-medium text-black">
                  {sofa.material}
                </div>
                <div className="text-xs text-black/60">Material</div>
              </div>
              <div className="rounded-xl border border-black/10 p-4">
                <div className="text-2xl">💺</div>
                <div className="mt-2 text-sm font-medium text-black">3 Seater</div>
                <div className="text-xs text-black/60">Capacity</div>
              </div>
              <div className="rounded-xl border border-black/10 p-4">
                <div className="text-2xl">✨</div>
                <div className="mt-2 text-sm font-medium text-black">Premium</div>
                <div className="text-xs text-black/60">Quality</div>
              </div>
            </div>

            {/* Device-specific AR info */}
            {isMobile && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {isIOS ? "📱" : "🤖"}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      AR Ready on {isIOS ? "iOS" : "Android"}!
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      {isIOS
                        ? "Tap 'View in AR' to place the sofa in your space using AR Quick Look"
                        : "Tap 'View in AR' to place the sofa in your space using Scene Viewer"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: 3D Model Viewer */}
          <div className="flex flex-col gap-4">
            <div className="relative h-[500px] overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg">
              <ModelViewer
                src={sofa.modelPath}
                iosSrc="/models/sofa.usdz"
                alt={sofa.name}
                autoRotate={true}
                cameraControls={true}
                ar={true}
                arModes="webxr scene-viewer quick-look"
                poster={sofa.thumbnail}
                className="h-full w-full"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-black/50">
              {isMobile ? (
                <>
                  <span>👆 Touch to rotate</span>
                  <span>•</span>
                  <span>🤏 Pinch to zoom</span>
                </>
              ) : (
                <>
                  <span>🖱️ Click and drag to rotate</span>
                  <span>•</span>
                  <span>🔍 Scroll to zoom</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h3 className="text-center text-3xl font-bold text-black">
            How AR Works
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white">
                1
              </div>
              <h4 className="mt-4 font-semibold text-black">Tap View in AR</h4>
              <p className="mt-2 text-sm text-black/70">
                Click the AR button on the 3D model above
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white">
                2
              </div>
              <h4 className="mt-4 font-semibold text-black">
                Point Your Camera
              </h4>
              <p className="mt-2 text-sm text-black/70">
                Scan the floor where you want to place the sofa
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white">
                3
              </div>
              <h4 className="mt-4 font-semibold text-black">
                See It in Your Space
              </h4>
              <p className="mt-2 text-sm text-black/70">
                Move around to see the sofa from all angles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-black/60 sm:px-8">
          <p>AR Furniture Viewer • Built with Next.js & model-viewer</p>
          <p className="mt-2">
            {isIOS && "iOS AR Quick Look • "}
            {!isIOS && isMobile && "Android Scene Viewer • "}
            WebXR Compatible
          </p>
        </div>
      </footer>
    </main>
  );
}
