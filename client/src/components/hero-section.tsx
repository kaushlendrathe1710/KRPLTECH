import { Button } from "@/components/ui/button";
import { ArrowDown, Briefcase, Code2, Sparkles, Star } from "lucide-react";

interface HeroSectionProps {
  projectCount: number;
  onViewProjects: () => void;
}

export function HeroSection({ projectCount, onViewProjects }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.1),transparent_50%)]" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-accent/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Software Development Company
          </span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl leading-[0.9]" data-testid="text-hero-title">
          <span className="block mb-2">We Build</span>
          <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Digital Excellence
          </span>
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
          krpl.tech transforms ideas into powerful digital solutions. 
          Modern web apps, mobile experiences, and scalable platforms 
          built with precision and innovation.
        </p>
        
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-3xl" data-testid="text-project-count">{projectCount}+</span>
              <span className="text-sm text-muted-foreground">Projects</span>
            </div>
          </div>
          
          <div className="h-12 w-px bg-border hidden md:block" />
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-3xl">10+</span>
              <span className="text-sm text-muted-foreground">Technologies</span>
            </div>
          </div>
          
          <div className="h-12 w-px bg-border hidden md:block" />
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-3xl">100%</span>
              <span className="text-sm text-muted-foreground">Satisfaction</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={onViewProjects}
            className="group px-8 h-12 text-base font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            data-testid="button-view-projects"
          >
            Explore Our Work
            <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 h-12 text-base font-medium rounded-full"
            data-testid="button-get-in-touch"
          >
            Get In Touch
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
      </div>
    </section>
  );
}
