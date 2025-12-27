import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  LayoutDashboard, MessageSquare, Users, FolderKanban, Briefcase,
  Settings, ArrowLeft, LogOut, Check, Eye, Plus, Pencil, Trash2,
  UserCog, Shield, TrendingUp, Mail, Calendar, Clock, CheckCircle, Search
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ContactMessage, ProjectRequest, User, Project, PROJECT_CATEGORIES } from "@shared/schema";

type Section = "overview" | "messages" | "requests" | "users" | "portfolio" | "settings";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectSearch, setProjectSearch] = useState("");

  const { data: stats } = useQuery<{
    totalMessages: number;
    newMessages: number;
    totalClients: number;
    totalRequests: number;
    activeRequests: number;
    completedRequests: number;
    totalProjects: number;
  }>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 5000,
    staleTime: 0,
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    refetchInterval: 5000,
    staleTime: 0,
  });

  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 10000,
    staleTime: 0,
  });

  const { data: requests = [] } = useQuery<ProjectRequest[]>({
    queryKey: ["/api/admin/requests"],
    refetchInterval: 5000,
    staleTime: 0,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/messages/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Message status updated" });
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Request status updated" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User role updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User deleted" });
    },
    onError: () => {
      toast({ title: "Cannot delete this user", variant: "destructive" });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: Omit<Project, "id">) => {
      await apiRequest("POST", "/api/projects", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setProjectDialogOpen(false);
      toast({ title: "Project created" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      await apiRequest("PATCH", `/api/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setProjectDialogOpen(false);
      setEditingProject(null);
      toast({ title: "Project updated" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Project deleted" });
    },
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500",
      read: "bg-gray-500",
      replied: "bg-green-500",
      pending: "bg-yellow-500",
      reviewing: "bg-blue-500",
      approved: "bg-purple-500",
      in_progress: "bg-orange-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const menuItems = [
    { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
    { id: "messages" as Section, label: "Messages", icon: MessageSquare, badge: stats?.newMessages },
    { id: "requests" as Section, label: "Project Requests", icon: FolderKanban, badge: stats?.activeRequests },
    { id: "users" as Section, label: "User Management", icon: Users },
    { id: "portfolio" as Section, label: "Portfolio", icon: Briefcase },
    { id: "settings" as Section, label: "Settings", icon: Settings },
  ];

  const clients = allUsers.filter(u => u.role === "client");
  const admins = allUsers.filter(u => u.role === "admin");

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Admin Panel</span>
                <span className="text-xs text-muted-foreground">krpl.tech</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        data-testid={`sidebar-${item.id}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.badge ? (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        ) : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="link-back-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="hover-elevate cursor-pointer" onClick={() => setActiveSection("messages")}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                      <CardTitle className="text-sm font-medium">Messages</CardTitle>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-blue-500">{stats?.newMessages || 0} new</span>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover-elevate cursor-pointer" onClick={() => setActiveSection("requests")}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                      <CardTitle className="text-sm font-medium">Project Requests</CardTitle>
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalRequests || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-orange-500">{stats?.activeRequests || 0} active</span>
                        {" / "}
                        <span className="text-green-500">{stats?.completedRequests || 0} completed</span>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover-elevate cursor-pointer" onClick={() => setActiveSection("users")}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                      <CardTitle className="text-sm font-medium">Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allUsers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-purple-500">{admins.length} admins</span>
                        {" / "}
                        <span className="text-blue-500">{clients.length} clients</span>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover-elevate cursor-pointer" onClick={() => setActiveSection("portfolio")}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                      <CardTitle className="text-sm font-medium">Portfolio</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {projects.filter(p => p.featured).length} featured
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {messages.slice(0, 5).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No messages yet</p>
                      ) : (
                        <div className="space-y-3">
                          {messages.slice(0, 5).map((msg) => (
                            <div key={msg.id} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {msg.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{msg.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                              </div>
                              <Badge className={`${getStatusColor(msg.status)} text-white text-xs`}>
                                {msg.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {requests.slice(0, 5).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No requests yet</p>
                      ) : (
                        <div className="space-y-3">
                          {requests.slice(0, 5).map((req) => (
                            <div key={req.id} className="flex items-start gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                <FolderKanban className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{req.title}</p>
                                <p className="text-xs text-muted-foreground">{req.budget}</p>
                              </div>
                              <Badge className={`${getStatusColor(req.status)} text-white text-xs`}>
                                {req.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "messages" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Messages</h1>
                  <Badge variant="outline">{messages.length} total</Badge>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {messages.length === 0 ? (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No messages yet</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <Card key={msg.id} className="p-4" data-testid={`message-${msg.id}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 flex-1 min-w-0">
                              <Avatar>
                                <AvatarFallback>{msg.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-medium">{msg.name}</span>
                                  <Badge variant="outline" className="text-xs">{msg.email}</Badge>
                                  <Badge className={`${getStatusColor(msg.status)} text-white text-xs`}>
                                    {msg.status}
                                  </Badge>
                                </div>
                                <p className="font-medium text-sm">{msg.subject}</p>
                                <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(msg.createdAt!).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {msg.status === "new" && (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => updateMessageMutation.mutate({ id: msg.id, status: "read" })}
                                  data-testid={`button-mark-read-${msg.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {msg.status !== "replied" && (
                                <Button
                                  size="icon"
                                  onClick={() => updateMessageMutation.mutate({ id: msg.id, status: "replied" })}
                                  data-testid={`button-mark-replied-${msg.id}`}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}

            {activeSection === "requests" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Project Requests</h1>
                  <Badge variant="outline">{requests.length} total</Badge>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {requests.length === 0 ? (
                    <Card className="p-8">
                      <p className="text-center text-muted-foreground">No project requests yet</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <Card key={req.id} className="p-4" data-testid={`request-${req.id}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{req.title}</span>
                                <Badge className={`${getStatusColor(req.status)} text-white text-xs`}>
                                  {req.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                                {req.category && <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" />{req.category}</span>}
                                {req.budget && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{req.budget}</span>}
                                {req.timeline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{req.timeline}</span>}
                              </div>
                              {req.technologies && req.technologies.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {req.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(req.createdAt!).toLocaleString()}
                              </p>
                            </div>
                            <Select
                              value={req.status}
                              onValueChange={(status) => updateRequestMutation.mutate({ id: req.id, status })}
                            >
                              <SelectTrigger className="w-[140px]" data-testid={`select-status-${req.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewing">Reviewing</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}

            {activeSection === "users" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Administrators ({admins.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        {admins.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No administrators</p>
                        ) : (
                          <div className="space-y-3">
                            {admins.map((admin) => (
                              <div key={admin.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50" data-testid={`user-${admin.id}`}>
                                <Avatar>
                                  <AvatarFallback>{admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{admin.name || "No name"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                                </div>
                                {admin.isProtected ? (
                                  <Badge variant="outline" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Superadmin
                                  </Badge>
                                ) : (
                                  <div className="flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => updateUserMutation.mutate({ id: admin.id, role: "client" })}
                                      title="Demote to client"
                                    >
                                      <UserCog className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete {admin.email}. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteUserMutation.mutate(admin.id)}>
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Clients ({clients.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        {clients.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No clients registered</p>
                        ) : (
                          <div className="space-y-3">
                            {clients.map((client) => (
                              <div key={client.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50" data-testid={`user-${client.id}`}>
                                <Avatar>
                                  <AvatarFallback>{client.name?.charAt(0) || client.email.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{client.name || "No name"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                                  {client.mobile && <p className="text-xs text-muted-foreground">{client.mobile}</p>}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => updateUserMutation.mutate({ id: client.id, role: "admin" })}
                                    title="Promote to admin"
                                  >
                                    <Shield className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="icon" variant="ghost">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete {client.email}. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteUserMutation.mutate(client.id)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "portfolio" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold">Portfolio Management</h1>
                    <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search projects..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="pl-9 w-64"
                        data-testid="input-search-projects"
                      />
                    </div>
                    <Dialog open={projectDialogOpen} onOpenChange={(open) => {
                      setProjectDialogOpen(open);
                      if (!open) setEditingProject(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-add-project">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Project
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                      </DialogHeader>
                      <ProjectForm
                        project={editingProject}
                        onSubmit={(data) => {
                          if (editingProject) {
                            updateProjectMutation.mutate({ id: editingProject.id, ...data });
                          } else {
                            createProjectMutation.mutate(data as Omit<Project, "id">);
                          }
                        }}
                        isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
                      />
                    </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects
                      .filter((project) => {
                        if (!projectSearch.trim()) return true;
                        const search = projectSearch.toLowerCase();
                        return (
                          project.title.toLowerCase().includes(search) ||
                          project.description.toLowerCase().includes(search) ||
                          project.category.toLowerCase().includes(search) ||
                          project.technologies?.some(t => t.toLowerCase().includes(search))
                        );
                      })
                      .map((project) => (
                      <Card key={project.id} className="overflow-hidden" data-testid={`project-${project.id}`}>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                          {project.featured ? (
                            <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                          ) : null}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium truncate">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                            <Badge variant="outline" className="text-xs">{project.year}</Badge>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setEditingProject(project);
                                setProjectDialogOpen(true);
                              }}
                              data-testid={`button-edit-project-${project.id}`}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" data-testid={`button-delete-project-${project.id}`}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete "{project.title}" from the portfolio.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteProjectMutation.mutate(project.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <div className="grid gap-6 max-w-2xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your admin account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={user?.name || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={user?.role || ""} disabled />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Information</CardTitle>
                      <CardDescription>Platform statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Users</span>
                          <span className="font-medium">{allUsers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Portfolio Projects</span>
                          <span className="font-medium">{stats?.totalProjects || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact Messages</span>
                          <span className="font-medium">{stats?.totalMessages || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Project Requests</span>
                          <span className="font-medium">{stats?.totalRequests || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function ProjectForm({ 
  project, 
  onSubmit, 
  isLoading 
}: { 
  project: Project | null; 
  onSubmit: (data: Partial<Project>) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    longDescription: project?.longDescription || "",
    category: project?.category || "Web App",
    technologies: project?.technologies?.join(", ") || "",
    imageUrl: project?.imageUrl || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    year: project?.year || new Date().getFullYear(),
    featured: project?.featured || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  const categories = ["Web App", "Mobile App", "E-commerce", "Dashboard", "Landing Page", "API/Backend", "Design"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            data-testid="input-project-title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger data-testid="select-project-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          data-testid="input-project-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          value={formData.longDescription}
          onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
          rows={4}
          data-testid="input-project-long-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technologies">Technologies (comma separated) *</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="React, Node.js, PostgreSQL"
          required
          data-testid="input-project-technologies"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          required
          data-testid="input-project-image"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            data-testid="input-project-live-url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            data-testid="input-project-github-url"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            type="number"
            min="2000"
            max="2030"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
            data-testid="input-project-year"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featured">Featured</Label>
          <Select value={formData.featured.toString()} onValueChange={(v) => setFormData({ ...formData, featured: parseInt(v) })}>
            <SelectTrigger data-testid="select-project-featured">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No</SelectItem>
              <SelectItem value="1">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading} data-testid="button-submit-project">
          {isLoading ? "Saving..." : (project ? "Update Project" : "Create Project")}
        </Button>
      </DialogFooter>
    </form>
  );
}
