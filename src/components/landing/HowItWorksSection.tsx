import { motion } from "framer-motion";
import { Settings, ToggleLeft, Type, RotateCcw } from "lucide-react";

const steps = [
  { icon: Settings, title: "Map your keys", description: "Tell Pro which characters your broken keys can no longer type and which working keys should host them." },
  { icon: ToggleLeft, title: "Press F12", description: "Enable mapping mode. Toggle it off any time with the same key." },
  { icon: Type, title: "Type normally", description: "Pro predicts the intended letter from context and emits it as you type." },
  { icon: RotateCcw, title: "Cycle if needed", description: "Wrong guess? Hold Shift and press your host key to cycle through the alternatives." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="relative scroll-mt-20 py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          How it <span className="gradient-text">works</span>
        </h2>
        <p className="text-muted-foreground">Set up once in about a minute. No technical background needed.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-sm font-bold text-primary">
                {i + 1}
              </span>
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
