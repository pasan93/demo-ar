import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Sofa AR Viewer",
  description: "Preview the Modern 3-Seater Sofa in 3D and AR directly in your space.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#0f172a",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sofa AR Viewer",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased mobile-safe-area">
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
