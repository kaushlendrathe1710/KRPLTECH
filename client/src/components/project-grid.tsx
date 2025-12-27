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
    <div className="overflow-hidden rounded-lg border border-card-border bg-card">
      <Skeleton className="aspect-[16/10] w-full" />
    </div>
  );
}

export function ProjectGrid({ projects, isLoading, onProjectClick }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No projects found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8" data-testid="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
        />
      ))}
    </div>
  );
}
