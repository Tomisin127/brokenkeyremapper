import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Monitor } from "lucide-react";
import { DOWNLOAD_V10, DOWNLOAD_V11 } from "@/lib/site";

const versions = [
  {
    name: "Broken Key Remapper v1.1",
    tag: "Recommended free build",
    description: "Predictive remapping basics, 1-to-many mapping and Shift cycling. Portable executable, no installer.",
    href: DOWNLOAD_V11,
  },
  {
    name: "Broken Key Remapper v1.0",
    tag: "Original release",
    description: "The first public build with straightforward key mapping. Kept available for older setups.",
    href: DOWNLOAD_V10,
  },
];

const FreeDownloadsSection = () => (
  <section id="free-versions" className="relative scroll-mt-20 py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Earlier versions, <span className="gradient-text">free forever</span>
        </h2>
        <p className="text-muted-foreground">
          Free versions remain available. For the full predictive engine, learning dictionary and optional local AI,
          upgrade to Pro.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {versions.map((v) => (
          <div key={v.name} className="rounded-2xl border border-border/50 bg-card/50 p-6 gradient-card">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">{v.tag}</p>
            <h3 className="mb-2 text-lg font-semibold">{v.name}</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            <Button variant="hero-outline" className="w-full" asChild>
              <a href={v.href} download>
                <Download className="mr-2 h-4 w-4" />
                Free download
              </a>
            </Button>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 flex max-w-4xl items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <Monitor className="h-3.5 w-3.5" />
        Windows only. Free builds ship as portable executables where applicable.
      </p>
    </div>
  </section>
);

export default FreeDownloadsSection;
