import { Keyboard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="#" className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
              <Keyboard className="h-5 w-5 text-primary" />
              Broken Key Remapper
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The simple fix for broken keyboards. Remap, predict, and keep typing.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "#" },
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
                  YouTube Demo
                </a>
              </li>
              <li>
                <a href="mailto:theun11que1@gmail.com" className="transition-colors hover:text-foreground">
                  theun11que1@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          © 2026 Paul Raimi. Broken Key Remapper. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
