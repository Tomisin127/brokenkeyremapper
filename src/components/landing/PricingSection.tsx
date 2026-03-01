import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "7-Day Free Trial",
    price: "Free",
    description: "Try before you buy — no credit card needed.",
    features: ["Up to 3 key mappings", "Full prediction engine", "All features unlocked", "7-day access"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Full Version",
    price: "$10",
    priceLabel: "one-time payment",
    description: "Unlock everything. Forever.",
    features: ["Unlimited key mappings", "Full prediction engine", "Priority support", "Lifetime updates", "INI config export"],
    cta: "Buy Now — $10",
    featured: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 gradient-hero opacity-50" />
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Start with the free trial or get the full version for a one-time price of $10.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl border p-8 ${
                plan.featured
                  ? "border-primary/40 bg-card box-glow"
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Best Value
                </div>
              )}
              <h3 className="mb-1 font-heading text-xl font-bold">{plan.name}</h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.priceLabel && <span className="text-sm text-muted-foreground">{plan.priceLabel}</span>}
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? "hero" : "hero-outline"}
                className="w-full py-5"
                asChild
              >
                <a href="#">{plan.cta}</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
