import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import guiScreenshot from "@/assets/gui-screenshot.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              Windows Utility · Lightweight · No Install Required
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Type Anything,{" "}
              <span className="gradient-text">Even on a Broken Keyboard</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
              Got broken keys? Broken Key Remapper lets you assign any broken key to a working one. It even predicts
              what you're trying to type so you barely notice the difference.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
                <a href="#pricing">
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </a>
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6" asChild>
                <a href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  See How It Works
                </a>
              </Button>
            </div>
          </motion.div>

          {/* GUI Screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl border border-border/50 bg-card/50 p-2 box-glow">
              <img
                src={guiScreenshot}
                alt="Broken Key Remapper GUI showing key mappings and prediction engine"
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 rounded-lg border border-accent/30 bg-card px-4 py-2 box-glow-accent"
            >
              <p className="text-xs font-medium text-accent">✨ Predictive Engine Active</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
