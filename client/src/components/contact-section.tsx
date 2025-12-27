import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { SiLinkedin, SiGithub, SiX } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "admin@mymegaminds.com",
    href: "mailto:admin@mymegaminds.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Available Worldwide",
    href: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

const socialLinks = [
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/company/krpl-tech",
    testId: "link-linkedin",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    href: "https://github.com/krpl-tech",
    testId: "link-github",
  },
  {
    icon: SiX,
    label: "Twitter",
    href: "https://twitter.com/krpltech",
    testId: "link-twitter",
  },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-contact-title">
            Get In Touch
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear about it. Reach out and let's discuss how krpl.tech can help bring your vision to life.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h4 className="text-lg font-medium">Thank you!</h4>
                  <p className="text-muted-foreground mt-2">
                    Your message has been sent. We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name" 
                        required 
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="What's this about?" 
                      required 
                      data-testid="input-subject"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project..." 
                      rows={5}
                      required 
                      data-testid="input-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-submit-contact"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          className="font-medium hover:text-primary transition-colors"
                          data-testid={`link-${item.label.toLowerCase()}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="font-medium">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((link) => (
                  <a
                    key={link.testId}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={link.testId}
                  >
                    <Button variant="outline" size="icon">
                      <link.icon className="h-5 w-5" />
                      <span className="sr-only">{link.label}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </Card>
            
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Let's Work Together</h3>
              <p className="text-sm text-muted-foreground">
                Whether you need a new website, mobile app, or custom software solution, 
                krpl.tech is here to help. We offer competitive rates and flexible engagement models.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
