import { motion } from "framer-motion";
import { Check } from "lucide-react";

const points = [
  "AI inside physical keyboards: a small language model reconstructs characters at the keystroke layer",
  "Real-time inference, fast enough to keep up with natural typing speed",
  "Swap in your own local GGUF model through llama-server whenever you want",
  "1-to-many smart mapping: one working key can stand in for several missing characters",
  "Shift-cycle override the moment a prediction is wrong",
  "Personal vocabulary learning that adapts to how you write",
  "AI stays optional: the dictionary and bigram engine keeps working with the model switched off",
];


const SolutionSection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-5 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">AI inside physical keyboards</span>, the way T9 rebuilt the numpad
          </h2>
          <p className="mb-8 text-muted-foreground">
            T9 let people write full sentences on nine keys because software filled the gap left by limited physical
            input. Broken Key Remapper Pro does the same for a damaged keyboard, with a small language model doing
            real-time inference on your own machine and a classic dictionary engine underneath when you prefer AI off.
          </p>

          <ul className="space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 box-glow"
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">Prediction pipeline</p>
          <div className="space-y-3 font-mono text-xs sm:text-sm">
            {[
              { step: "1", label: "keystroke captured", detail: "host key [K]" },
              { step: "2", label: "candidates from mapping", detail: "e · j · ;" },
              { step: "3", label: "scored with dictionary + bigrams", detail: "local trie" },
              { step: "4", label: "learned words boost", detail: "your vocabulary" },
              { step: "5", label: "SLM real-time inference (optional)", detail: "your GGUF model" },
              { step: "6", label: "character emitted", detail: "e" },
            ].map((r) => (
              <div
                key={r.step}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/50 px-3 py-2"
              >
                <span className="text-foreground">
                  <span className="mr-2 text-primary">{r.step}</span>
                  {r.label}
                </span>
                <span className="shrink-0 text-muted-foreground">{r.detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default SolutionSection;
