import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Github, Calendar, Layers } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  if (!project) return null;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[60%]">
              <div className="relative aspect-[16/10] bg-muted">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  data-testid="img-project-detail"
                />
              </div>
            </div>
            
            <div className="flex flex-col p-6 lg:w-[40%]">
              <DialogHeader className="text-left">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="secondary" className="font-mono text-xs uppercase">
                    {project.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{project.year}</span>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold" data-testid="text-modal-title">
                  {project.title}
                </DialogTitle>
              </DialogHeader>
              
              <p className="mt-4 text-muted-foreground" data-testid="text-modal-description">
                {project.longDescription || project.description}
              </p>
              
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="h-4 w-4" />
                  <span>Tech Stack</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="outline" 
                      className="font-mono text-xs"
                      data-testid={`badge-tech-${tech}`}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <Button asChild data-testid="button-live-demo">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" asChild data-testid="button-github">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
