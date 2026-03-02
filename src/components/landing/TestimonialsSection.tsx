import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Half my keyboard was broken and I couldn't afford a new laptop. This tool let me keep working like nothing happened.",
    name: "Alex M.",
    role: "Tech Enthusiast",
  },
  {
    quote: "The prediction is surprisingly accurate. I barely need to use the Shift key to correct anything. Feels seamless.",
    name: "Sarah K.",
    role: "Office Worker",
  },
  {
    quote: "Simple, lightweight, and it just works. Best $10 I've spent on a utility tool.",
    name: "James T.",
    role: "Freelance Writer",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Loved by <span className="gradient-text">Real Users</span>
          </h2>
          <p className="text-muted-foreground">See what people are saying about Broken Key Remapper.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border/50 bg-card/50 p-6 gradient-card"
            >
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
