import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart } from "lucide-react";
import { DOWNLOAD_V11, GUMROAD_URL } from "@/lib/site";

const FinalCtaSection = () => (
  <section className="relative overflow-hidden py-24">
    <div className="pointer-events-none absolute inset-0 gradient-hero" />
    <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container relative mx-auto px-4 text-center"
    >
      <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-bold md:text-4xl">
        Stop letting one dead key <span className="gradient-text">kill a good laptop</span>
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
        Remap what is broken, predict what you meant, and keep your machine in service.
      </p>
      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button variant="hero" size="lg" className="px-8 py-6 text-base" asChild>
          <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Get Pro
          </a>
        </Button>
        <Button variant="hero-outline" size="lg" className="px-8 py-6 text-base" asChild>
          <a href={DOWNLOAD_V11} download>
            <Download className="mr-2 h-4 w-4" />
            Download free v1.1
          </a>
        </Button>
      </div>
    </motion.div>
  </section>
);

export default FinalCtaSection;
