import { motion } from "framer-motion";
import { Brain, Layers, Settings, Keyboard, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Keystroke Prediction",
    description: "Powered by a built-in Small Language Model (SLM) that analyzes a 300,000-word English dictionary and 286,000 bigram frequencies to predict the most likely next character in real time at the keyboard level.",
  },
  {
    icon: Layers,
    title: "1-to-Many Key Mapping",
    description: "Map multiple broken keys to a single working key, allowing one pressable key to intelligently produce several outputs based on context.",
  },
  {
    icon: Settings,
    title: "Context-Aware Predictions",
    description: "The engine tracks what you type and uses surrounding words to infer the most probable continuation, delivering smoother and faster typing.",
  },
  {
    icon: Keyboard,
    title: "Adaptive Cycling with Shift",
    description: "Quickly cycle through mapped outputs using Shift + key, giving you precise manual control whenever the prediction needs a correction.",
  },
  {
    icon: BarChart3,
    title: "Fully Local and Private",
    description: "Everything runs directly on your computer, completely offline. No internet, cloud services, or external processing required.",
  },
  {
    icon: Zap,
    title: "Lightweight and Instant",
    description: "Optimized for keyboard-level performance, delivering fast and reliable predictions without slowing down your system. No installation needed.",
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
            The First Keyboard-Level{" "}
            <span className="gradient-text">Predictive Engine</span> for Broken Keys
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            AI-assisted input reconstruction for damaged or limited keyboards. It predicts each key you intend to type next, restoring characters your keyboard can no longer produce.
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
