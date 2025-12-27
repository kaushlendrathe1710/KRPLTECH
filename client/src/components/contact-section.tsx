import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, Twitter } from "lucide-react";
import { SiLinkedin, SiGithub, SiX } from "react-icons/si";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    testId: "link-email",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    value: "Connect",
    href: "https://linkedin.com",
    testId: "link-linkedin",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    value: "Follow",
    href: "https://github.com",
    testId: "link-github",
  },
  {
    icon: SiX,
    label: "Twitter",
    value: "Follow",
    href: "https://twitter.com",
    testId: "link-twitter",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-contact-title">
          Let's Build Something
        </h2>
        <p className="mt-4 text-muted-foreground">
          Have a project in mind? I'd love to hear about it. Let's discuss how we can work together.
        </p>
        
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {contactLinks.map((link) => (
            <a
              key={link.testId}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={link.testId}
            >
              <Card className="p-4 text-center hover-elevate active-elevate-2 h-full flex flex-col items-center justify-center gap-2">
                <link.icon className="h-6 w-6 text-primary" />
                <div className="text-sm font-medium">{link.label}</div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
