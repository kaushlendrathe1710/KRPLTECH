import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Code2, Rocket, Users, Award, Globe, Zap } from "lucide-react";

const skills = [
  "JavaScript", "TypeScript", "React", "Node.js", 
  "Python", "PostgreSQL", "MongoDB", "GraphQL",
  "Next.js", "Tailwind CSS", "Docker", "AWS"
];

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Expertise",
    description: "From React to Node.js, we build complete solutions using modern technologies.",
  },
  {
    icon: Rocket,
    title: "Performance Focused",
    description: "Every project is optimized for speed, scalability, and exceptional user experience.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "We work closely with clients to understand their needs and deliver tailored solutions.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Rigorous testing and best practices ensure reliable, maintainable code.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving clients worldwide with solutions that work across platforms and devices.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Agile methodology ensures quick turnaround without compromising quality.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-about-title">
            About krpl.tech
          </h2>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="text-about-description">
            krpl.tech is a software development company specializing in building modern web and mobile applications. 
            All the projects showcased here represent our commitment to quality, innovation, and exceptional user experiences.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We transform ideas into powerful digital solutions. Whether it's an e-commerce platform, 
            a complex dashboard, or a mobile application, our team delivers results that exceed expectations.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {highlights.map((item) => (
            <Card 
              key={item.title} 
              className="p-5"
              data-testid={`card-highlight-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Technologies We Use
          </h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="font-mono text-xs"
                data-testid={`badge-skill-${skill.toLowerCase().replace(/[.\s]/g, "-")}`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
