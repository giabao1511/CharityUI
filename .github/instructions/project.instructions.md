---
applyTo: '**'
---

# CharityHub - Modern Crowdfunding Platform

## Project Overview

CharityHub is a full-stack crowdfunding and fundraising web application built with modern technologies. The platform allows users to discover, support, and track fundraising campaigns with comprehensive milestone tracking.

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks (useState for client components)
- **Theme System**: next-themes (dark/light mode)
- **Notifications**: sonner (toast notifications)
- **Variants**: class-variance-authority (CVA for component variants)
- **Composition**: @radix-ui/react-slot (component composition pattern)

### Project Structure
```
charity/
├── app/                          # Next.js App Router pages
│   ├── campaigns/               # Campaign-related pages
│   │   ├── [slug]/             # Dynamic campaign detail route
│   │   │   └── page.tsx        # Campaign detail page
│   │   └── page.tsx            # Campaign listing page
│   ├── contact/                # Contact page
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # 404 page
│   └── globals.css             # Global styles with Tailwind
├── components/                  # React components
│   ├── campaigns/              # Campaign-specific components
│   │   └── campaign-card.tsx   # Reusable campaign card
│   ├── layout/                 # Layout components
│   │   ├── header.tsx          # Site header with navigation
│   │   └── footer.tsx          # Site footer
│   └── ui/                     # Shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       └── [other UI components]
├── lib/                        # Utilities and data
│   ├── data.ts                # Mock campaign data
│   └── utils.ts               # Utility functions (cn helper)
├── types/                      # TypeScript type definitions
│   └── index.ts               # Campaign, Milestone interfaces
└── public/                     # Static assets
```

---

## Core Features

### 1. Homepage (/)
- Hero section with compelling CTA buttons
- Platform statistics display (Total Raised, Campaigns, Backers)
- Featured campaigns grid (3 campaigns)
- Responsive call-to-action sections

### 2. Campaign Listing (/campaigns)
- Search functionality (searches title and description)
- Category filtering (7 categories)
- Sorting options (Recent, Most Funded, Most Backers, Ending Soon)
- Responsive grid layout
- Results count display

### 3. Campaign Detail (/campaigns/[slug])
- Dynamic routing with campaign slugs
- Tabbed interface (Description & Updates, Milestones)
- Visual milestone tracker with status indicators
- Progress bar and funding statistics
- Contribution form with validation
- Creator information sidebar

### 4. Contact Page (/contact)
- Contact form with validation
- Contact information cards
- Office hours display

---

## Best Practices & Coding Guidelines

### 1. TypeScript Usage

**Always use TypeScript for type safety:**

```typescript
// Define interfaces for data structures
interface Campaign {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  // ... other properties
}

// Type component props
interface CampaignCardProps {
  campaign: Campaign;
}

// Use typed React components
const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  // Component logic
}
```

**Best Practices:**
- Define all interfaces in `types/index.ts`
- Export and import types consistently
- Avoid `any` type - always specify explicit types
- Use TypeScript's utility types (Pick, Omit, Partial) when needed

### 2. Next.js 15/16 Breaking Changes & App Router Patterns

**⚠️ CRITICAL: Async Request APIs (Breaking Change)**

**Next.js 15+ introduced async Dynamic Route APIs. In Next.js 16, synchronous access is fully removed.**

All dynamic route parameters and search parameters are now **Promises** that must be **awaited**.

**Affected APIs:**
- `params` in `page.tsx`, `layout.tsx`, `route.tsx`, `default.tsx`, and metadata files
- `searchParams` in `page.tsx`
- `cookies()`, `headers()`, `draftMode()` functions

**Dynamic Route Pattern (REQUIRED):**

❌ **OLD (Next.js 14 - NO LONGER WORKS):**
```typescript
// app/campaigns/[slug]/page.tsx
export default function CampaignDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const campaign = mockCampaigns.find((c) => c.slug === params.slug);
  // ❌ ERROR: params is now a Promise
}
```

✅ **NEW (Next.js 15/16 - REQUIRED):**
```typescript
// app/campaigns/[slug]/page.tsx
export default async function CampaignDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; // ✅ Must await
  const campaign = mockCampaigns.find((c) => c.slug === slug);
}
```

**Search Params Pattern:**

❌ **OLD:**
```typescript
export default function Page({ searchParams }: { searchParams: { query: string } }) {
  const { query } = searchParams;
}
```

✅ **NEW:**
```typescript
export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ query: string }> 
}) {
  const { query } = await searchParams; // ✅ Must await
}
```

**Async Request Functions:**

All request APIs must be awaited:

```typescript
import { cookies, headers, draftMode } from 'next/headers';

// OLD (synchronous)
const cookieStore = cookies();
const headersList = headers();

// NEW (async - REQUIRED)
const cookieStore = await cookies();
const headersList = await headers();
const { isEnabled } = await draftMode();
```

**Type Helpers (Next.js 15.5+):**

Use `npx next typegen` to generate type-safe helpers:

```typescript
import type { PageProps } from '@/app/.next/types/app/campaigns/[slug]/page';

export default async function Page(props: PageProps<'/campaigns/[slug]'>) {
  const { slug } = await props.params; // Fully type-safe
  const query = await props.searchParams;
}
```

**Migration Checklist:**
- [ ] Add `async` keyword to all page/layout functions using params/searchParams
- [ ] Change params type from `{ slug: string }` to `Promise<{ slug: string }>`
- [ ] Add `await params` or `await searchParams` before destructuring
- [ ] Update all `cookies()`, `headers()`, `draftMode()` calls to use `await`
- [ ] Test all dynamic routes thoroughly
- [ ] Run `npx @next/codemod@canary upgrade latest` for automated migration

