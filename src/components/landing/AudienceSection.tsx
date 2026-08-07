import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Keyboard, Cpu, Building2 } from "lucide-react";

const audiences = [
  { icon: GraduationCap, title: "Students", description: "Keep writing essays and notes on a damaged school laptop instead of waiting on a repair." },
  { icon: Briefcase, title: "Remote workers", description: "Keep an aging but capable machine in service through a full working day." },
  { icon: Keyboard, title: "Anyone with 1 to 5 dead keys", description: "Restore the characters you lost without paying for a full keyboard replacement yet." },
  { icon: Cpu, title: "Power users", description: "Run local AI-assisted input reconstruction and tune the engine to your own writing." },
  { icon: Building2, title: "IT and education teams", description: "Where replacing devices is costly, software can help keep working hardware in rotation longer." },
];

const AudienceSection = () => (
  <section className="relative py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Who it is <span className="gradient-text">for</span>
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map((a) => (
          <div key={a.title} className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <a.icon className="mb-4 h-5 w-5 text-primary" />
            <h3 className="mb-2 font-semibold">{a.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceSection;
