import { Briefcase, Code2, Clock, Award } from "lucide-react";

interface StatsSectionProps {
  projectCount: number;
}

export function StatsSection({ projectCount }: StatsSectionProps) {
  const stats = [
    {
      icon: Briefcase,
      value: `${projectCount}+`,
      label: "Projects Completed",
      testId: "stat-projects",
    },
    {
      icon: Code2,
      value: "15+",
      label: "Technologies Used",
      testId: "stat-technologies",
    },
    {
      icon: Clock,
      value: "3+",
      label: "Years Experience",
      testId: "stat-experience",
    },
    {
      icon: Award,
      value: "100%",
      label: "Client Satisfaction",
      testId: "stat-satisfaction",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.testId}
              className="text-center"
              data-testid={stat.testId}
            >
              <stat.icon className="mx-auto mb-4 h-8 w-8 text-primary" />
              <div className="text-4xl font-bold md:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
