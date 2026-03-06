import { motion } from "framer-motion";
import { Download, Settings, Type, RotateCcw } from "lucide-react";
import brokenKeyboard from "@/assets/broken-keyboard.png";

const steps = [
  { icon: Download, title: "Download and Run", description: "Download the small application file and open it. No installation needed." },
  { icon: Settings, title: "Map Your Keys", description: "Tell the application which keys are broken and which working key should replace them." },
  { icon: Type, title: "Start Typing", description: "Type normally. The prediction engine figures out which broken key you need and types it for you." },
  { icon: RotateCcw, title: "Cycle with Shift", description: "If the wrong letter appears, hold Shift and press your key to cycle through the other options." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-border/30">
              <img
                src={brokenKeyboard}
                alt="A broken laptop keyboard with missing and cracked keycaps"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-medium text-foreground/80">
              Don't replace your keyboard. Remap it.
            </p>
          </motion.div>

          {/* Steps */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Get Started in <span className="gradient-text">4 Simple Steps</span>
              </h2>
              <p className="text-muted-foreground">Up and running in under a minute. No technical skills required. Works earlier in the typing process than grammar tools.</p>
            </motion.div>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