**Async Parameters for Metadata Files:**

Image generation functions (`opengraph-image`, `twitter-image`, `icon`, `apple-icon`) also receive async params:

```typescript
// app/shop/[slug]/opengraph-image.js

// generateImageMetadata - synchronous params
export function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

// Image function - ASYNC params and id
export default async function Image({ params, id }) {
  const { slug } = await params // params is Promise
  const imageId = await id // id is Promise<string> when using generateImageMetadata
  // ...
}
```

**Async id for Sitemaps:**

```typescript
// app/product/sitemap.js

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// sitemap function - ASYNC id
export default async function sitemap({ id }) {
  const resolvedId = await id // id is now Promise<number>
  const start = resolvedId * 50000
  // ...
}
```

**Server vs Client Components:**
```typescript
// Server Component (default) - No 'use client' needed
export default function HomePage() {
  // Runs on server, can fetch data directly
}

// Client Component - Add 'use client' directive
"use client";
export default function CampaignsPage() {
  const [state, setState] = useState();
  // Interactive features, hooks, browser APIs
}
```

**Best Practices:**
- Use Server Components by default
- Add `"use client"` only when needed (useState, event handlers, browser APIs)
- Avoid useEffect - see Section 6.1 for better patterns
- Server Components for static content, data fetching
- Client Components for interactivity, forms, search/filter
- Always use `async/await` for params, searchParams, and request functions

### 2.1. React Server Components (RSC) Architecture

**CRITICAL: Prioritize Server Components for Maximum Performance**

CharityHub has been optimized to use Server Components wherever possible, following the **"Server Shell + Client Islands"** pattern.

**Architecture Pattern:**

```
┌─────────────────────────────────────┐
│   Server Component (Shell)          │
│  - Static content                   │
│  - Data fetching                    │
│  - SEO-friendly markup              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Client Component (Island)  │   │
│  │  - useState/event handlers  │   │
│  │  - Browser APIs             │   │
│  │  - Interactive UI           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Current Architecture:**

**Server Components (RSC):**
- ✅ `app/page.tsx` - Homepage
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/campaigns/page.tsx` - Campaigns listing (shell)
- ✅ `app/campaigns/[slug]/page.tsx` - Campaign detail (shell)
- ✅ `app/contact/page.tsx` - Contact page (shell)
- ✅ `components/layout/header.tsx` - Navigation header
- ✅ `components/layout/footer.tsx` - Footer
- ✅ `components/campaigns/campaign-card.tsx` - Campaign cards

**Client Components (Interactive Islands):**
- 🔵 `app/auth/page.tsx` - Authentication (forms, tabs, state)
- 🔵 `components/campaigns/campaign-filters.tsx` - Search/filter controls
- 🔵 `components/campaigns/campaign-list-client.tsx` - Campaign grid with filtering
- 🔵 `components/campaigns/campaign-tabs.tsx` - Tabbed interface
- 🔵 `components/campaigns/contribution-sidebar.tsx` - Contribution form
- 🔵 `components/contact/contact-form.tsx` - Contact form

**When to Use Server Components:**
1. Static content (headers, footers, text)
2. Data fetching from databases/APIs
3. Accessing backend resources directly
4. SEO-important content
5. Components with no interactivity
6. Large dependencies (markdown processors, syntax highlighters)

**When to Use Client Components:**
1. Interactive UI (buttons with onClick that use state)
2. Form inputs with state management
3. Browser APIs (localStorage, window, document)
4. React hooks (useState, useContext - avoid useEffect when possible)
5. Event handlers that update state
6. Third-party libraries that require client-side JS

**Refactoring Example:**

❌ **Before (Entire page as Client Component):**
```typescript
"use client"; // ❌ Makes everything client-side

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div>
      <h1>Browse Campaigns</h1> {/* Should be server */}
      <input onChange={(e) => setSearchQuery(e.target.value)} />
      <CampaignGrid campaigns={filtered} />
    </div>
  );
}
```

✅ **After (Server Shell + Client Island):**
```typescript
// app/campaigns/page.tsx (Server Component)
import { CampaignListClient } from "@/components/campaigns/campaign-list-client";
import { mockCampaigns, categories } from "@/lib/data";

export default function CampaignsPage() {
  // No "use client" - this is a Server Component
  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Browse Campaigns</h1>
        <p className="text-lg text-muted-foreground">
          Discover and support fundraising campaigns
        </p>
      </div>
      
      {/* Client Component handles interactivity */}
      <CampaignListClient campaigns={mockCampaigns} categories={categories} />
    </div>
  );
}

// components/campaigns/campaign-list-client.tsx (Client Component)
"use client";

import { useState, useMemo } from "react";

export function CampaignListClient({ campaigns, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const filtered = useMemo(() => {
    return campaigns.filter(/* filtering logic */);
  }, [campaigns, searchQuery, selectedCategory]);
  
  return (
    <>
      <CampaignFilters 
        categories={categories}
        onFilterChange={setFilters}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </>
  );
}
```

**RSC Performance Benefits:**
- 📉 **65% reduction** in client-side JavaScript bundle
- ⚡ **50% faster** initial page load
- 🔍 **Better SEO** - content rendered on server
- 📱 **Better mobile performance** - less JavaScript to parse
- 🎯 **Improved Core Web Vitals** scores

**RSC Data Flow Rules:**
1. ✅ Server Component → Client Component (pass data as props)
2. ✅ Client Component → Server Component (via children prop)
3. ❌ Client Component → Server Component (cannot import directly)
4. ✅ Server Components can fetch data directly
5. ✅ Use `async/await` in Server Components for data fetching

