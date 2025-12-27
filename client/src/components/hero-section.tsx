import { Button } from "@/components/ui/button";
import { ArrowDown, Briefcase, Code2, Sparkles } from "lucide-react";

interface HeroSectionProps {
  projectCount: number;
  onViewProjects: () => void;
}

export function HeroSection({ projectCount, onViewProjects }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.15),transparent_50%)]" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Full-Stack Developer</span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl" data-testid="text-hero-title">
          Building Digital
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Experiences
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Crafting modern web applications with clean code and beautiful interfaces. 
          Explore my collection of projects built with passion and precision.
        </p>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="font-bold text-2xl" data-testid="text-project-count">{projectCount}+</span>
            <span className="text-muted-foreground">Projects</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-bold text-2xl">10+</span>
            <span className="text-muted-foreground">Technologies</span>
          </div>
        </div>
        
        <div className="mt-10">
          <Button 
            size="lg" 
            onClick={onViewProjects}
            className="group"
            data-testid="button-view-projects"
          >
            View Projects
            <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
