import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import PayWithCryptoButton from "./PayWithCryptoButton";

const plans = [
  {
    name: "v1.1 Full Version",
    price: "$10",
    priceLabel: "one-time payment",
    description:
      "Turn a damaged keyboard into a smart predictive typing system. AI-powered input reconstruction with real-time language inference.",
    features: [
      "Unlimited key mappings (one key to many)",
      "AI predictive engine with dictionary and bigram support",
      "Shift + key cycling (switch between mapped outputs)",
      "Priority support",
      "Lifetime updates",
      "Config file export",
    ],
    cta: "Pay via Gumroad",
    featured: true,
    downloadUrl: "https://paulraimi.gumroad.com/l/fvagsp",
    supportsCrypto: true,
  },
  {
    name: "v1 Basic Version",
    price: "Free",
    description: "Simple 1-to-1 key remapping. Great if you just need the basics.",
    features: [
      "One-to-one key remapping",
      "Works with any key",
      "Lightweight single file",
      "Free forever",
    ],
    cta: "Download Free",
    featured: false,
    downloadUrl: "https://drive.google.com/file/d/1la8oZuGpvHiwyO-V1CHNu6wbdtDrun28/view?usp=drivesdk",
    supportsCrypto: false,
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
            Start with basic remapping for free, or unlock the full AI-powered v1.1 &mdash; pay with card via Gumroad, or with crypto on Base.
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
                {plan.priceLabel && (
                  <span className="text-sm text-muted-foreground">{plan.priceLabel}</span>
                )}
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

              <div className="space-y-3">
                <Button
                  variant={plan.featured ? "hero" : "hero-outline"}
                  className="w-full py-5"
                  asChild
                >
                  <a
                    href={plan.downloadUrl || "#"}
                    target={plan.downloadUrl ? "_blank" : undefined}
                    rel={plan.downloadUrl ? "noopener noreferrer" : undefined}
                  >
                    {plan.cta}
                  </a>
                </Button>

                {plan.supportsCrypto && <PayWithCryptoButton />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