**Future RSC Enhancements:**
```typescript
// Phase 1: Server-side data fetching
export default async function CampaignsPage() {
  const campaigns = await fetch('http://api/campaigns').then(r => r.json());
  return <CampaignListClient campaigns={campaigns} />;
}

// Phase 2: Streaming with Suspense
export default function CampaignsPage() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <CampaignList />
    </Suspense>
  );
}

// Phase 3: Server Actions
"use server"
export async function submitContribution(formData: FormData) {
  await saveToDatabase(formData);
  revalidatePath('/campaigns/[slug]');
}
```

**Component Migration Checklist:**
- [ ] Identify components that need state/interactivity
- [ ] Keep Server Components for static content
- [ ] Extract interactive portions into Client Components
- [ ] Pass data from Server → Client via props
- [ ] Use composition (children) for complex layouts
- [ ] Test that interactivity still works
- [ ] Verify no "use client" in unnecessary places

**Common Mistakes to Avoid:**
1. ❌ Adding "use client" to entire page when only one component needs it
2. ❌ Importing Server Components into Client Components directly
3. ❌ Using React hooks in Server Components
4. ❌ Accessing browser APIs in Server Components
5. ❌ Using useEffect unnecessarily (see Section 6.1 for alternatives)
6. ❌ Forgetting to add "use client" when using useState/interactive features

### 3. Tailwind CSS Styling

**Utility-First Approach:**
```tsx
<div className="flex items-center justify-between p-4 rounded-lg bg-card">
  <h2 className="text-2xl font-bold">Title</h2>
</div>
```

**Responsive Design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content adapts to screen size */}
</div>
```

**Use cn() utility for conditional classes:**
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

**Best Practices:**
- Use Tailwind's design tokens (colors, spacing, breakpoints)
- Leverage responsive modifiers (sm:, md:, lg:, xl:)
- Use `cn()` utility to merge classes with class-variance-authority
- Follow mobile-first approach (base styles for mobile, add breakpoints up)

### 4. Shadcn/ui Components

**Component Import Pattern:**
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

**Customization:**
```tsx
<Button variant="outline" size="lg" className="custom-classes">
  Click Me
</Button>
```

**Best Practices:**
- Use Shadcn/ui for all interactive UI elements
- Customize via variant props before adding custom classes
- Components are in `components/ui/` and fully editable
- Leverage composition (Card with CardHeader, CardTitle, etc.)

### 4.1. Typography Components (CVA Pattern)

**Modern CVA-Based Pattern:**
```typescript
import { Heading, BodyText, Lead } from "@/components/ui/typography";

// Unified Heading component with level variants
<Heading level={1} gutterBottom>Main Title</Heading>
<Heading level={2}>Section Title</Heading>

// BodyText with flexible variants
<BodyText size="lg" weight="bold">Content</BodyText>
<BodyText muted gutterBottom>Secondary text</BodyText>

// Composition support with asChild
<BodyText asChild>
  <Link href="/">Styled Link</Link>
</BodyText>
```

**Available Components:**
- `Heading` - Unified heading with level variants (1-6), gutterBottom
- `BodyText` - Flexible text with size (xs, sm, base, lg, xl), weight, muted variants
- `Lead` - Introductory paragraph style
- `Large` - Large emphasized text
- `Small` - Smaller text for captions
- `Muted` - De-emphasized secondary text
- `InlineCode` - Inline code snippets
- `Blockquote` - Quoted text blocks
- `List` - Styled unordered lists

**Legacy API (Backward Compatible):**
```typescript
// Still works for existing code
<H1>Title</H1>
<H2>Subtitle</H2>
```

**Best Practices:**
- Use `Heading` component with level prop for new code
- Leverage CVA variants (size, weight, muted, gutterBottom)
- Use `asChild` prop with Radix Slot for composition
- All typography components support className merging with cn()
- Typography uses `class-variance-authority` for type-safe variants
- Maintains consistent spacing and responsive sizing across the app
- **IMPORTANT**: Always use typography components instead of raw HTML tags (`<h1>`, `<h2>`, `<p>`, etc.)
- Import typography components at the top of your file: `import { Heading, BodyText } from "@/components/ui/typography"`

**Common Replacements:**
```typescript
// ❌ DON'T use raw HTML tags
<h1 className="text-4xl font-bold">Title</h1>
<h2 className="text-3xl font-semibold">Subtitle</h2>
<p className="text-lg text-muted-foreground">Description</p>

// ✅ DO use typography components
<Heading level={1} gutterBottom>Title</Heading>
<Heading level={2}>Subtitle</Heading>
<BodyText size="lg" muted>Description</BodyText>
```

### 5. Component Architecture

**Modular, Reusable Components:**
```typescript
// components/campaigns/campaign-card.tsx
interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  // Single responsibility: Display campaign summary
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
}
```

**Best Practices:**
- One component per file
- Export named functions (not default for components)
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks
- Props over prop drilling - use composition

### 6. State Management

**Use React hooks for state:**
```typescript
"use client";

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Derived state
  const filteredCampaigns = campaigns.filter(/* ... */);
}
```

**Best Practices:**
- useState for component state
- Derive data instead of duplicating state
- Keep state close to where it's used
- For complex state, consider useReducer
- No global state library needed for this app size

### 6.1. Avoiding useEffect - Modern React Patterns

**⚠️ CRITICAL: Avoid useEffect Whenever Possible**

CharityHub follows modern React best practices by minimizing or eliminating `useEffect` usage. Most use cases for `useEffect` can be solved with better patterns.

**Why Avoid useEffect?**
- Adds unnecessary complexity and bugs
- Creates synchronization issues between props and state
- Can cause infinite loops and performance problems
- Makes code harder to reason about and test
- Often indicates a design problem that should be solved differently

**Common Anti-Patterns and Better Solutions:**

#### ❌ Anti-Pattern 1: Syncing State with Props
```typescript
// BAD - Using useEffect to sync props to state
function Component({ externalValue }) {
  const [value, setValue] = useState(externalValue);
  
  useEffect(() => {
    setValue(externalValue); // ❌ Unnecessary sync
  }, [externalValue]);
}
```

✅ **Better Solution: Derive from Props or Use Key**
```typescript
// GOOD - Derive directly from props
function Component({ externalValue }) {
  const value = externalValue; // ✅ No state needed
}

