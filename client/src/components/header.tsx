import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Search, X } from "lucide-react";
import type { ProjectCategory } from "@shared/schema";

const categories: ProjectCategory[] = [
  "All", "Web App", "Mobile App", "E-commerce", "Dashboard", "Landing Page", "API/Backend"
];

interface HeaderProps {
  onAboutClick: () => void;
  onContactClick: () => void;
  selectedCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters?: boolean;
}

export function Header({ 
  onAboutClick, 
  onContactClick,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showFilters = true
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/0 blur-sm" />
              <Code2 className="relative h-7 w-7 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">krpl.tech</span>
          </a>
          
          {showFilters && (
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={`shrink-0 font-medium transition-all duration-200 ${
                    selectedCategory === category 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground"
                  }`}
                  data-testid={`button-category-${category.toLowerCase().replace(/[\s/]/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {showFilters && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-48 pl-9 pr-8 h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-200 focus:w-64"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-8"
                    onClick={() => onSearchChange("")}
                    data-testid="button-clear-search"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            
            <nav className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" onClick={onAboutClick} data-testid="button-nav-about">
                About
              </Button>
              <Button variant="ghost" size="sm" onClick={onContactClick} data-testid="button-nav-contact">
                Contact
              </Button>
            </nav>
            
            <ThemeToggle />
          </div>
        </div>
        
        {showFilters && (
          <div className="lg:hidden pb-3 -mt-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <div className="relative flex-1 max-w-xs sm:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 h-8 bg-muted/50 border-0 text-sm"
                data-testid="input-search-mobile"
              />
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 text-xs ${
                  selectedCategory === category 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground"
                }`}
                data-testid={`button-category-mobile-${category.toLowerCase().replace(/[\s/]/g, '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
