import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  MessageSquare, Users, FolderKanban, BarChart3, 
  Mail, Calendar, ArrowLeft, LogOut, Check, Eye
} from "lucide-react";
import type { ContactMessage, ProjectRequest, User } from "@shared/schema";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const { data: clients = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/clients"],
  });

  const { data: requests = [] } = useQuery<ProjectRequest[]>({
    queryKey: ["/api/admin/requests"],
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
            <h1 className="font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
              {stats?.newMessages ? (
                <Badge variant="secondary" className="ml-2">{stats.newMessages}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">
              <FolderKanban className="mr-2 h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="clients" data-testid="tab-clients">
              <Users className="mr-2 h-4 w-4" />
              Clients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.newMessages || 0} new</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Project Requests</CardTitle>
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalRequests || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.activeRequests || 0} active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Registered Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No messages yet</p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <Card key={msg.id} className="p-4" data-testid={`message-${msg.id}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium">{msg.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {msg.email}
                                </Badge>
                                <Badge className={`${getStatusColor(msg.status)} text-white text-xs`}>
                                  {msg.status}
                                </Badge>
                              </div>
                              <p className="font-medium text-sm">{msg.subject}</p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(msg.createdAt!).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {msg.status === "new" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateMessageMutation.mutate({ id: msg.id, status: "read" })}
                                  data-testid={`button-mark-read-${msg.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {msg.status !== "replied" && (
                                <Button
                                  size="sm"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Project Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {requests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No project requests yet</p>
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
                                {req.budget && <span>Budget: {req.budget}</span>}
                                {req.timeline && <span>Timeline: {req.timeline}</span>}
                              </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Registered Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {clients.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No clients registered yet</p>
                  ) : (
                    <div className="space-y-4">
                      {clients.map((client) => (
                        <Card key={client.id} className="p-4" data-testid={`client-${client.id}`}>
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-medium text-primary">
                                {client.name?.charAt(0) || client.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{client.name || "No name"}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              {client.mobile && (
                                <p className="text-xs text-muted-foreground">{client.mobile}</p>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Joined {new Date(client.createdAt!).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
