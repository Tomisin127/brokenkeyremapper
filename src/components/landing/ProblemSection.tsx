import { motion } from "framer-motion";
import { KeyRound, Repeat, Wrench, Laptop } from "lucide-react";

const problems = [
  {
    icon: KeyRound,
    title: "One dead key, endless friction",
    description:
      "A laptop can be perfectly fast and healthy, yet painful to use because a single letter no longer registers.",
  },
  {
    icon: Repeat,
    title: "Remappers only do 1 to 1",
    description:
      "Classic remapping software swaps one key for one character. With several dead keys, you run out of spare keys fast.",
  },
  {
    icon: Wrench,
    title: "Repairs are costly or impractical",
    description:
      "On thin laptops the keyboard is often bonded to the chassis, so a small failure turns into an expensive service job.",
  },
  {
    icon: Laptop,
    title: "The fallback is wasteful",
    description:
      "People carry an external keyboard everywhere or replace an otherwise capable machine. Software can extend device life instead.",
  },
];

const ProblemSection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Keyboards are one of the most common <span className="gradient-text">laptop failure points</span>
        </h2>
        <p className="text-muted-foreground">
          Millions of PCs lose a few keys over their lifetime. The rest of the machine usually keeps working just fine.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-6 gradient-card"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
