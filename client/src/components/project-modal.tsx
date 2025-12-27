import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Github, Calendar, Layers, ArrowUpRight } from "lucide-react";
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
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0 gap-0 border-0 bg-card">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            <div className="relative aspect-[21/9] bg-muted overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
                data-testid="img-project-detail"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className="font-mono text-xs uppercase bg-primary/90 text-primary-foreground border-0">
                    {project.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{project.year}</span>
                  </div>
                </div>
                <DialogTitle className="text-3xl md:text-4xl font-bold text-white" data-testid="text-modal-title">
                  {project.title}
                </DialogTitle>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  About This Project
                </h3>
                <p className="text-foreground leading-relaxed" data-testid="text-modal-description">
                  {project.longDescription || project.description}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  <Layers className="h-4 w-4" />
                  <span>Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="font-mono text-xs px-3 py-1"
                      data-testid={`badge-tech-${tech}`}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                {project.liveUrl && (
                  <Button asChild className="group" data-testid="button-live-demo">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      View Live
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" asChild data-testid="button-github">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Source Code
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
