import Link from "next/link";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

interface Link {
  href: string;
  label: string;
}

const links: Link[] = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

const Navbar = () => {
  return (
    <div className="px-30 py-3 flex items-center justify-between">
      <h1 className="text-lg font-medium flex items-center">
        <Send width={30} color="#c7baed" />
        Sendzy
      </h1>
      <nav className="flex gap-8">
        {links.map((link) => (
          <Link href={link.href} key={link.href} className="text-sm">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex gap-2">
        <Link href={"login"}>
          <Button variant={"outline"} className={"bg-transparent"}>
            Login
          </Button>
        </Link>
        <Link href={"sign-up"}>
          <Button
            className={"bg-[#c7baed] hover:bg-[#c7baed]/80 cursor-pointer"}
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
