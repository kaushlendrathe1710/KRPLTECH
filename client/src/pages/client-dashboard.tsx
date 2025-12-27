import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  FolderPlus, FolderKanban, User, ArrowLeft, LogOut, 
  Loader2, Clock, CheckCircle, XCircle, Hourglass
} from "lucide-react";
import type { ProjectRequest } from "@shared/schema";
import { PROJECT_CATEGORIES } from "@shared/schema";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("requests");
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  const { data: requests = [], isLoading } = useQuery<ProjectRequest[]>({
    queryKey: ["/api/client/requests"],
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category?: string;
      budget?: string;
      timeline?: string;
    }) => {
      await apiRequest("POST", "/api/client/requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client/requests"] });
      setNewRequestOpen(false);
      toast({
        title: "Request submitted!",
        description: "We'll review your project request and get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; mobile: string }) => {
      await apiRequest("PATCH", "/api/client/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile updated!" });
    },
  });

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileMobile, setProfileMobile] = useState(user?.mobile || "");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Hourglass className="h-4 w-4" />;
      case "reviewing":
      case "approved":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      reviewing: "bg-blue-500",
      approved: "bg-purple-500",
      in_progress: "bg-orange-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createRequestMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string || undefined,
      budget: formData.get("budget") as string || undefined,
      timeline: formData.get("timeline") as string || undefined,
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name: profileName, mobile: profileMobile });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Site
              </Button>
            </Link>
            <h1 className="font-semibold">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <TabsList>
              <TabsTrigger value="requests" data-testid="tab-requests">
                <FolderKanban className="mr-2 h-4 w-4" />
                My Requests
              </TabsTrigger>
              <TabsTrigger value="profile" data-testid="tab-profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-request">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Project Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit Project Request</DialogTitle>
                  <DialogDescription>
                    Tell us about your project and we'll get back to you with a proposal.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="E.g., E-commerce Website"
                      required
                      data-testid="input-request-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your project requirements, features, and goals..."
                      rows={4}
                      required
                      data-testid="input-request-description"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category">
                        <SelectTrigger data-testid="select-request-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_CATEGORIES.filter(c => c !== "All").map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select name="budget">
                        <SelectTrigger data-testid="select-request-budget">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1k">Under $1,000</SelectItem>
                          <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k+">$25,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select name="timeline">
                      <SelectTrigger data-testid="select-request-timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="2-3-months">2-3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createRequestMutation.isPending}
                    data-testid="button-submit-request"
                  >
                    {createRequestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>My Project Requests</CardTitle>
                <CardDescription>Track the status of your submitted project requests</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-medium">No project requests yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit your first project request to get started
                    </p>
                    <Button className="mt-4" onClick={() => setNewRequestOpen(true)}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <Card key={req.id} className="p-4" data-testid={`my-request-${req.id}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{req.title}</span>
                                <Badge className={`${getStatusColor(req.status)} text-white text-xs flex items-center gap-1`}>
                                  {getStatusIcon(req.status)}
                                  {req.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                                {req.category && <span>Category: {req.category}</span>}
                                {req.budget && <span>Budget: {req.budget}</span>}
                                {req.timeline && <span>Timeline: {req.timeline}</span>}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                              {new Date(req.createdAt!).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your name"
                      data-testid="input-profile-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-mobile">Mobile Number</Label>
                    <Input
                      id="profile-mobile"
                      value={profileMobile}
                      onChange={(e) => setProfileMobile(e.target.value)}
                      placeholder="+1 234 567 890"
                      data-testid="input-profile-mobile"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-update-profile"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
