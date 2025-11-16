# CharityHub - Modern Crowdfunding Platform

A full-stack crowdfunding and fundraising web application built with Next.js 16, TypeScript, Tailwind CSS, and Shadcn/ui.

## Features

### Core Pages

- **Homepage (`/`)**: Compelling hero section, featured campaigns, and platform statistics
- **Campaign Listing (`/campaigns`)**: Browse all campaigns with filtering and sorting
- **Campaign Detail (`/campaigns/[slug]`)**: Detailed campaign view with tabs for description, updates, and milestones
- **Contact Page (`/contact`)**: Contact form for general inquiries

### Key Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern UI with Shadcn/ui components
- ✅ Campaign filtering by category
- ✅ Campaign sorting (recent, most funded, trending, ending soon)
- ✅ Search functionality
- ✅ Progress tracking with visual progress bars
- ✅ Milestone tracking system
- ✅ Campaign updates timeline
- ✅ Mock contribution system
- ✅ TypeScript interfaces for type safety
- ✅ Comprehensive mock data

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd charity
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
charity/
├── app/                      # Next.js app directory
│   ├── campaigns/           # Campaign pages
│   │   ├── [slug]/         # Dynamic campaign detail page
│   │   └── page.tsx        # Campaign listing page
│   ├── contact/            # Contact page
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── not-found.tsx       # 404 page
├── components/             # React components
│   ├── campaigns/          # Campaign-specific components
│   │   └── campaign-card.tsx
│   ├── layout/             # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── ui/                 # Shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       └── ...
├── lib/                    # Utility functions and data
│   ├── data.ts            # Mock campaign data
│   └── utils.ts           # Utility functions
├── types/                  # TypeScript type definitions
│   └── index.ts           # Campaign and related interfaces
├── public/                 # Static assets
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### CampaignCard
Reusable card component displaying campaign summary with:
- Campaign image placeholder
- Title and description
- Progress bar
- Funding statistics
- Backer count and days remaining

### Campaign Detail Page
Comprehensive campaign view featuring:
- Full campaign information
- Tabbed interface for description/updates and milestones
- Visual milestone tracker with status indicators
- Contribution form with quick amount buttons
- Funding statistics sidebar

### Filtering & Sorting
Advanced campaign discovery with:
- Search by title or description
- Filter by category
- Sort by: Most Recent, Most Funded, Most Backers, Ending Soon

## Mock Data Structure

The application includes 6 comprehensive mock campaigns covering various categories:
- Water & Sanitation
- Education
- Healthcare
- Energy & Environment
- Economic Development
- Humanitarian Aid

Each campaign includes:
- Complete details and descriptions
- Multiple milestones with status tracking
- Campaign updates
- Funding progress
- Backer statistics

## Responsive Design

The platform is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Future Enhancements

This demo includes mock handlers for:
- Campaign contributions (payment processing)
- Form submissions (contact form)
- User authentication
- Campaign creation
- Database integration

## License

This is a demo project created for educational purposes.

## Support

For questions or support, visit the contact page or reach out to support@charityhub.com.
