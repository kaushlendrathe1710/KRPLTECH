import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 bg-card/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      onClick={onClick}
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        
        <Badge 
          variant="secondary" 
          className="absolute left-4 top-4 font-mono text-xs uppercase tracking-wider bg-white/90 text-black backdrop-blur-sm border-0"
          data-testid={`badge-category-${project.id}`}
        >
          {project.category}
        </Badge>
        
        <div className="absolute right-4 top-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="font-mono text-xs text-white/60 mb-2">
            {project.year}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1" data-testid={`text-title-${project.id}`}>
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm text-white/80 mb-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 opacity-0 translate-y-2 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
