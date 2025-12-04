import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Style Studio | Digital Darkroom",
  description: "Transform cartoon concepts into gritty, photorealistic cinematography with AI-powered style transfer and prompt generation.",
  keywords: ["AI", "image generation", "style transfer", "art direction", "cinematography", "Gemini"],
  authors: [{ name: "Style Studio" }],
  openGraph: {
    title: "The Style Studio",
    description: "A high-fidelity Digital Darkroom for turning cartoon concepts into gritty, photorealistic cinematography.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-20 lg:ml-64 bg-grid-pattern">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
