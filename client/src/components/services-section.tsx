import { Card } from "@/components/ui/card";
import { Globe, Sparkles, RefreshCw } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      title: "Website Development",
      description: "Business, School, NGO websites",
      icon: Globe,
    },
    {
      title: "Landing Page Design",
      description: "High-conversion marketing pages",
      icon: Sparkles,
    },
    {
      title: "Website Redesign",
      description: "Upgrade old websites",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-card/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h2 className="text-3xl font-bold md:text-4xl">Our Services</h2>
          <p className="mt-3 text-muted-foreground">What we offer to help your business grow.</p>
        </div>

        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
