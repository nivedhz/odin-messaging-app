import Link from "next/link";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

const Navbar = () => {
  return (
    <div className="px-10 md:px-20 lg:px-40 py-3 flex items-center justify-between">
      <h1 className="text-lg font-medium flex items-center">
        <Send width={30} color="#c7baed" />
        Sendzy
      </h1>
      <div className="flex gap-2">
        <Link href={"login"}>
          <Button
            variant={"outline"}
            className={"bg-transparent cursor-pointer"}
          >
            Login
          </Button>
        </Link>
        <Link href={"sign-up"}>
          <Button className={"bg-brand hover:bg-brand/80 cursor-pointer"}>
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
