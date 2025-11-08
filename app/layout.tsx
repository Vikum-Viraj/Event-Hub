import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from '../components/LightRays';
import Navbar from "@/components/Navbar";

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event you Mustn't know",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${SchibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
        <Navbar/>
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center"
            raysColor="#5dfeca"
            raysSpeed={1.5}
            lightSpread={0.9}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