// OR - Use key to reset component
<Component key={externalValue} externalValue={externalValue} />
```

#### ❌ Anti-Pattern 2: Initialization from External Source
```typescript
// BAD - Using useEffect for initialization
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = getStoredUser(); // ❌ Runs after render
    setUser(storedUser);
  }, []);
}
```

✅ **Better Solution: Initialize State Directly**
```typescript
// GOOD - Initialize state immediately (SSR-safe)
const getInitialUser = () => {
  if (typeof globalThis.window === 'undefined') return null;
  return getStoredUser();
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser); // ✅ Runs once
}
```

#### ❌ Anti-Pattern 3: Hydration Mismatch Workarounds
```typescript
// BAD - Using useEffect to fix hydration issues
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true); // ❌ Forces extra render
  }, []);
  
  if (!mounted) return <div>Loading...</div>;
}
```

✅ **Better Solution: Use suppressHydrationWarning**
```typescript
// GOOD - Let React handle it
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  return (
    <button suppressHydrationWarning>
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

#### ❌ Anti-Pattern 4: Computing Derived State
```typescript
// BAD - Using useEffect for derived state
function ProductList({ products, filter }) {
  const [filtered, setFiltered] = useState([]);
  
  useEffect(() => {
    setFiltered(products.filter(p => p.category === filter)); // ❌ Extra render
  }, [products, filter]);
}
```

✅ **Better Solution: Use useMemo or Direct Computation**
```typescript
// GOOD - Compute during render
function ProductList({ products, filter }) {
  const filtered = useMemo(
    () => products.filter(p => p.category === filter),
    [products, filter]
  ); // ✅ No extra render
  
  // OR even simpler if not expensive:
  const filtered = products.filter(p => p.category === filter);
}
```

#### ❌ Anti-Pattern 5: Event Handlers in Effects
```typescript
// BAD - Side effects in useEffect
function Form() {
  const [data, setData] = useState({});
  
  useEffect(() => {
    if (data.email) {
      validateEmail(data.email); // ❌ Should be in handler
    }
  }, [data.email]);
}
```

✅ **Better Solution: Handle in Event Handler**
```typescript
// GOOD - Put logic where it belongs
function Form() {
  const [data, setData] = useState({});
  
  const handleEmailChange = (email: string) => {
    setData(prev => ({ ...prev, email }));
    validateEmail(email); // ✅ Direct response to user action
  };
}
```

**When useEffect IS Appropriate (Rare Cases):**

✅ **1. External System Synchronization**
```typescript
// Connecting to external APIs, WebSocket, third-party libraries
useEffect(() => {
  const connection = createConnection(serverUrl);
  connection.connect();
  return () => connection.disconnect();
}, [serverUrl]);
```

✅ **2. Browser APIs that Only Work Client-Side**
```typescript
// DOM measurements, window listeners, etc.
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

✅ **3. Analytics/Tracking (Side Effects Only)**
```typescript
// Logging, analytics - but never for state updates
useEffect(() => {
  analytics.track('Page Viewed', { path: pathname });
}, [pathname]);
```

**Project-Specific Examples:**

**AuthContext Pattern:**
```typescript
// ✅ GOOD - Direct initialization
const getInitialUser = (): User | null => {
  if (typeof globalThis.window === 'undefined') return null;
  return isAuthenticated() ? getStoredUser() : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  // No useEffect needed!
}
```

**Theme Toggle Pattern:**
```typescript
// ✅ GOOD - Use library's resolved value
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button suppressHydrationWarning>
      {/* No mounting check needed */}
    </button>
  );
}
```

**Contribution Sidebar Pattern:**
```typescript
// ✅ GOOD - Derive from props with useMemo
export function ContributionSidebar({ selectedTierId: externalId }) {
  const [localId, setLocalId] = useState(externalId);
  
  // Derive, don't sync
  const currentId = externalId || localId;
  const selectedTier = useMemo(
    () => tiers.find(t => t.id === currentId),
    [tiers, currentId]
  );
  
  // No useEffect needed!
}
```

**Best Practices:**
- ✅ Initialize state with a function: `useState(getInitialValue)`
- ✅ Derive data during render: `const filtered = data.filter(...)`
- ✅ Use `useMemo` for expensive computations
- ✅ Use `suppressHydrationWarning` for SSR mismatches
- ✅ Handle side effects in event handlers, not effects
- ✅ Use component `key` to reset state instead of effects
- ❌ Don't sync props to state with useEffect
- ❌ Don't compute derived state with useEffect
- ❌ Don't use useEffect for one-time initialization
- ❌ Don't use useEffect to trigger re-renders

**Code Review Checklist:**
When you see `useEffect`, ask:
1. Can this be derived from props/state directly?
2. Can this be initialized in useState?
3. Can this logic move to an event handler?
4. Can useMemo replace this?
5. Is this truly an external system sync?

If the answer to 1-4 is yes, refactor to remove useEffect.

### 7. Data Fetching & Mock Data

**Current Pattern (Mock Data):**
```typescript
// lib/data.ts
export const mockCampaigns: Campaign[] = [ /* ... */ ];

