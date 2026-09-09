import { Button } from "@/components/ui/button";
import FloatingCard from "./FloatingCard";
import Link from "next/link";

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
            <Link href={"sign-up"}>
              <Button
                className={
                  "py-5 px-5 rounded-full bg-[#c7baed] hover:bg-[#c7baed]/80 cursor-pointer"
                }
              >
                Sign Up & Start Messaging
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between min-w-full px-60">
          <div className="transform -translate-y-82.5">
            <FloatingCard
              name="Humpty"
              message="I am sitting on a high place"
              className="delay-1000"
            />
          </div>
          <FloatingCard
            name="Cindrella"
            message="Ah shit! I just lost my shoe."
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
