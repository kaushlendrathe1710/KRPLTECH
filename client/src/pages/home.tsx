import { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FilterBar } from "@/components/filter-bar";
import { ProjectGrid } from "@/components/project-grid";
import { ProjectModal } from "@/components/project-modal";
import { StatsSection } from "@/components/stats-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import type { Project, ProjectCategory } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const projectsRef = useRef<HTMLDivElement>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleViewProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleAboutClick = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAboutClick={handleAboutClick} onContactClick={handleContactClick} />
      
      <main>
        <HeroSection 
          projectCount={projects.length} 
          onViewProjects={handleViewProjects} 
        />
        
        <section 
          id="projects" 
          ref={projectsRef} 
          className="py-16 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-projects-title">
                My Projects
              </h2>
              <p className="mt-2 text-muted-foreground">
                A collection of work I'm proud of
              </p>
            </div>
            
            <div className="mb-8">
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            
            <ProjectGrid
              projects={filteredProjects}
              isLoading={isLoading}
              onProjectClick={handleProjectClick}
            />
          </div>
        </section>
        
        <StatsSection projectCount={projects.length} />
        <AboutSection />
        <ContactSection />
      </main>
      
      <Footer />
      
      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