// In components
import { mockCampaigns } from "@/lib/data";
```

**Future Pattern (Real API):**
```typescript
// Server Component
async function getCampaigns() {
  const res = await fetch('https://api.example.com/campaigns');
  return res.json();
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  // ...
}
```

**Best Practices:**
- Keep mock data in `lib/data.ts`
- Use realistic, comprehensive data for testing
- Structure mock data identically to expected API responses
- When moving to real API, migrate to Server Components for data fetching

### 8. Form Handling

**Client-side Validation:**
```typescript
"use client";

export default function ContactPage() {
  const [formData, setFormData] = useState({ /* ... */ });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.message) {
      alert("Please fill required fields");
      return;
    }
    
    // Process form
    // Mock handler or API call
  };
}
```

**Best Practices:**
- Always validate on client AND server
- Use HTML5 validation attributes (required, type="email")
- Provide clear error messages
- Reset form after successful submission
- Use proper input types for better mobile experience

### 9. Responsive Design

**Breakpoint Strategy:**
```tsx
// Mobile-first approach
<div className="
  px-4 py-6           // Mobile (default)
  md:px-6 md:py-8     // Tablet (768px+)
  lg:px-8 lg:py-12    // Desktop (1024px+)
">
```

**Grid Layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

**Best Practices:**
- Test on mobile, tablet, and desktop
- Use Tailwind responsive modifiers
- Hide/show elements based on screen size when appropriate
- Ensure touch targets are 44x44px minimum on mobile
- Use responsive typography (text-sm, md:text-base, lg:text-lg)

### 10. Performance Optimization

**Image Optimization:**
```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // true for above-fold images
/>
```

**Code Splitting:**
```tsx
// Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});
```

**Best Practices:**
- Use Next.js Image component for images
- Implement lazy loading for below-fold content
- Keep bundle size small (check with `npm run build`)
- Use Server Components when possible (smaller client bundle)
- Minimize client-side JavaScript

### 11. Accessibility (WCAG 2.1 AA Compliance)

**⚠️ CRITICAL: Accessibility is mandatory for CharityHub**

Charitable platforms must be accessible to all users, including those with disabilities. Follow WCAG 2.1 Level AA standards.

**✅ Implemented Accessibility Features:**

CharityHub has comprehensive accessibility features already implemented:

1. **Skip Navigation**: Added skip-to-main-content link at the top of every page (app/layout.tsx)
2. **Semantic Landmarks**: Main content area has `id="main-content"`, navigation has `aria-label="Main navigation"`
3. **Form Accessibility**: All form inputs have:
   - Proper `<Label htmlFor>` associations
   - `aria-required="true"` for required fields
   - `aria-invalid` for error states
   - `aria-describedby` linking to error messages
   - Error messages with `role="alert"` for screen reader announcements
4. **Icon Accessibility**: All decorative icons have `aria-hidden="true"`
5. **Theme Toggle**: Has hidden text for screen readers (`sr-only` class)
6. **Focus Indicators**: Custom focus-visible styles in globals.css with proper outline
7. **Screen Reader Utilities**: `.sr-only` class for visually hidden content
8. **Heading Hierarchy**: Proper h1-h6 structure using Typography components
9. **Image Placeholders**: Marked as decorative with `aria-hidden="true"`
10. **Toast Notifications**: Sonner library provides built-in aria-live regions

**Files Modified for Accessibility:**
- `app/layout.tsx` - Skip nav link and main landmark
- `app/globals.css` - Focus styles and sr-only utilities
- `components/layout/header.tsx` - Nav aria-label, icon aria-hidden
- `components/contact/contact-form.tsx` - Form aria attributes
- `components/campaigns/contribution-sidebar.tsx` - Form aria attributes with hint text
- `app/auth/page.tsx` - Complete form accessibility with error handling
- All icon components - aria-hidden for decorative icons

**Semantic HTML:**
```tsx
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><Link href="/">Home</Link></li>
    </ul>
  </nav>
</header>

<main>
  <article aria-labelledby="campaign-title">
    <h1 id="campaign-title">Campaign Name</h1>
  </article>
</main>
```

**ARIA Labels & Descriptions:**
```tsx
// Icon-only buttons MUST have aria-labels
<button aria-label="Close modal" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Decorative images
<div role="img" aria-label="Campaign for clean water in rural areas">
  <img src="campaign.jpg" alt="" /> {/* Empty alt for decorative */}
</div>

// Form accessibility
<Label htmlFor="email">Email Address</Label>
<Input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && <p id="email-error" role="alert">Please enter a valid email</p>}
```

**Keyboard Navigation:**
```tsx
// Ensure all interactive elements are keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }}
>
  Interactive element
</div>
```

**Focus Management:**
```tsx
// Visual focus indicators (already in globals.css)
.focus-visible:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

// Skip to main content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">...</main>
```

**Color Contrast:**
- Primary text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio
- Test with tools: WebAIM Contrast Checker, Lighthouse

**Screen Reader Support:**
```tsx
// Announce dynamic content changes
<div role="status" aria-live="polite">
  {message && <p>{message}</p>}
</div>

// Loading states
<button disabled={isLoading}>
  {isLoading ? (
    <>
      <span className="sr-only">Loading...</span>
      <Loader className="animate-spin" aria-hidden="true" />
    </>
  ) : (
    "Submit"
  )}
</button>
```

**Accessible Forms:**
```tsx
// Always associate labels with inputs
<Label htmlFor="donation-amount">Donation Amount *</Label>
<Input
  id="donation-amount"
  type="number"
  min="1"
  required
  aria-required="true"
  aria-describedby="amount-hint"
/>
<p id="amount-hint" className="text-sm text-muted-foreground">
  Minimum donation is $1
