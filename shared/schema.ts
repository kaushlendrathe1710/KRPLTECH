import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const USER_ROLES = ["admin", "client"] as const;
export type UserRole = typeof USER_ROLES[number];

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  mobile: text("mobile"),
  role: text("role").notNull().default("client"),
  isProtected: boolean("is_protected").default(false), // For superadmin
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// OTP tokens for passwordless auth
export const otpTokens = pgTable("otp_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOtpTokenSchema = createInsertSchema(otpTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertOtpToken = z.infer<typeof insertOtpTokenSchema>;
export type OtpToken = typeof otpTokens.$inferSelect;

// Contact messages from the contact form
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, read, replied
  userId: varchar("user_id"), // Optional link to registered user
  handledBy: varchar("handled_by"), // Admin who handled it
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  userId: true,
  handledBy: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Project request statuses
export const REQUEST_STATUSES = ["pending", "reviewing", "approved", "in_progress", "completed", "cancelled"] as const;
export type RequestStatus = typeof REQUEST_STATUSES[number];

// Project requests from clients
export const projectRequests = pgTable("project_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  budget: text("budget"),
  timeline: text("timeline"),
  technologies: text("technologies").array(),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  assignedTo: varchar("assigned_to"), // Admin assigned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectRequestSchema = createInsertSchema(projectRequests).omit({
  id: true,
  status: true,
  adminNotes: true,
  assignedTo: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjectRequest = z.infer<typeof insertProjectRequestSchema>;
export type ProjectRequest = typeof projectRequests.$inferSelect;

// Project schema for portfolio
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  imageUrl: text("image_url").notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  year: integer("year").notNull(),
  featured: integer("featured").default(0),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Categories for filtering
export const PROJECT_CATEGORIES = [
  "All",
  "Web App",
  "Mobile App", 
  "E-commerce",
  "Dashboard",
  "Landing Page",
  "API/Backend",
  "Design",
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

// Superadmin email constant
export const SUPERADMIN_EMAIL = "kaushlendra.k12@fms.edu";
