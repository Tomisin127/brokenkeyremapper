import { motion } from "framer-motion";
import appInterface from "@/assets/app-interface.jpg";

const ScreenshotSection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          The <span className="gradient-text">control panel</span>
        </h2>
        <p className="text-muted-foreground">
          Mappings, mapped mode, prediction HUD, setup wizard, statistics and the live AI inference status, all in one
          compact window.
        </p>
      </motion.div>

      <motion.figure
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-2 box-glow"
      >
        <img
          src={appInterface}
          alt="Broken Key Remapper Pro application window showing key mappings, mapped mode enabled and AI inference ready on port 8765"
          loading="lazy"
          className="w-full rounded-xl"
        />
        <figcaption className="px-3 py-3 text-center text-xs text-muted-foreground">
          Real-time inference running locally, AI ready on port 8765.
        </figcaption>
      </motion.figure>
    </div>
  </section>
);

export default ScreenshotSection;
