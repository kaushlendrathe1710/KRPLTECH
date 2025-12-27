import { users, projects, type User, type InsertUser, type Project, type InsertProject } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  seedProjectsIfEmpty(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
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
        longDescription: "A comprehensive fitness application featuring workout logging, exercise library, progress charts, goal setting, achievement badges, and social sharing. Integrated with wearable devices for automatic activity tracking.",
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
        longDescription: "Built an interactive analytics dashboard featuring real-time data visualization, customizable widget layouts, automated report generation, and data export capabilities. Supports multiple data sources and role-based access control.",
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
        longDescription: "A social platform for sharing and discovering recipes. Features include recipe creation with step-by-step instructions, nutritional information, meal planning calendar, shopping list generation, and user reviews.",
        category: "Web App",
        technologies: ["Vue.js", "Node.js", "MongoDB", "Cloudinary", "Algolia"],
        imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
      {
        title: "Real Estate Listings",
        description: "Property search platform with map integration and virtual tours.",
        longDescription: "A real estate platform featuring advanced property search with filters, interactive map view, virtual tour integration, mortgage calculator, agent contact system, and saved searches with email alerts.",
        category: "Web App",
        technologies: ["React", "Node.js", "PostgreSQL", "Mapbox", "AWS S3"],
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
      {
        title: "Event Booking System",
        description: "Ticket booking platform with seat selection and QR code tickets.",
        longDescription: "An event management and ticketing platform with interactive seat selection, secure payment processing, QR code ticket generation, event organizer dashboard, and attendee management tools.",
        category: "E-commerce",
        technologies: ["Next.js", "Prisma", "Stripe", "QR Code", "SendGrid"],
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2023,
        featured: 0,
      },
      {
        title: "Learning Management System",
        description: "Online course platform with video lessons and progress tracking.",
        longDescription: "A comprehensive LMS featuring course creation tools, video hosting, interactive quizzes, progress tracking, certificates, discussion forums, and instructor analytics dashboard.",
        category: "Web App",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Vimeo API"],
        imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2022,
        featured: 0,
      },
      {
        title: "Inventory Management",
        description: "Stock management system with barcode scanning and low-stock alerts.",
        longDescription: "An inventory management solution with barcode/QR code scanning, stock level monitoring, automated reorder alerts, supplier management, purchase order generation, and reporting tools.",
        category: "Dashboard",
        technologies: ["React", "Python", "PostgreSQL", "Redis", "Docker"],
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2022,
        featured: 0,
      },
      {
        title: "Portfolio Website",
        description: "Personal portfolio with project showcase and blog integration.",
        longDescription: "A modern portfolio website featuring project showcase, blog with MDX support, contact form, dark mode, animations, and SEO optimization. Fully responsive with excellent performance scores.",
        category: "Landing Page",
        technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "MDX"],
        imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2022,
        featured: 0,
      },
      {
        title: "Weather Dashboard",
        description: "Beautiful weather app with forecasts and location-based data.",
        longDescription: "A weather application featuring current conditions, hourly and weekly forecasts, interactive radar maps, severe weather alerts, and support for multiple saved locations.",
        category: "Web App",
        technologies: ["React", "OpenWeather API", "Mapbox", "Chart.js"],
        imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2022,
        featured: 0,
      },
      {
        title: "Social Media Dashboard",
        description: "Unified dashboard for managing multiple social media accounts.",
        longDescription: "A social media management tool for scheduling posts, analyzing engagement metrics, monitoring mentions, and managing multiple accounts across platforms from a single dashboard.",
        category: "Dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Twitter API", "Meta API"],
        imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2022,
        featured: 0,
      },
      {
        title: "Crypto Portfolio Tracker",
        description: "Cryptocurrency portfolio manager with real-time price updates.",
        longDescription: "A cryptocurrency tracking application with portfolio management, real-time price updates, historical charts, profit/loss calculations, price alerts, and news aggregation.",
        category: "Web App",
        technologies: ["React", "WebSocket", "CoinGecko API", "Chart.js", "Redis"],
        imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2021,
        featured: 0,
      },
      {
        title: "Job Board Platform",
        description: "Job listing site with applicant tracking and company profiles.",
        longDescription: "A job board platform featuring job posting management, resume parsing, applicant tracking, company profiles, job alerts, and advanced search with filters for location, salary, and job type.",
        category: "Web App",
        technologies: ["Next.js", "PostgreSQL", "Elasticsearch", "AWS", "Stripe"],
        imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2021,
        featured: 0,
      },
      {
        title: "REST API Service",
        description: "Scalable REST API with authentication and rate limiting.",
        longDescription: "A production-ready REST API service with JWT authentication, role-based access control, rate limiting, request validation, comprehensive documentation, and monitoring with health checks.",
        category: "API/Backend",
        technologies: ["Node.js", "Express", "PostgreSQL", "Redis", "Swagger"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2021,
        featured: 0,
      },
      {
        title: "Restaurant Ordering App",
        description: "Mobile ordering app with menu browsing and order tracking.",
        longDescription: "A restaurant ordering application featuring digital menu with photos, customization options, order tracking, loyalty rewards, table reservation, and integration with POS systems.",
        category: "Mobile App",
        technologies: ["React Native", "Node.js", "MongoDB", "Stripe", "Push Notifications"],
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2021,
        featured: 0,
      },
      {
        title: "Survey Builder",
        description: "Drag-and-drop survey creator with analytics and reporting.",
        longDescription: "A survey creation platform with drag-and-drop form builder, multiple question types, conditional logic, response analytics, export capabilities, and embeddable widgets.",
        category: "Web App",
        technologies: ["React", "Node.js", "PostgreSQL", "DnD Kit", "Chart.js"],
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2021,
        featured: 0,
      },
      {
        title: "Document Management",
        description: "Cloud document storage with sharing and version control.",
        longDescription: "An enterprise document management system with file upload, folder organization, version history, access permissions, document preview, full-text search, and audit logging.",
        category: "Web App",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS S3", "Elasticsearch"],
        imageUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2020,
        featured: 0,
      },
      {
        title: "Travel Booking Site",
        description: "Travel platform for flights, hotels, and vacation packages.",
        longDescription: "A travel booking website with flight search, hotel reservations, package deals, itinerary planning, travel insurance options, and customer review system.",
        category: "E-commerce",
        technologies: ["Next.js", "Node.js", "PostgreSQL", "Amadeus API", "Stripe"],
        imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2020,
        featured: 0,
      },
      {
        title: "Podcast Platform",
        description: "Podcast hosting and discovery platform with analytics.",
        longDescription: "A podcast platform featuring episode hosting, RSS feed generation, player embed widget, listener analytics, monetization tools, and podcast discovery features.",
        category: "Web App",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS S3", "FFmpeg"],
        imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=500&fit=crop",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        year: 2020,
        featured: 0,
      },
    ];

    await db.insert(projects).values(sampleProjects);
    console.log("Seeded database with sample projects");
  }
}

export const storage = new DatabaseStorage();
