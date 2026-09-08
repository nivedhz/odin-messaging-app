import GradientWaves from "@/components/GradientWaves";
import Navbar from "@/components/Navbar";
import SpotlightCard from "@/components/SpotlightCard";
import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveUpRight } from "lucide-react";

const Hero = () => {
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
        <div className="flex flex-col items-center">
          <div className="py-30 text-center">
            <h1 className="text-6xl font-medium">Elevate Your</h1>
            <h1 className="text-6xl font-medium">Messaging Experience</h1>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Unlock your messaging potential in a fully regulated
            </p>
            <p className="text-muted-foreground">
              environment, powered by Sendzy
            </p>
          </div>
          <div className="py-5">
            <Button
              className={
                "py-5 px-5 rounded-full bg-[#c7baed] hover:bg-[#c7baed]/80 cursor-pointer"
              }
            >
              Sign Up & Start Messaging
            </Button>
          </div>
          <div className="flex items-center justify-between min-w-full px-60">
            <SpotlightCard className="w-72 shadow-2xl bg-transparent tranform translate-y-1/2 animate-[float_2s_ease-in-out_infinite] flex flex-col gap-2 border-muted-foreground/20 justify-between">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">Humpty</CardTitle>
                <CardAction>
                  <Button size={"icon"}>
                    <MoveUpRight />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="">
                <p className="text-sm text-muted-foreground">
                  I&apos;m sitting somewhere high.
                </p>
              </CardContent>
            </SpotlightCard>
            <SpotlightCard className="w-72 shadow-2xl bg-transparent animate-[float_2s_ease-in-out_infinite] flex flex-col gap-2 border-muted-foreground/20">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">Cindrella</CardTitle>
                <CardAction>
                  <Button size={"icon"}>
                    <MoveUpRight />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="">
                <p className="text-sm text-muted-foreground">
                  Ah shit! I just lost my shoe.
                </p>
              </CardContent>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
