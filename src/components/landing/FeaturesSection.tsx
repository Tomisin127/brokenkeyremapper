import { motion } from "framer-motion";
import { Brain, Layers, Settings, Keyboard, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Predictive Typing Engine",
    description: "Uses English dictionary + bigram frequency to predict the most likely next character. Types for you when your physical keys are broken.",
  },
  {
    icon: Layers,
    title: "Single Key → Multiple Keys",
    description: "One working key can be mapped to all broken keys. Cycle outputs easily using Shift + key.",
  },
  {
    icon: Settings,
    title: "Dynamic Key Mapping",
    description: "Add, edit, remove mappings anytime. Save your configuration in an easy-to-edit INI file.",
  },
  {
    icon: Keyboard,
    title: "Fully Customizable",
    description: "Works with letters, numbers, symbols, and common keyboard keys. Supports multiple layouts and predictive suggestions.",
  },
  {
    icon: BarChart3,
    title: "Intelligent Buffer System",
    description: "Tracks what you've typed for better predictions. Automatically backspaces if you change prediction manually.",
  },
  {
    icon: Zap,
    title: "Lightweight & Portable",
    description: "Single EXE, no installation required. Works on Windows PCs out of the box.",
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
            Why Broken Key Remapper Works{" "}
            <span className="gradient-text">Better Than Anything Else</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A smart combination of predictive AI and intuitive mapping that gets you typing again in seconds.
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
