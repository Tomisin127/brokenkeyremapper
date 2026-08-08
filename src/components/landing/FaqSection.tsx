import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SUPPORT_EMAIL } from "@/lib/site";

const faqs = [
  { q: "Does it work on Mac or Linux?", a: "Not yet. Broken Key Remapper Pro is Windows only for now." },
  { q: "Do I need AI for it to work?", a: "AI is the core of Pro and handles the hardest reconstructions with real-time local inference, but it stays optional. With the model switched off, the dictionary, bigram and learning engines keep working." },
  { q: "Can I change the AI model?", a: "Yes. Pro talks to a local llama-server, so you can load any compatible GGUF model and swap it whenever you want a different speed or accuracy balance." },
  { q: "Is v1.1 still free?", a: "Yes. Version 1.0 and version 1.1 stay free forever and remain downloadable on this page." },
  { q: "How is Pro licensed?", a: "Through a Gumroad license key. One license activates one computer and is bound to that device." },
  { q: "Can I move my license to a new PC?", a: `Yes. Deactivate the old device through Gumroad or contact support at ${SUPPORT_EMAIL} and we will move it for you.` },
  { q: "Is my typing sent to the cloud?", a: "No. Prediction is local by design. Optional AI runs through a local llama-server on your own machine." },
  { q: "Will it work in every application?", a: "It works system-wide on Windows. Some consoles, terminals and applications running with elevated privileges are more limited." },
  { q: "What payment methods do you accept?", a: "Gumroad handles checkout, which supports cards and its other supported payment methods." },
  { q: "What do I need for local MCP support?", a: "The latest version of Node.js must be installed on your computer for local MCP support to run." },
];

const FaqSection = () => (
  <section id="faq" className="relative scroll-mt-20 py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Frequently asked <span className="gradient-text">questions</span>
        </h2>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="rounded-xl border border-border/50 bg-card/50 px-5"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FaqSection;
