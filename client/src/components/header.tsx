import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

interface HeaderProps {
  onAboutClick: () => void;
  onContactClick: () => void;
}

export function Header({ onAboutClick, onContactClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <a href="/" className="flex items-center gap-2" data-testid="link-logo">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Portfolio</span>
        </a>
        
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" onClick={onAboutClick} data-testid="button-nav-about">
            About
          </Button>
          <Button variant="ghost" onClick={onContactClick} data-testid="button-nav-contact">
            Contact
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
