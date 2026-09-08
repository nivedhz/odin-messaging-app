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
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-10">
          <div className="pt-40 text-center">
            <h1 className="text-6xl font-medium">Elevate Your</h1>
            <h1 className="text-6xl font-medium">Messaging Experience</h1>
          </div>
          <div className="flex flex-col gap-5 items-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                Unlock your messaging potential in a fully regulated
              </p>
              <p className="text-muted-foreground">
                environment, powered by Sendzy
              </p>
            </div>
            <Button
              className={
                "py-5 px-5 rounded-full bg-[#c7baed] hover:bg-[#c7baed]/80 cursor-pointer"
              }
            >
              Sign Up & Start Messaging
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between min-w-full px-60">
          <SpotlightCard className="w-72 shadow-2xl bg-transparent tranform translate-y-3/4 animate-[float_2s_ease-in-out_infinite] flex flex-col gap-2 border-muted-foreground/20 justify-between">
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
          <SpotlightCard className="w-72 shadow-2xl bg-transparent animate-[float_2s_ease-in-out_infinite] flex flex-col gap-2 border-muted-foreground/20 delay-200">
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
    </>
  );
};

export default Hero;
