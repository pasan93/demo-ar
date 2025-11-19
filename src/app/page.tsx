"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sofa } from "@/lib/sofa-data";
import { getARUnsupportedMessage, isARSupported, getDeviceInfo } from "@/lib/webxr-utils";

export default function HomePage() {
  const [arReady, setArReady] = useState<boolean | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null);

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
    isARSupported()
      .then(setArReady)
      .catch(() => setArReady(false));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-12 sm:px-8 sm:py-16">
      <section className="grid gap-8 rounded-2xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:gap-10 sm:rounded-[32px] sm:p-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6 sm:gap-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 sm:text-sm">Augmented Reality Preview</p>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">See Our Sofa in Your Space</h1>
            <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">{sofa.description}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:gap-6 sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
              <p className="text-3xl font-semibold text-slate-900">${sofa.price.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center sm:flex sm:flex-col sm:gap-1 sm:text-left lg:flex-col">
              <div className="rounded-lg bg-white/50 p-2 sm:p-0 sm:bg-transparent">
                <p className="text-xs text-slate-500 sm:text-sm">Width</p>
                <p className="text-lg font-semibold text-slate-900 sm:text-base">{sofa.dimensions.width} cm</p>
              </div>
              <div className="rounded-lg bg-white/50 p-2 sm:p-0 sm:bg-transparent">
                <p className="text-xs text-slate-500 sm:text-sm">Depth</p>
                <p className="text-lg font-semibold text-slate-900 sm:text-base">{sofa.dimensions.depth} cm</p>
              </div>
              <div className="rounded-lg bg-white/50 p-2 sm:p-0 sm:bg-transparent">
                <p className="text-xs text-slate-500 sm:text-sm">Height</p>
                <p className="text-lg font-semibold text-slate-900 sm:text-base">{sofa.dimensions.height} cm</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={arReady ? "/ar" : deviceInfo?.isMobile ? "/ar" : "/viewer"}
              className={`inline-flex h-12 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-xl transition sm:h-14 sm:px-8 sm:text-base ${
                arReady === false
                  ? deviceInfo?.isDesktop
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-slate-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {arReady === false
                ? deviceInfo?.isDesktop
                  ? "📱 Try on Mobile"
                  : "AR Unavailable"
                : "🎯 View in AR"}
            </Link>
            <Link
              href="/viewer"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-slate-200 px-6 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 sm:h-14 sm:px-8 sm:text-base"
            >
              👁️ View in 3D
            </Link>
          </div>
          {arReady === false && deviceInfo && (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                {deviceInfo.isDesktop ? "🌐 Desktop Detected" : "📱 Mobile Device"}
              </p>
              <p className="text-sm text-slate-600">{getARUnsupportedMessage()}</p>
              {deviceInfo.isDesktop && (
                <p className="text-sm text-slate-500 mt-2">
                  💡 <strong>Tip:</strong> Scan the QR code below with your phone to try AR!
                </p>
              )}
            </div>
          )}
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">1 unit = 1 cm · Optimized for iOS + Android</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-200 to-slate-100 p-4 sm:rounded-[28px] sm:p-6">
          <div className="absolute inset-4 rounded-xl border border-white/60 bg-white/60 sm:inset-6 sm:rounded-[24px]" />
          <div className="relative rounded-xl bg-white/90 p-3 shadow-2xl sm:rounded-[20px] sm:p-4">
            <Image
              src={sofa.thumbnail}
              alt={sofa.name}
              width={900}
              height={600}
              priority
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <div className="relative mt-4 rounded-xl bg-slate-900/80 p-3 text-white shadow-xl sm:mt-6 sm:rounded-2xl sm:p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-200 sm:text-sm">Details</p>
            <p className="mt-2 text-base font-semibold sm:text-lg">Modern 3-Seater Sofa</p>
            <p className="text-xs text-slate-200 sm:text-sm">Perfect proportions for living rooms, lounges, and collaboration areas.</p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 rounded-2xl border border-white/60 bg-white/90 p-6 sm:gap-6 sm:rounded-3xl sm:p-8 lg:grid-cols-3">
        {[
          {
            title: "True-to-scale",
            detail: "The model follows centimeter units so what you see in AR matches real-world dimensions.",
            icon: "📏",
          },
          {
            title: "Gesture friendly",
            detail: "Rotate, scale, and reposition with natural touch gestures optimized for mobile devices.",
            icon: "👆",
          },
          {
            title: "Instant fallback",
            detail: "No AR? Jump into the interactive 3D viewer with OrbitControls and continue exploring.",
            icon: "🔄",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 shadow-inner sm:rounded-2xl sm:p-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">{item.detail}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
