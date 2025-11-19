"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getARUnsupportedMessage, isARSupported } from "@/lib/webxr-utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ARViewer = dynamic(() => import("@/components/ARViewer").then((mod) => mod.ARViewer), {
  ssr: false,
  loading: () => (
    <div className="flex h-[80vh] items-center justify-center rounded-3xl border border-slate-200 bg-white">
      <LoadingSpinner label="Preparing AR viewer" />
    </div>
  ),
});

export default function ARPage() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    isARSupported()
      .then((value) => {
        setSupported(value);
        if (!value) {
          setTimeout(() => router.replace("/viewer"), 3500);
        }
      })
      .catch(() => {
        setSupported(false);
        setTimeout(() => router.replace("/viewer"), 3500);
      });
  }, [router]);

  if (supported === null) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-16">
        <LoadingSpinner label="Checking device capabilities" />
      </main>
    );
  }

  if (!supported) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-3xl font-semibold text-slate-900">AR is not supported on this device yet.</p>
        <p className="text-slate-600">{getARUnsupportedMessage()} Redirecting you to the 3D viewer…</p>
        <Link href="/viewer" className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg">
          Go to 3D viewer now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Immersive AR</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:mt-2 sm:text-3xl">Try the sofa in your space</h1>
          <p className="text-xs text-slate-600 sm:text-sm">📱 Camera access required for AR experience</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 sm:px-4 sm:py-2 sm:text-sm">
          ← Back home
        </Link>
      </div>

      {/* Camera permission notice */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 sm:text-base">
        <p className="font-medium mb-2">📷 Camera Access Required</p>
        <p>When you tap "Start AR", your browser will ask for camera permission. This is required to scan your space and place the sofa in AR.</p>
        <p className="mt-2 text-xs opacity-75">Make sure to allow camera access when prompted by your browser.</p>
      </div>

      <ARViewer />
    </main>
  );
}
