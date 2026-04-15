import { } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Code2, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";

interface HeaderProps {
  onAboutClick: () => void;
  onContactClick: () => void;
  onProjectsClick: () => void;
  onServicesClick: () => void;
}

export function Header({ onAboutClick, onContactClick, onProjectsClick, onServicesClick }: HeaderProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="#"
              className="flex items-center gap-2 shrink-0"
              data-testid="link-logo"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/0 blur-sm" />
                <Code2 className="relative h-7 w-7 text-primary" />
              </div>
              <span className="font-bold hidden sm:block text-xl tracking-tight">
                krpl.tech
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <nav className="hidden items-center gap-1 md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAboutClick}
                  data-testid="button-nav-about"
                >
                  About
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onServicesClick}
                  data-testid="button-nav-services"
                >
                  Services
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onContactClick}
                  data-testid="button-nav-contact"
                >
                  Contact
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onProjectsClick}
                  data-testid="button-nav-projects"
                >
                  Projects
                </Button>
              </nav>

              {isAuthenticated ? (
                <Link href={isAdmin ? "/admin" : "/dashboard"}>
                  <Button size="sm" data-testid="button-dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button size="sm" data-testid="button-login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}

              <ThemeToggle />
            </div>
          </div>

          {/* simple header; filters moved to projects section */}
        </div>
      </header>
    </>
  );
}
