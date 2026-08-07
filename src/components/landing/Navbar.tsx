import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Keyboard, Menu, X } from "lucide-react";
import { GUMROAD_URL } from "@/lib/site";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Free versions", href: "#free-versions" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2 font-heading text-base font-bold text-foreground sm:text-lg">
          <Keyboard className="h-5 w-5 text-primary" />
          Broken Key Remapper
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
          <Button variant="hero" size="sm" asChild>
            <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Get Pro</a>
          </Button>
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-4 p-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button variant="hero" size="sm" asChild>
              <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">Get Pro</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
