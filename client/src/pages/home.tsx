import { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { FilterBar } from "@/components/filter-bar";
import { HeroSection } from "@/components/hero-section";
import { ProjectGrid } from "@/components/project-grid";
import { ProjectModal } from "@/components/project-modal";
import { StatsSection } from "@/components/stats-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { FAQsSection } from "@/components/faqs-section";
import { Footer } from "@/components/footer";
import type { Project, ProjectCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>("All");
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
          tech.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const handleServicesClick = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header
          onAboutClick={handleAboutClick}
          onServicesClick={handleServicesClick}
          onContactClick={handleContactClick}
          onProjectsClick={handleViewProjects}
        />

        <main>
          <HeroSection
            projectCount={projects.length}
            onViewProjects={handleViewProjects}
          />

          <section id="projects" ref={projectsRef} className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <h2
                  className="text-3xl font-bold md:text-4xl"
                  data-testid="text-projects-title"
                >
                  Our Projects
                </h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                  Explore our portfolio of web applications, mobile apps, and
                  digital solutions built with modern technologies
                </p>
                {(selectedCategory !== "All" || searchQuery) && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Showing {filteredProjects.length} of {projects.length}{" "}
                    projects
                    {selectedCategory !== "All" && ` in ${selectedCategory}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                )}
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
          <ServicesSection />
          <FAQsSection />
          <ContactSection />
        </main>

        <Footer />

        <ProjectModal
          project={selectedProject}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
      <a
        aria-label="Chat on WhatsApp"
        href="https://wa.me/919877454036?text=Hi%20KRPL%20Tech%20-%20I%20am%20interested%20in%20your%20software%20development%20services.%20Could%20we%20discuss%20my%20project%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5"
      >
        <SiWhatsapp className="h-10 w-10 text-green-500" />
      </a>
    </>
  );
}
