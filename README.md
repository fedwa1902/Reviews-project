# IT Governance Review Portal

An enterprise-grade admin dashboard for managing Microsoft 365 Workspace, Access, and License reviews. Built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

### 5. Lint

```bash
npm run lint
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts (via shadcn chart wrapper) |
| Animations | Framer Motion |
| Routing | React Router DOM 7 |
| Toasts | Sonner |
| Icons | Lucide React |
| Font | Geist (via @fontsource-variable) |

## Project Structure

```
src/
├── App.tsx                     # Root layout, routing, providers
├── main.tsx                    # Entry point
├── index.css                   # Tailwind config & design tokens (oklch)
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, card, badge, chart, popover, etc.)
│   ├── layout/                 # App shell: sidebar, header, theme provider, notification popover
│   ├── dashboard/              # Dashboard overview, analytics, users, settings pages
│   ├── reviews/                # Review list (3D cards), detail pages (workspace/access/license)
│   ├── common/                 # Shared components (CategoryBadge, ProgressHeader)
│   └── NotFoundPage.tsx        # 404 fallback
├── hooks/
│   └── useReviews.tsx          # Shared review state context (with 5s undo support)
├── data/
│   └── mockReviews.ts          # Mock data for workspace, access, and license reviews
├── types/
│   └── review.ts               # TypeScript types for all review categories
└── lib/
    └── utils.ts                # cn() utility (clsx + tailwind-merge)
```

## Key Features

### Review Management
- **Three review categories**: Workspace, Access, License
- **Interactive detail pages** with radio-button decisions, member-level access controls, and feature usage breakdowns
- **5-second undo** after submitting a review — click Undo in the toast to revert

### Dashboard
- **Overview** with stat cards, progress donut, upcoming reviews, and recent activity
- **Analytics** with shadcn/recharts: weekly bar chart, monthly area trend, category pie chart, compliance radial gauge
- **Notification popover** with governance-specific alerts (overdue, deadlines, new assignments)

### UI/UX
- **Dark/Light/System** theme toggle
- **Animated 3D review cards** with mouse-tracking tilt and staggered entrance
- **Responsive sidebar** with collapsible navigation
- **Breadcrumb** showing current page title

## Environment

No environment variables are required. The app runs entirely on mock data with no backend dependency.

## License

Private project — not licensed for redistribution.