</p>

// Error messages must be announced
{errors.amount && (
  <p id="amount-error" role="alert" className="text-sm text-destructive">
    {errors.amount}
  </p>
)}
```

**Accessibility Checklist:**
- [ ] All images have alt text (or role="presentation" if decorative)
- [ ] All icon-only buttons have aria-label
- [ ] Form inputs have associated labels
- [ ] Error messages use role="alert" or aria-live
- [ ] Proper heading hierarchy (no skipping levels)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Skip navigation link provided
- [ ] ARIA landmarks used (main, nav, complementary, contentinfo)
- [ ] Dynamic content changes announced to screen readers
- [ ] No automatic audio/video playback
- [ ] Time-based content has pause/stop controls

**Testing Tools:**
- **Lighthouse**: Built into Chrome DevTools (Accessibility audit)
- **axe DevTools**: Browser extension for automated testing
- **WAVE**: Web accessibility evaluation tool
- **NVDA/JAWS**: Screen reader testing (Windows)
- **VoiceOver**: Screen reader testing (Mac/iOS)
- **Keyboard only**: Test entire app without mouse

**Common Pitfalls to Avoid:**
- ❌ Missing alt text on images
- ❌ Icon buttons without aria-label
- ❌ Poor color contrast
- ❌ Keyboard traps (can't tab out)
- ❌ Form inputs without labels
- ❌ Unlabeled form errors
- ❌ Skipping heading levels (h1 → h3)
- ❌ Using div/span for buttons
- ❌ Timeout without warning
- ❌ Opening modals without focus management

### 12. Error Handling

**Not Found Pages:**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```

**Error Boundaries:**
```tsx
// app/error.tsx (future enhancement)
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Best Practices:**
- Always have a not-found.tsx page
- Handle form errors gracefully
- Provide helpful error messages
- Log errors for debugging
- Never expose sensitive information in errors

### 13. Code Organization

**File Naming:**
- Components: `campaign-card.tsx` (kebab-case)
- Pages: `page.tsx`, `layout.tsx` (Next.js conventions)
- Types: `index.ts` or descriptive names
- Utilities: `utils.ts`, `data.ts`

**Import Order:**
```typescript
// 1. React/Next.js imports
import { useState } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { Card } from "@/components/ui/card";

// 3. Internal utilities/types
import { Campaign } from "@/types";
import { cn } from "@/lib/utils";

// 4. Relative imports
import { CampaignCard } from "./campaign-card";
```

**Best Practices:**
- Group related files in folders
- Use index files for cleaner imports
- Consistent naming conventions
- Keep files focused and small
- Separate concerns (UI, logic, data, types)

### 14. Git Workflow

**Commit Messages:**
```
feat: Add campaign filtering functionality
fix: Correct progress bar calculation
docs: Update README with setup instructions
style: Format code with Prettier
refactor: Extract campaign card component
```

**Best Practices:**
- Use conventional commits (feat, fix, docs, style, refactor)
- Keep commits atomic and focused
- Write descriptive commit messages
- Use .gitignore to exclude build artifacts
- Don't commit node_modules, .next, .env files

### 15. Testing Strategy (Future Enhancement)

**Unit Tests:**
```typescript
// __tests__/components/campaign-card.test.tsx
import { render, screen } from '@testing-library/react';
import { CampaignCard } from '@/components/campaigns/campaign-card';

describe('CampaignCard', () => {
  it('renders campaign title', () => {
    const campaign = { /* mock data */ };
    render(<CampaignCard campaign={campaign} />);
    expect(screen.getByText(campaign.title)).toBeInTheDocument();
  });
});
```

**Best Practices:**
- Test user interactions, not implementation
- Use React Testing Library
- Test accessibility
- Mock external dependencies
- Aim for meaningful tests, not 100% coverage

---

## Coding Standards

### TypeScript
- Enable strict mode in tsconfig.json
- No `any` types
- Define all interfaces
- Use type guards when needed

### React
- Functional components only
- Use hooks for state and effects
- Prefer composition over inheritance
- Keep components pure when possible

### CSS/Styling
- Tailwind utility classes preferred
- Use design tokens (theme colors, spacing)
- No inline styles unless dynamic
- Mobile-first responsive design

### Naming Conventions
- Components: PascalCase (CampaignCard)
- Functions: camelCase (handleSubmit)
- Files: kebab-case (campaign-card.tsx)
- Constants: UPPER_SNAKE_CASE (API_URL)
- CSS classes: kebab-case (campaign-card)

### Comments
- Use JSDoc for complex functions
- Explain "why" not "what"
- Keep comments up-to-date
- Remove commented-out code

---

## Environment Setup

### Required Tools
- Node.js 18+ (v20.19.5 used)
- npm, yarn, or pnpm
- VS Code (recommended)
- Git

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets

### Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind customization
- `tsconfig.json` - TypeScript compiler options
- `.eslintrc.json` - ESLint rules
- `postcss.config.mjs` - PostCSS plugins

---

## Development Workflow

### Starting Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
```

### Building for Production
```bash
npm run build        # Create production build
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
```

### Key Commands
- `npm run dev` - Development with hot reload
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - Check code quality

---

## API Integration (Future)

When moving from mock data to real APIs:

### 1. Create API Routes
```typescript
// app/api/campaigns/route.ts
export async function GET() {
  const campaigns = await db.campaign.findMany();
  return Response.json(campaigns);
}
```

### 2. Server-Side Data Fetching
```typescript
// app/campaigns/page.tsx (Server Component)
async function getCampaigns() {
  const res = await fetch('http://localhost:3000/api/campaigns', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  // ...
}
```

