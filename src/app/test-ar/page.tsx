"use client";

import Link from "next/link";

export default function TestARPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-block text-blue-600">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-4">iOS AR Quick Look Test</h1>
        
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Test 1: Direct USDZ Link</h2>
            <p className="text-gray-600 mb-4">
              This uses a native iOS AR Quick Look link (Apple's recommended method)
            </p>
            <a
              rel="ar"
              href="/models/sofa.usdz"
              className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold"
            >
              🎯 Open AR (Native iOS)
              <img alt="" />
            </a>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-semibold mb-4">Test 2: Apple Sample (Teacup)</h2>
            <p className="text-gray-600 mb-4">
              This uses Apple's official sample USDZ file (32KB). If this works, 
              AR Quick Look is functional and the issue is with the sofa USDZ file.
            </p>
            <a
              rel="ar"
              href="/models/test-chair.usdz"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 text-white font-semibold"
            >
              🧪 Test with Apple Sample
              <img alt="" />
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Test 3: With Custom Settings</h2>
            <p className="text-gray-600 mb-4">
              iOS AR Quick Look with allowsContentScaling disabled
            </p>
            <a
              rel="ar"
              href="/models/sofa.usdz#allowsContentScaling=0"
              className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold"
            >
              🎯 Open AR (No Scaling)
              <img 
                src="/images/sofa-thumbnail.jpg" 
                alt="Sofa preview"
                className="hidden"
              />
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Diagnostics</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Device:</strong>{" "}
                <span id="device-info">
                  {typeof navigator !== 'undefined' ? navigator.userAgent : 'Loading...'}
                </span>
              </p>
              <p>
                <strong>iOS Detected:</strong>{" "}
                <span id="ios-check">
                  {typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent) 
                    ? '✅ Yes' 
                    : '❌ No'}
                </span>
              </p>
              <p>
                <strong>USDZ File:</strong>{" "}
                <a 
                  href="/models/sofa.usdz" 
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Check if file is accessible
                </a>
              </p>
              <p className="mt-4 text-xs text-gray-500">
                <strong>Note:</strong> This test page bypasses model-viewer entirely 
                to test iOS AR Quick Look directly. If this works, the issue is with 
                model-viewer integration. If it doesn't work, the issue is with the 
                USDZ file itself.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Troubleshooting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              <li>Make sure you're using <strong>Safari</strong> on iOS (not Chrome)</li>
              <li>iOS 12+ required (iOS 15+ recommended)</li>
              <li>Camera permissions must be allowed</li>
              <li>Try on a different network (cellular vs WiFi)</li>
              <li>Clear Safari cache if previously failed</li>
              <li>File size: 126MB - may take time to load</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

