import { motion } from "framer-motion";
import { Brain, Layers, Settings, Keyboard, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Prediction Engine",
    description: "The app knows what letter you probably need next based on common English words and letter patterns. Just press your working key and it types the right character for you.",
  },
  {
    icon: Layers,
    title: "One Key Covers Many",
    description: "Map a single working key to all your broken ones. Press Shift + that key to cycle through the other characters whenever the prediction picks the wrong one.",
  },
  {
    icon: Settings,
    title: "Easy Key Mapping",
    description: "Add, edit, or remove key mappings anytime through a simple interface. Your settings are saved automatically so they persist between sessions.",
  },
  {
    icon: Keyboard,
    title: "Works With Any Key",
    description: "Letters, numbers, symbols, arrow keys, function keys, and more. If a key on your keyboard is broken, this tool can handle it.",
  },
  {
    icon: BarChart3,
    title: "Accurate Predictions",
    description: "The app tracks what you've been typing to make better guesses. If the wrong letter appears, just press Shift to fix it instantly.",
  },
  {
    icon: Zap,
    title: "Lightweight and Portable",
    description: "A single small file you can run from anywhere. No installation, no setup wizards, and no bloat. Works on any Windows PC.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why People Choose{" "}
            <span className="gradient-text">Broken Key Remapper</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A simple tool that solves a frustrating problem. Keep typing normally even when your keyboard is damaged.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card gradient-card"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
