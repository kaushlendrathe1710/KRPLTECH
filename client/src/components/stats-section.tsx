import { Card } from "@/components/ui/card";
import { Briefcase, Code2, Clock, Award } from "lucide-react";

interface StatsSectionProps {
  projectCount: number;
}

export function StatsSection({ projectCount }: StatsSectionProps) {
  const stats = [
    {
      icon: Briefcase,
      value: `${projectCount}+`,
      label: "Projects Delivered",
      description: "And counting",
      testId: "stat-projects",
    },
    {
      icon: Code2,
      value: "15+",
      label: "Technologies",
      description: "Modern stack",
      testId: "stat-technologies",
    },
    {
      icon: Clock,
      value: "5+",
      label: "Years Experience",
      description: "In the industry",
      testId: "stat-experience",
    },
    {
      icon: Award,
      value: "100%",
      label: "Satisfaction",
      description: "Client focused",
      testId: "stat-satisfaction",
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Our Track Record
          </h2>
          <p className="mt-3 text-muted-foreground">
            Numbers that speak for themselves
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <Card 
              key={stat.testId}
              className="relative p-6 text-center border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group"
              data-testid={stat.testId}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 font-medium text-sm">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
