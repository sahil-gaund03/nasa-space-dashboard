import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether — NASA Space Dashboard",
  description: "Realtime NASA intelligence platform with scientific visualization and AI-powered space analytics.",
  authors: [{ name: "Aether Mission Control" }],
  openGraph: {
    title: "Aether — NASA Space Dashboard",
    description: "Realtime NASA intelligence platform with scientific visualization and AI-powered space analytics.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether — NASA Space Dashboard",
    description: "Realtime NASA intelligence platform with scientific visualization and AI-powered space analytics.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased text-foreground bg-background relative min-h-screen">
        {children}
      </body>
    </html>
  );
}
