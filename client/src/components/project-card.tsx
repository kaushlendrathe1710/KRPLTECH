import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-card-border hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <Badge 
          variant="secondary" 
          className="absolute left-3 top-3 font-mono text-xs uppercase tracking-wide"
          data-testid={`badge-category-${project.id}`}
        >
          {project.category}
        </Badge>
        
        <div className="absolute bottom-3 right-3 font-mono text-xs text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.year}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-lg font-bold text-white" data-testid={`text-title-${project.id}`}>
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {project.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-sm bg-white/20 px-2 py-0.5 font-mono text-xs text-white backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rounded-sm bg-white/20 px-2 py-0.5 font-mono text-xs text-white backdrop-blur-sm">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
