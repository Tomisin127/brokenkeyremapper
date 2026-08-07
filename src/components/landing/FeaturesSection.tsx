import { motion } from "framer-motion";
import {
  Layers,
  Brain,
  BookOpen,
  GraduationCap,
  Cpu,
  ArrowLeftRight,
  MonitorSmartphone,
  Wand2,
  FileDown,
  Lock,
  ToggleLeft,
  KeyRound,
} from "lucide-react";

const features = [
  { icon: Layers, title: "1-to-many key mapping", description: "Map several broken characters to one working key and keep typing with the keys you still have." },
  { icon: Brain, title: "Context-aware prediction", description: "The engine uses what you already typed to choose the most likely next letter." },
  { icon: BookOpen, title: "Dictionary + bigrams engine", description: "A large English word trie and bigram frequencies score candidates fast, entirely on device." },
  { icon: GraduationCap, title: "Personal learning", description: "Pro builds a private learned-words vocabulary from your own typing over time." },
  { icon: Cpu, title: "Optional local AI", description: "Connect a local llama-server for harder cases. No cloud service required." },
  { icon: ArrowLeftRight, title: "Shift-cycle control", description: "Hold Shift and press your host key to cycle through alternate candidates instantly." },
  { icon: MonitorSmartphone, title: "Live HUD", description: "A small overlay shows what was typed and where the prediction came from: learned, dictionary or AI." },
  { icon: Wand2, title: "Setup wizard & GUI", description: "Add and edit mappings, manage learned words, tune settings and review typing stats." },
  { icon: FileDown, title: "Import / export config", description: "Move your mappings and preferences between machines in seconds." },
  { icon: Lock, title: "Privacy first", description: "Predictions run on your device and the optional AI model stays local too." },
  { icon: ToggleLeft, title: "F12 toggle", description: "Enable or disable remap mode instantly with a single key." },
  { icon: KeyRound, title: "License system", description: "Gumroad license key, one PC per license, bound to your device." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const FeaturesSection = () => (
  <section id="features" className="relative scroll-mt-20 py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Everything in <span className="gradient-text">Broken Key Remapper Pro</span>
        </h2>
        <p className="text-muted-foreground">
          A predictive input layer that sits between your keyboard and Windows, built for real daily typing.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card gradient-card"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
