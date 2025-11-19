"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sofa } from "@/lib/sofa-data";
import { isARSupported } from "@/lib/webxr-utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const SofaViewer = dynamic(() => import("@/components/SofaViewer").then((mod) => mod.SofaViewer), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-3xl border border-slate-200 bg-white">
      <LoadingSpinner label="Preparing 3D viewer" />
    </div>
  ),
});

export default function ViewerPage() {
  const [arReady, setArReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    isARSupported().then(setArReady).catch(() => setArReady(false));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Interactive 3D Viewer</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:mt-2 sm:text-3xl">{sofa.name}</h1>
          <p className="text-xs text-slate-500 sm:text-sm">👆 Drag to rotate · 🤏 Pinch to zoom</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 sm:px-4 sm:py-2 sm:text-sm"
        >
          ← Back home
        </Link>
      </div>
      <SofaViewer arSupported={arReady} onTryAR={() => router.push("/ar")} />
    </main>
  );
}
