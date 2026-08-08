import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { GUMROAD_URL, PRO_PRICE_LABEL, PRO_VERSION } from "@/lib/site";

const bullets = [
  "Full predictive engine with dictionary and bigram scoring",
  "Personal learning vocabulary with a manager UI",
  "Optional local AI through llama-server, offline",
  "Live HUD, stats, setup wizard and full settings",
  "Import and export your mappings between machines",
  "One license, one PC, device-bound activation",
];

const PricingSection = () => (
  <section id="pricing" className="relative scroll-mt-20 py-24">
    <div className="pointer-events-none absolute inset-0 gradient-hero" />
    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          One-time purchase, <span className="gradient-text">no subscription</span>
        </h2>
        <p className="text-muted-foreground">Sold exclusively through Gumroad.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-lg rounded-2xl border border-primary/30 bg-card/70 p-8 box-glow"
      >
        <h3 className="font-heading text-xl font-bold">Broken Key Remapper Pro</h3>
        <p className="mb-6 text-sm text-muted-foreground">Version {PRO_VERSION} · Windows 10/11</p>

        <div className="mb-8 flex items-end gap-2">
          <span className="font-heading text-5xl font-bold">{PRO_PRICE_LABEL}</span>
          <span className="pb-2 text-sm text-muted-foreground">one-time</span>
        </div>

        <ul className="mb-8 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <Button variant="hero" size="lg" className="w-full py-6 text-base" asChild>
          <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buy on Gumroad
          </a>
        </Button>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Payments are processed securely by Gumroad.
        </p>

      </motion.div>
    </div>
  </section>
);

export default PricingSection;
