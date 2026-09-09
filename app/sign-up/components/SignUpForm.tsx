import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleSignUp } from "../actions";
import SignUpButton from "./SignUpButton";

const SignUpForm = () => {
  const inputStyles =
    "h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 transition-all focus-visible:border-[#c7baed]/60 focus-visible:ring-4 focus-visible:ring-[#c7baed]/20 hover:border-white/20";

  return (
    <Card className="gap-0 overflow-hidden rounded-3xl border-white/10 bg-white/[0.07] py-0 shadow-2xl shadow-black/40 backdrop-blur-2xl">
      <CardHeader className="flex flex-col gap-3 px-6 pt-7 sm:px-8">
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Create your account
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-white/55">
            Pick a username and start messaging in seconds.
          </CardDescription>
        </div>
      </CardHeader>
      <form className="group/form" action={handleSignUp}>
        <CardContent className="px-6 pt-6 sm:px-8">
          <div className="flex flex-col gap-5 pb-6">
            <div className="grid gap-2">
              <Label
                htmlFor="username"
                className="text-white/70 transition-colors group-focus-within/form:text-white"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                autoComplete="username"
                name="username"
                required
                className={inputStyles}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                name="email"
                required
                className={inputStyles}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/70">
                  Password
                </Label>
                <span className="text-xs text-white/40">8+ characters</span>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                name="password"
                placeholder="········"
                className={inputStyles}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 border-t border-white/10 bg-white/3 px-6 py-6 sm:px-8">
          <SignUpButton />
          <p className="text-center text-sm text-white/55">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="font-medium text-brand underline-offset-4 transition-colors hover:text-[#dcd2f5] hover:underline"
            >
              Log in
            </Link>
          </p>
          <p className="text-center text-[11px] leading-relaxed text-white/35">
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpForm;
