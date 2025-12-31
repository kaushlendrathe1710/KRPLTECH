import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { insertProjectSchema, insertContactMessageSchema, insertProjectRequestSchema, SUPERADMIN_EMAIL } from "@shared/schema";
import { generateOTP, sendOTPEmail, sendContactConfirmation } from "./email";
import { z } from "zod";

// Session type extension
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || req.session.userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Trust proxy for production (Railway, Heroku, etc.)
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  
  // Setup session with PostgreSQL store
  const PgSession = connectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  // Seed database
  await storage.seedProjectsIfEmpty();
  await storage.seedSuperadmin();

  // ========== AUTH ROUTES ==========
  
  // Request OTP
  app.post("/api/auth/request-otp", async (req, res) => {
    try {
      const schema = z.object({ email: z.string().email() });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const { email } = result.data;
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createOTP({ email, code: otp, expiresAt, used: false });
      await sendOTPEmail(email, otp);

      // Check if user exists to inform frontend
      const user = await storage.getUserByEmail(email);
      
      res.json({ 
        success: true, 
        isNewUser: !user,
        message: "OTP sent to your email" 
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Verify OTP and login/register
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        code: z.string().length(6),
        name: z.string().optional(),
        mobile: z.string().optional(),
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const { email, code, name, mobile } = result.data;
      
      // Validate OTP first
      const token = await storage.getValidOTP(email, code);
      if (!token) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // New user - require name for registration
        // Don't consume OTP yet if we need registration info
        if (!name) {
          return res.status(400).json({ error: "Name is required for new users", requiresRegistration: true });
        }
        
        // Now consume the OTP since we have all needed info
        await storage.markOTPUsed(token.id);
        
        // Check if this is the superadmin email
        const role = email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() ? "admin" : "client";
        const isProtected = email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
        
        user = await storage.createUser({
          email,
          name,
          mobile,
          role,
          isProtected,
        });
      } else {
        // Existing user - consume the OTP
        await storage.markOTPUsed(token.id);
      }

      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json({ user: null });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      }
    });
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // ========== CONTACT MESSAGES ==========
  
  // Submit contact form (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const message = await storage.createContactMessage(result.data);
      
      // Send confirmation email
      await sendContactConfirmation(result.data.email, result.data.name);

      res.status(201).json({ success: true, id: message.id });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      res.status(500).json({ error: "Failed to submit message" });
    }
  });

  // Get all messages (admin only)
  app.get("/api/admin/messages", requireAdmin, async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Update message status (admin only)
  app.patch("/api/admin/messages/:id", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const message = await storage.updateContactMessageStatus(
        req.params.id, 
        status, 
        req.session.userId
      );
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Failed to update message:", error);
      res.status(500).json({ error: "Failed to update message" });
    }
  });

  // ========== ADMIN ROUTES ==========
  
  // Get all clients
  app.get("/api/admin/clients", requireAdmin, async (_req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const [clients, admins] = await Promise.all([
        storage.getAllClients(),
        storage.getAllAdmins(),
      ]);
      res.json([...admins, ...clients]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user (admin only) - for role changes
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { role, name, mobile } = req.body;
      
      // Check if target user is protected
      const targetUser = await storage.getUser(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      if (targetUser.isProtected && role !== targetUser.role) {
        return res.status(403).json({ error: "Cannot modify superadmin role" });
      }
      
      const updates: Record<string, any> = {};
      if (role) updates.role = role;
      if (name !== undefined) updates.name = name;
      if (mobile !== undefined) updates.mobile = mobile;
      
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(403).json({ error: "Cannot delete this user" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Get all project requests
  app.get("/api/admin/requests", requireAdmin, async (_req, res) => {
    try {
      const requests = await storage.getAllProjectRequests();
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // Update project request (admin)
  app.patch("/api/admin/requests/:id", requireAdmin, async (req, res) => {
    try {
      const request = await storage.updateProjectRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Failed to update request:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // Get dashboard stats
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const [messages, clients, requests, projects] = await Promise.all([
        storage.getAllContactMessages(),
        storage.getAllClients(),
        storage.getAllProjectRequests(),
        storage.getAllProjects(),
      ]);

      const newMessages = messages.filter(m => m.status === "new").length;
      const activeRequests = requests.filter(r => 
        ["pending", "reviewing", "approved", "in_progress"].includes(r.status)
      ).length;
      const completedRequests = requests.filter(r => r.status === "completed").length;

      res.json({
        totalMessages: messages.length,
        newMessages,
        totalClients: clients.length,
        totalRequests: requests.length,
        activeRequests,
        completedRequests,
        totalProjects: projects.length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // ========== CLIENT ROUTES ==========
  
  // Get client's project requests
  app.get("/api/client/requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getProjectRequestsByClient(req.session.userId!);
      res.json(requests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // Submit project request
  app.post("/api/client/requests", requireAuth, async (req, res) => {
    try {
      const result = insertProjectRequestSchema.safeParse({
        ...req.body,
        clientId: req.session.userId,
      });
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const request = await storage.createProjectRequest(result.data);
      res.status(201).json(request);
    } catch (error) {
      console.error("Failed to create request:", error);
      res.status(500).json({ error: "Failed to create request" });
    }
  });

  // Update user profile
  app.patch("/api/client/profile", requireAuth, async (req, res) => {
    try {
      const { name, mobile } = req.body;
      const user = await storage.updateUser(req.session.userId!, { name, mobile });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // ========== PROJECT ROUTES ==========
  
  // Get all projects (public)
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project (public)
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create project (admin only)
  app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Failed to create project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update project (admin only)
  app.patch("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const result = insertProjectSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }
      const project = await storage.updateProject(req.params.id, result.data);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Failed to update project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project (admin only)
  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  return httpServer;
}
