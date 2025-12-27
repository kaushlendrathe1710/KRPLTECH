import { Code2 } from "lucide-react";
import { SiLinkedin, SiGithub, SiX } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-bold">krpl.tech</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Building digital solutions with expertise and innovation.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Connect</h4>
            <div className="mt-2 flex gap-3">
              <a
                href="https://github.com/krpl-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-github"
              >
                <SiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/krpl-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-linkedin"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/krpltech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-twitter"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} krpl.tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
