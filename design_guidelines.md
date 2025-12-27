# Portfolio Website Design Guidelines

## Design Approach: Reference-Based (Behance + Linear + Dribbble)

Drawing inspiration from leading portfolio platforms with emphasis on visual project showcases, clean typography, and effortless navigation for extensive collections.

**Key Principles:**
- Visual-first project presentation with substantial imagery
- Scalable grid system accommodating 100+ projects
- Efficient filtering and search for growing collection
- Fast-loading, performance-optimized despite rich media

---

## Typography System

**Font Stack:**
- Headlines: Inter (700-800 weight) for strong project titles
- Body: Inter (400-500 weight) for descriptions
- Accent: JetBrains Mono (500 weight) for technical tags/metadata

**Hierarchy:**
- Hero Title: text-6xl md:text-7xl font-bold
- Section Headers: text-4xl md:text-5xl font-bold
- Project Titles: text-2xl md:text-3xl font-bold
- Body Text: text-base md:text-lg
- Metadata/Tags: text-sm uppercase tracking-wide

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Grid gaps: gap-6 md:gap-8

**Container Strategy:**
- Full-width hero and project grids
- Inner content: max-w-7xl mx-auto px-6

---

## Core Components

### Navigation (Sticky Header)
- Left: Personal brand/logo
- Center: Filter tags (All, Web Apps, Mobile, Design, etc.)
- Right: About, Contact, Resume/CV download
- Height: h-20, backdrop-blur effect

### Hero Section
- Full-width background: gradient or subtle geometric pattern
- Centered content block (max-w-4xl)
- Large headline introducing yourself
- Subheading with role/expertise (e.g., "Full-Stack Developer • 20+ Projects Shipped")
- Project count metric display
- Blurred-background CTA button: "View Projects"
- Height: 70vh minimum

### Project Grid (Primary Section)
**Masonry/Grid Layout:**
- Desktop: grid-cols-3 (lg:grid-cols-3)
- Tablet: grid-cols-2 (md:grid-cols-2)
- Mobile: grid-cols-1
- Gap: gap-6 md:gap-8

**Project Card Structure:**
- Featured image (16:10 aspect ratio)
- Overlay on hover: project title, brief description, tech stack tags
- Click reveals project detail modal/page
- Category badge (top-left corner)
- Launch year (subtle, bottom-right)

### Filtering System (Below Hero)
- Horizontal scroll tags on mobile
- Multi-select chip buttons (All, JavaScript, React, Python, Design, E-commerce, etc.)
- Active state clearly distinguished
- Smooth transition when filtering (fade-in animation acceptable here)

### Project Detail Modal/Page
**Two-column layout (desktop):**
- Left: Large project screenshots/demo video (60% width)
- Right: Project information (40% width)
  - Title, tagline
  - Full description (max-w-prose)
  - Tech stack chips
  - Key features list
  - Live demo + GitHub links (prominent buttons with blur backgrounds)
  - Project timeline/date

### Stats Section
- Four-column grid: Projects Completed, Technologies Used, Years Experience, Client Satisfaction
- Large numbers (text-5xl font-bold) with labels below
- Padding: py-16 md:py-24

### About Section
**Two-column layout:**
- Left: Professional photo or avatar (rounded-2xl)
- Right: Bio paragraph (max-w-prose), skills list with visual indicators (simple bars or chips)
- Padding: py-16 md:py-24

### Contact Section
**Single column, centered:**
- Headline: "Let's Build Something"
- Email, LinkedIn, GitHub links (large, card-style buttons)
- Optional contact form (name, email, message)
- Padding: py-16 md:py-24

### Footer
- Three-column grid (stacks on mobile)
- Left: Quick links (Projects, About, Contact)
- Center: Social links (GitHub, LinkedIn, Twitter, Dribbble)
- Right: Newsletter signup with inline form
- Bottom: Copyright and "Built with [tech stack]"
- Padding: py-12

---

## Images Strategy

**Hero Section:**
- Large background image: abstract tech/code visualization or geometric pattern (subtle, not distracting)
- Overlay gradient for text readability

**Project Cards:**
- High-quality screenshots (1600x1000px recommended)
- Actual project interfaces, not stock photos
- Consistent aspect ratios across grid

**About Section:**
- Professional headshot or creative self-portrait (800x800px)

**Project Detail Pages:**
- Multiple screenshots showing different views/features
- Optional: Screen recording/GIF of interactions

---

## Responsive Behavior

**Mobile-First Adaptations:**
- Single-column project grid
- Horizontal scrolling filter tags
- Stacked two-column layouts
- Enlarged touch targets (min h-12)
- Simplified navigation (hamburger if needed)

**Performance Considerations:**
- Lazy-load project images below fold
- Pagination or infinite scroll after 20 projects
- Thumbnail images in grid (full-res on detail view)

---

## Special Features

**Search Functionality:**
- Prominent search bar in header or above project grid
- Real-time filtering by project name, description, tech stack
- Keyboard shortcut (Cmd/Ctrl + K)

**Sort Options:**
- Newest First (default)
- Oldest First
- Most Complex (by tech stack count)
- Alphabetical

This design scales effortlessly from 20 to 100+ projects while maintaining visual impact and usability.