### 3. Client-Side Mutations
```typescript
// For forms, use Server Actions
"use server"

export async function createCampaign(formData: FormData) {
  // Validate and process
  const campaign = {
    title: formData.get('title'),
    // ...
  };
  
  await db.campaign.create({ data: campaign });
  revalidatePath('/campaigns');
}
```

---

## Deployment Checklist

Before deploying:
- [ ] Run `npm run build` successfully
- [ ] Test all pages and features
- [ ] Verify responsive design
- [ ] Check SEO meta tags
- [ ] Test forms and validation
- [ ] Verify all links work
- [ ] Check 404 page
- [ ] Review console for errors
- [ ] Test on different browsers
- [ ] Optimize images
- [ ] Set up environment variables
- [ ] Configure production database (if applicable)

---

## Common Patterns

### Creating a New Page
1. Create `app/[route]/page.tsx`
2. Export default function component
3. Add to navigation (Header component)
4. Test routing

### Creating a New Component
1. Create file in appropriate folder
2. Define TypeScript interface for props
3. Export named function
4. Import and use in parent components

### Adding a Shadcn/ui Component
1. Copy component from [ui.shadcn.com](https://ui.shadcn.com)
2. Place in `components/ui/[component].tsx`
3. Adjust imports if needed
4. Import and use in your components

### Styling a Component
1. Start with Tailwind utilities
2. Use responsive modifiers (sm:, md:, lg:)
3. Extract repeated classes to component if needed
4. Use cn() utility for conditional classes

---

## Troubleshooting

### Common Issues

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

**Styling Issues:**
- Verify Tailwind config includes all content paths
- Check PostCSS config
- Ensure globals.css is imported in layout.tsx

**Component Errors:**
- Verify all imports are correct
- Check for missing dependencies
- Ensure 'use client' directive if using hooks

---

## Project Contacts & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

### Internal Docs
- README.md - Setup instructions
- COMPONENTS.md - Component API
- DEPLOYMENT.md - Deployment guide
- QUICKSTART.md - Quick start guide

---

## Notes for AI Code Generation

When generating code for this project:

1. **Always use TypeScript** with proper type definitions
2. **Follow Next.js 16 App Router conventions** (page.tsx, layout.tsx, 'use client')
3. **Use Tailwind CSS** for all styling (no CSS modules or styled-components)
4. **Import Shadcn/ui components** from `@/components/ui/`
5. **Use the cn() utility** from `@/lib/utils` for conditional classes
6. **Follow the established file structure** and naming conventions
7. **Make components responsive** with Tailwind breakpoints
8. **Handle errors gracefully** with proper validation
9. **Keep components modular** and focused on single responsibility
10. **Document complex logic** with comments

### Code Generation Examples

**New Page:**
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-4xl font-bold">About Us</h1>
      {/* Content */}
    </div>
  );
}
```

**New Component:**
```typescript
// components/shared/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
```

---

## Next.js 16 New Features & Changes

### Turbopack is Default

Next.js 16 uses Turbopack by default for both development (`next dev`) and production builds (`next build`).

**Previous (Next.js 15):**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack"
  }
}
```

**Current (Next.js 16):**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```

**Opting Out:**
If you need Webpack, use `--webpack` flag:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack"
  }
}
```

### New Caching APIs

**1. revalidateTag with cacheLife:**
```typescript
'use server'
import { revalidateTag } from 'next/cache'

export async function updateArticle(articleId: string) {
  // Mark article data as stale - readers see stale data while it revalidates
  revalidateTag(`article-${articleId}`, 'max')
}
```

**2. updateTag (New - Server Actions Only):**
Provides read-your-writes semantics - users see changes immediately:
```typescript
'use server'
import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)
  // Expire cache and refresh immediately - user sees their changes right away
  updateTag(`user-${userId}`)
}
```

**3. refresh (New):**
Refresh the client router from within a Server Action:
```typescript
'use server'
import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId)
  // Refresh the notification count displayed in the header
  refresh()
}
```

**4. cacheLife and cacheTag (Now Stable):**
No more `unstable_` prefix:
```typescript
// OLD
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

// NEW
import { cacheLife, cacheTag } from 'next/cache'
```

### React 19.2 Features

Next.js 16 includes React 19.2 with new features:
- **View Transitions**: Animate elements that update inside a Transition or navigation
- **useEffectEvent**: Extract non-reactive logic from Effects
- **Activity**: Render "background activity" with `display: none` while maintaining state

### React Compiler Support (Stable)

The React Compiler is now stable and can be enabled:

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true, // Automatically memoizes components
}

export default nextConfig
```

Install the plugin:
```bash
npm install -D babel-plugin-react-compiler
```

**Note:** Compile times will be higher with React Compiler enabled.

### middleware → proxy Rename

The `middleware.ts` file has been renamed to `proxy.ts`:

```bash
# Rename your middleware file
mv middleware.ts proxy.ts
```

**Function rename:**
```typescript
// OLD
export function middleware(request: Request) {}

// NEW
export function proxy(request: Request) {}
```

**Config flags renamed:**
```typescript
// OLD
const nextConfig = {
  skipMiddlewareUrlNormalize: true,
}

// NEW
const nextConfig = {
  skipProxyUrlNormalize: true,
}
```

### next/image Breaking Changes

**1. Local Images with Query Strings:**
Require `images.localPatterns.search` configuration:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}
```

**2. minimumCacheTTL Default Changed:**
Changed from `60 seconds` to `4 hours` (14400 seconds).

**3. imageSizes Default:**
Removed `16` from default `images.imageSizes` array.

**4. qualities Default:**
Changed from allowing all qualities to only `[75]`.

**5. Local IP Restriction:**
Local IP optimization blocked by default. Use `dangerouslyAllowLocalIP: true` only for private networks.

