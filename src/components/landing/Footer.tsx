import { Keyboard } from "lucide-react";
import { GUMROAD_URL, SUPPORT_EMAIL } from "@/lib/site";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/30 py-12">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <a href="#" className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
            <Keyboard className="h-5 w-5 text-primary" />
            Broken Key Remapper
          </a>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Predictive key remapping for damaged keyboards. Windows. Runs locally on your machine.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Get Pro on Gumroad</a></li>
            <li><a href="#free-versions" className="transition-colors hover:text-foreground">Free downloads</a></li>
            <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
            <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-foreground">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Broken Key Remapper. Windows. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
