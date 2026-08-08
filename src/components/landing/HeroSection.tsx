import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Shield } from "lucide-react";
import { GUMROAD_URL, DOWNLOAD_V11, PRO_VERSION } from "@/lib/site";
import appInterface from "@/assets/app-interface.jpg";

const keyRow = [
  { label: "Q", broken: false },
  { label: "W", broken: false },
  { label: "E", broken: true },
  { label: "R", broken: false },
  { label: "T", broken: false },
  { label: "Y", broken: false },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mb-5 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              AI inside physical keyboards · Pro {PRO_VERSION} · Windows
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              The key is dead. <span className="gradient-text">The laptop isn&apos;t.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-muted-foreground">
              Broken Key Remapper Pro puts AI inside your physical keyboard. Map several broken keys onto one working
              key and a small language model reconstructs what you meant with real-time inference on your own machine.
              Swap in your own GGUF model any time, or run the classic dictionary engine with AI switched off.
            </p>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button variant="hero" size="lg" className="px-8 py-6 text-base" asChild>
                <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy Pro on Gumroad
                </a>
              </Button>
              <Button variant="hero-outline" size="lg" className="px-8 py-6 text-base" asChild>
                <a href={DOWNLOAD_V11} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download free v1.1
                </a>
              </Button>
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start">
              <Shield className="h-3.5 w-3.5 text-success" />
              Windows · Local real-time inference · Bring your own model
            </p>

          </motion.div>

          {/* Keyboard + prediction HUD visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 box-glow backdrop-blur-sm sm:p-8">
              <figure className="mb-6">
                <img
                  src={appInterface}
                  alt="Broken Key Remapper Pro application window showing key mappings, mapped mode enabled and AI inference ready on port 8765"
                  width={1200}
                  height={800}
                  className="w-full rounded-xl border border-border/60"
                />
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  Real-time local inference, AI ready on port 8765.
                </figcaption>
              </figure>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">

                {keyRow.map((k) => (
                  <div
                    key={k.label}
                    className={
                      k.broken
                        ? "flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-destructive/60 bg-destructive/5 font-mono text-sm text-destructive/70 sm:h-14 sm:w-14"
                        : "flex h-12 w-12 items-center justify-center rounded-lg border border-border/70 bg-secondary font-mono text-sm text-foreground sm:h-14 sm:w-14"
                    }
                  >
                    {k.label}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4 font-mono text-xs sm:text-sm">
                <p className="text-muted-foreground">typed: <span className="text-foreground">pr_dict</span></p>
                <p className="mt-2 text-muted-foreground">
                  host key <span className="text-foreground">[K]</span> →{" "}
                  <span className="text-primary">e</span>
                </p>
                <p className="mt-2 text-muted-foreground">
                  output: <span className="text-foreground">predict</span>
                </p>
                <p className="mt-2 text-success">source: dictionary + bigrams · local</p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-2 rounded-lg border border-accent/30 bg-card px-4 py-2 box-glow-accent"
            >
              <p className="text-xs font-medium text-accent">Prediction HUD</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
