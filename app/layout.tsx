import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import GradientWaves from "@/components/GradientWaves";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sendzy",
  description: "Sendzy - a simple chat app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col text-white">
        {/* Shared ambient background — mounted once, persists across routes */}
        <div aria-hidden className="fixed inset-0 z-0">
          <GradientWaves
            horizonColor="#5227FF"
            waveColor="#FF9FFC"
            crestColor="#FFFFFF"
            speed={0.35}
            amplitude={2.3}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1}
            height={6}
            fogDepth={16}
            detail="medium"
            brightness={0.95}
            opacity={0.9}
            parallaxStrength={0.5}
            grain
            grainIntensity={0.05}
            mouseInteraction={false}
          />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
