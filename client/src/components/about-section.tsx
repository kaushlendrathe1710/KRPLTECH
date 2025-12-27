import { Badge } from "@/components/ui/badge";

const skills = [
  "JavaScript", "TypeScript", "React", "Node.js", 
  "Python", "PostgreSQL", "MongoDB", "GraphQL",
  "Next.js", "Tailwind CSS", "Docker", "AWS"
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="absolute inset-2 rounded-xl bg-muted flex items-center justify-center">
                <div className="text-6xl font-bold text-muted-foreground/30">
                  Dev
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-about-title">
              About Me
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-about-description">
              I'm a passionate full-stack developer with a love for creating elegant solutions 
              to complex problems. With years of experience in building web applications, 
              I specialize in modern JavaScript frameworks and cloud technologies.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              My approach combines clean code practices with user-centered design, 
              ensuring that every project delivers both functionality and exceptional user experience.
            </p>
            
            <div className="mt-8">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Skills & Technologies
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      </div>
    </section>
  );
}
