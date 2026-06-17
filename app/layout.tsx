import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

export const viewport: Viewport = {
  themeColor: "#fb923c", // The orange from your header
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents auto-zooming on mobile inputs
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Park N Pay",
  description: "Penang Smart Parking Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Park N Pay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* WRAP CHILDREN WITH THE PROVIDER */}
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}