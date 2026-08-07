import { motion } from "framer-motion";
import { PRO_VERSION } from "@/lib/site";

const rows: { label: string; free: string; pro: string }[] = [
  { label: "Price", free: "Free forever", pro: "Paid, via Gumroad" },
  { label: "Predictive remap", free: "Yes, basic", pro: "Yes, advanced engine" },
  { label: "1-to-many mapping", free: "Yes, basic", pro: "Yes, full control" },
  { label: "Shift cycle", free: "Yes", pro: "Yes" },
  { label: "Personal learning dictionary", free: "Limited", pro: "Yes, with manager UI" },
  { label: "Local AI (llama-server)", free: "No", pro: "Optional" },
  { label: "HUD, stats and settings", free: "Basic", pro: "Full depth" },
  { label: "License", free: "None needed", pro: "Gumroad key, 1 PC" },
  { label: "Support", free: "Community, as-is", pro: "License-based support" },
];

const ComparisonSection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Free versus <span className="gradient-text">Pro</span>
        </h2>
        <p className="text-muted-foreground">
          The free versions stay useful and available. Pro adds the full prediction engine, learning and optional local AI.
        </p>
      </motion.div>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card/40">
        <div className="grid grid-cols-3 border-b border-border/60 bg-secondary/40 px-4 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 sm:text-sm">
          <span>Capability</span>
          <span>Free v1.0 / v1.1</span>
          <span className="text-primary">Pro {PRO_VERSION}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid grid-cols-3 items-center gap-2 px-4 py-4 text-xs sm:px-6 sm:text-sm ${
              i % 2 ? "bg-background/30" : ""
            }`}
          >
            <span className="font-medium text-foreground">{r.label}</span>
            <span className="text-muted-foreground">{r.free}</span>
            <span className="text-foreground">{r.pro}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ComparisonSection;
