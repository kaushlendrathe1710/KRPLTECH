import { 
  users, projects, otpTokens, contactMessages, projectRequests,
  type User, type InsertUser, 
  type Project, type InsertProject,
  type OtpToken, type InsertOtpToken,
  type ContactMessage, type InsertContactMessage,
  type ProjectRequest, type InsertProjectRequest,
  SUPERADMIN_EMAIL
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gt } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllClients(): Promise<User[]>;
  getAllAdmins(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  
  // OTP
  createOTP(otp: InsertOtpToken): Promise<OtpToken>;
  getValidOTP(email: string, code: string): Promise<OtpToken | undefined>;
  markOTPUsed(id: string): Promise<void>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  updateContactMessageStatus(id: string, status: string, handledBy?: string): Promise<ContactMessage | undefined>;
  
  // Project Requests
  createProjectRequest(request: InsertProjectRequest): Promise<ProjectRequest>;
  getProjectRequestsByClient(clientId: string): Promise<ProjectRequest[]>;
  getAllProjectRequests(): Promise<ProjectRequest[]>;
  getProjectRequest(id: string): Promise<ProjectRequest | undefined>;
  updateProjectRequest(id: string, updates: Partial<ProjectRequest>): Promise<ProjectRequest | undefined>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  seedProjectsIfEmpty(): Promise<void>;
  seedSuperadmin(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ========== USERS ==========
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      email: insertUser.email.toLowerCase(),
    }).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllClients(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "client")).orderBy(desc(users.createdAt));
  }

  async getAllAdmins(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: string): Promise<boolean> {
    // Check if user is protected (superadmin)
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (user?.isProtected) {
      return false; // Cannot delete superadmin
    }
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // ========== OTP ==========
  async createOTP(otp: InsertOtpToken): Promise<OtpToken> {
    // Invalidate previous unused OTPs for this email
    await db.update(otpTokens)
      .set({ used: true })
      .where(and(eq(otpTokens.email, otp.email.toLowerCase()), eq(otpTokens.used, false)));
    
    const [token] = await db.insert(otpTokens).values({
      ...otp,
      email: otp.email.toLowerCase(),
    }).returning();
    return token;
  }

  async getValidOTP(email: string, code: string): Promise<OtpToken | undefined> {
    const [token] = await db.select().from(otpTokens).where(
      and(
        eq(otpTokens.email, email.toLowerCase()),
        eq(otpTokens.code, code),
        eq(otpTokens.used, false),
        gt(otpTokens.expiresAt, new Date())
      )
    );
    return token || undefined;
  }

  async markOTPUsed(id: string): Promise<void> {
    await db.update(otpTokens).set({ used: true }).where(eq(otpTokens.id, id));
  }

  // ========== CONTACT MESSAGES ==========
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [msg] = await db.insert(contactMessages).values(message).returning();
    return msg;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [msg] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return msg || undefined;
  }

  async updateContactMessageStatus(id: string, status: string, handledBy?: string): Promise<ContactMessage | undefined> {
    const [msg] = await db.update(contactMessages)
      .set({ status, handledBy })
      .where(eq(contactMessages.id, id))
      .returning();
    return msg || undefined;
  }

  // ========== PROJECT REQUESTS ==========
  async createProjectRequest(request: InsertProjectRequest): Promise<ProjectRequest> {
    const [req] = await db.insert(projectRequests).values(request).returning();
    return req;
  }

  async getProjectRequestsByClient(clientId: string): Promise<ProjectRequest[]> {
    return await db.select().from(projectRequests)
      .where(eq(projectRequests.clientId, clientId))
      .orderBy(desc(projectRequests.createdAt));
  }

  async getAllProjectRequests(): Promise<ProjectRequest[]> {
    return await db.select().from(projectRequests).orderBy(desc(projectRequests.createdAt));
  }

  async getProjectRequest(id: string): Promise<ProjectRequest | undefined> {
    const [req] = await db.select().from(projectRequests).where(eq(projectRequests.id, id));
    return req || undefined;
  }

  async updateProjectRequest(id: string, updates: Partial<ProjectRequest>): Promise<ProjectRequest | undefined> {
    const [req] = await db.update(projectRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projectRequests.id, id))
      .returning();
    return req || undefined;
  }

  // ========== PROJECTS ==========
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.year));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // ========== SEEDING ==========
  async seedSuperadmin(): Promise<void> {
    const existing = await this.getUserByEmail(SUPERADMIN_EMAIL);
    if (!existing) {
      await db.insert(users).values({
        email: SUPERADMIN_EMAIL.toLowerCase(),
        name: "Super Admin",
        role: "admin",
        isProtected: true,
      });
      console.log(`Created superadmin: ${SUPERADMIN_EMAIL}`);
    }
  }

  async seedProjectsIfEmpty(): Promise<void> {
    const existing = await db.select().from(projects).limit(1);
    if (existing.length > 0) return;

    const sampleProjects: InsertProject[] = [
      {
        title: "E-Commerce Platform",
        description: "A full-featured online store with cart, checkout, and payment integration.",
        longDescription: "Built a comprehensive e-commerce solution with product catalog, shopping cart, secure checkout, Stripe payment integration, order management, and admin dashboard. Features include real-time inventory tracking, email notifications, and responsive design.",
        category: "E-commerce",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2024,
        featured: 1,
      },
      {
        title: "Project Management Tool",
        description: "Collaborative task management with real-time updates and team features.",
        longDescription: "A Kanban-style project management application with drag-and-drop functionality, real-time collaboration using WebSockets, team member assignments, due date tracking, and progress analytics.",
        category: "Web App",
        technologies: ["Next.js", "TypeScript", "Prisma", "WebSocket", "Redis"],
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2024,
        featured: 1,
      },
      {
        title: "AI Chat Assistant",
        description: "Intelligent chatbot powered by GPT for customer support automation.",
        longDescription: "Developed an AI-powered chat assistant using OpenAI's GPT models. Features include context-aware responses, conversation history, knowledge base integration, and seamless handoff to human agents.",
        category: "Web App",
        technologies: ["Python", "FastAPI", "OpenAI", "React", "MongoDB"],
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2024,
        featured: 1,
      },
      {
        title: "Fitness Tracking App",
        description: "Mobile-first workout tracker with progress analytics and social features.",
        longDescription: "A comprehensive fitness application featuring workout logging, exercise library, progress charts, goal setting, achievement badges, and social sharing.",
        category: "Mobile App",
        technologies: ["React Native", "Firebase", "Node.js", "Chart.js"],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time business intelligence dashboard with customizable widgets.",
        longDescription: "Built an interactive analytics dashboard featuring real-time data visualization, customizable widget layouts, automated report generation, and data export capabilities.",
        category: "Dashboard",
        technologies: ["React", "D3.js", "GraphQL", "PostgreSQL", "Docker"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
      {
        title: "Recipe Sharing Platform",
        description: "Community-driven recipe platform with meal planning features.",
        longDescription: "A social platform for sharing and discovering recipes. Features include recipe creation with step-by-step instructions, nutritional information, meal planning calendar, and shopping list generation.",
        category: "Web App",
        technologies: ["Vue.js", "Node.js", "MongoDB", "Cloudinary", "Algolia"],
        imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
    ];

    await db.insert(projects).values(sampleProjects);
    console.log("Seeded database with sample projects");
  }
}

export const storage = new DatabaseStorage();
