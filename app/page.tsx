import GradientWaves from "@/components/GradientWaves";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full p-4 bg-background">
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}