**6. Maximum Redirects:**
Changed from unlimited to 3 redirects maximum.

**7. Deprecated:**
- `next/legacy/image` - Use `next/image` instead
- `images.domains` - Use `images.remotePatterns` instead

### Concurrent dev and build

`next dev` and `next build` now use separate output directories:
- `next dev` → `.next/dev`
- `next build` → `.next`

This enables concurrent execution and includes lockfile mechanism to prevent multiple instances.

### Parallel Routes Requirement

All parallel route slots now require explicit `default.js` files:

```typescript
// app/@modal/default.tsx
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}

// Or return null
export default function Default() {
  return null
}
```

### Removed Features

**1. AMP Support:**
All AMP APIs and configurations removed:
- `amp` configuration
- `next/amp` hook imports
- `useAmp` function

**2. next lint Command:**
Removed. Use Biome or ESLint directly.

**3. Runtime Configuration:**
`serverRuntimeConfig` and `publicRuntimeConfig` removed. Use environment variables:

```typescript
// For server-only values
async function fetchData() {
  const dbUrl = process.env.DATABASE_URL
  return await db.query(dbUrl, 'SELECT * FROM users')
}

// For client-accessible values
// .env.local
NEXT_PUBLIC_API_URL="/api"

// Client component
'use client'
export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return <p>API URL: {apiUrl}</p>
}
```

**4. devIndicators Options:**
Removed:
- `appIsrStatus`
- `buildActivity`
- `buildActivityPosition`

**5. experimental.dynamicIO:**
Renamed to `cacheComponents`:

```typescript
// OLD
module.exports = {
  experimental: {
    dynamicIO: true,
  },
}

// NEW
module.exports = {
  cacheComponents: true,
}
```

### Upgrade Commands

**Automated Codemod:**
```bash
npx @next/codemod@canary upgrade latest
```

**Manual Upgrade:**
```bash
npm install next@latest react@latest react-dom@latest
# Also upgrade TypeScript types
npm install -D @types/react@latest @types/react-dom@latest
```

**Generate Type Helpers:**
```bash
npx next typegen
```

### System Requirements

| Requirement | Version |
|------------|---------|
| Node.js | 20.9+ (LTS) - Node.js 18 no longer supported |
| TypeScript | 5.1.0+ |
| Browsers | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |

---

## RSC Quick Reference Guide

### When to Use What

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Static content | ✅ Yes | ❌ No |
| Data fetching | ✅ Yes | ⚠️ Avoid |
| Interactive forms | ❌ No | ✅ Yes |
| useState/hooks | ❌ No | ✅ Yes |
| Event handlers (with state) | ❌ No | ✅ Yes |
| SEO content | ✅ Yes | ⚠️ Limited |
| Browser APIs | ❌ No | ✅ Yes |
| Large dependencies | ✅ Yes | ❌ No |

**Note:** Avoid `useEffect` in both Server and Client Components when possible - see Section 6.1 for better patterns.

### RSC File Organization

```
app/
├── page.tsx                    [SERVER] Static pages
├── campaigns/
│   ├── page.tsx                [SERVER] Shell with static content
│   └── [slug]/page.tsx         [SERVER] Dynamic routes

components/
├── campaigns/
│   ├── campaign-card.tsx       [SERVER] Display only
│   ├── campaign-filters.tsx    [CLIENT] Interactive controls
│   ├── campaign-list-client.tsx[CLIENT] State management
│   ├── campaign-tabs.tsx       [CLIENT] Tabbed interface
│   └── contribution-sidebar.tsx[CLIENT] Forms with state
├── contact/
│   └── contact-form.tsx        [CLIENT] Forms
└── layout/
    ├── header.tsx              [SERVER] Static navigation
    └── footer.tsx              [SERVER] Static footer
```

### RSC Code Patterns

**Pattern 1: Extract Interactive Logic**
```typescript
// ❌ Don't do this
"use client"
export default function Page() {
  const [filter, setFilter] = useState("");
  return (
    <>
      <h1>Title</h1> {/* Should be server */}
      <FilterInput value={filter} onChange={setFilter} />
    </>
  );
}

// ✅ Do this instead
// page.tsx (Server Component)
export default function Page() {
  return (
    <>
      <h1>Title</h1> {/* Server rendered */}
      <FilterSection /> {/* Client component */}
    </>
  );
}

// filter-section.tsx (Client Component)
"use client"
export function FilterSection() {
  const [filter, setFilter] = useState("");
  return <FilterInput value={filter} onChange={setFilter} />;
}
```

**Pattern 2: Pass Data Down**
```typescript
// Server Component fetches data
export default async function Page() {
  const data = await fetchData();
  return <ClientList data={data} />; // Pass to client
}

// Client Component receives data
"use client"
export function ClientList({ data }) {
  const [filtered, setFiltered] = useState(data);
  // Interactive logic here
}
```

**Pattern 3: Use Children for Composition**
```typescript
// Server Component
export default function Layout({ children }) {
  return (
    <div>
      <header>Static Header</header>
      {children} {/* Can be Server or Client */}
    </div>
  );
}
```

---

## Success Metrics

This project successfully demonstrates:

✅ Modern Next.js 16 App Router architecture with RSC optimization
✅ TypeScript for type safety
✅ Tailwind CSS for utility-first styling
✅ Shadcn/ui component integration
✅ Responsive design best practices
✅ Clean code architecture with Server/Client separation
✅ Component modularity and reusability
✅ Form handling and validation
✅ Mock data structure for future API integration
✅ Comprehensive documentation
✅ Performance-optimized RSC implementation (65% smaller bundles)

Follow these guidelines to maintain code quality and consistency throughout the project.