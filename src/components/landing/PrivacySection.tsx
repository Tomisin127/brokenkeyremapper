import { motion } from "framer-motion";
import { ShieldCheck, WifiOff, Cpu, KeyRound, Terminal } from "lucide-react";
import { NODE_DOWNLOAD_URL } from "@/lib/site";

const points = [
  { icon: WifiOff, title: "Core prediction works offline", description: "The dictionary, bigram and learning engines never need a network connection." },
  { icon: Cpu, title: "Optional AI stays local", description: "AI assistance runs through a local llama-server with a GGUF model on your own machine." },
  { icon: ShieldCheck, title: "No cloud typing pipeline", description: "Your keystrokes are not streamed to a remote service for prediction." },
  { icon: KeyRound, title: "Internet for activation only", description: "License activation goes through Gumroad. After that, Pro runs locally." },
];

const PrivacySection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Local by design, <span className="gradient-text">private by default</span>
        </h2>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl border border-success/20 bg-card/50 p-6">
            <p.icon className="mb-4 h-5 w-5 text-success" />
            <h3 className="mb-2 font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border/60 bg-secondary/30 p-6">
        <div className="flex items-start gap-3">
          <Terminal className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="mb-1 font-semibold">Using local MCP support?</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Local MCP support requires the latest version of Node.js installed on your computer.{" "}
              <a
                href={NODE_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Download the latest Node.js
              </a>
              , then restart Broken Key Remapper Pro.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PrivacySection;
