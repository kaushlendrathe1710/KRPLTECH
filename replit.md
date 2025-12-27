# Portfolio Website

## Overview

A modern developer portfolio website built to showcase projects with rich media, filtering capabilities, and responsive design. The application follows a visual-first approach inspired by Behance, Linear, and Dribbble, designed to handle 100+ projects efficiently with search and category filtering.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with HMR support

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build**: esbuild for production bundling

The server provides:
- Project CRUD operations
- Static file serving in production
- Vite dev server integration in development

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Migrations**: Drizzle Kit with `db:push` command
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory accessible to both client and server via path aliases
- **Theme System**: Light/dark mode with CSS custom properties and React context
- **Query Client**: Centralized configuration with credentials included for API requests

## External Dependencies

### Database
- PostgreSQL (required via `DATABASE_URL` environment variable)
- Connection pooling via `pg` package

### UI/Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Lucide React and react-icons for iconography
- Class Variance Authority for component variants

### Data Fetching
- TanStack React Query for caching and synchronization
- Native fetch API wrapped in custom `apiRequest` helper

### Development Tools
- Replit-specific Vite plugins for error overlay and dev tooling
- TypeScript with strict mode enabled
- Path aliases configured in both tsconfig.json and Vite