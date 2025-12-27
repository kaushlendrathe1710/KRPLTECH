import { ProjectCard } from "./project-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@shared/schema";
import { FolderOpen } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  onProjectClick: (project: Project) => void;
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card/50">
      <Skeleton className="aspect-[16/10] w-full" />
    </div>
  );
}

export function ProjectGrid({ projects, isLoading, onProjectClick }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50">
          <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="mt-6 text-xl font-medium">No projects found</h3>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Try adjusting your search or filter criteria to find what you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8" data-testid="project-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
        >
          <ProjectCard
            project={project}
            onClick={() => onProjectClick(project)}
          />
        </div>
      ))}
    </div>
  );
}
