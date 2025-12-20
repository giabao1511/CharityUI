# CharityHub Project Instructions

This document outlines best practices and conventions for working on the CharityHub project.

## Table of Contents

- [Project Overview](#project-overview)
- [Internationalization (i18n)](#internationalization-i18n)
- [Code Organization](#code-organization)
- [Component Development](#component-development)
- [API Integration](#api-integration)
- [Styling Guidelines](#styling-guidelines)
- [Type Safety](#type-safety)

## Project Overview

CharityHub is a Next.js-based fundraising platform that connects donors with charitable campaigns and organizations. The project uses:

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **State Management**: React hooks and context

## Internationalization (i18n)

### Translation Files

All translations are stored in JSON files under the `messages/` directory:
- `messages/en.json` - English translations
- `messages/vi.json` - Vietnamese translations

### Translation Best Practices

1. **Always use translation keys** - Never hardcode user-facing text in components:
   ```tsx
   // ❌ Bad
   <h1>Campaigns</h1>

   // ✅ Good
   const t = await getTranslations("campaigns");
   <h1>{t("title")}</h1>
   ```

2. **Organize translations by feature** - Group related translations under feature namespaces:
   ```json
   {
     "campaigns": { ... },
     "organizations": { ... },
     "profile": { ... }
   }
   ```

3. **Use nested structures** - Organize complex features with nested objects:
   ```json
   {
     "campaigns": {
       "card": {
         "funded": "funded",
         "backers": "backers"
       },
       "detail": {
         "pledged": "pledged of"
       }
     }
   }
   ```

4. **Support dynamic values** - Use placeholders for dynamic content:
   ```json
   {
     "daysLeft": "{days} days left",
     "contributionSuccess": "Your contribution of {amount} has been received!"
   }
   ```

5. **Maintain translation parity** - Ensure both `en.json` and `vi.json` have the same structure and keys.

6. **Add translations BEFORE writing components** - When creating new features, add the translation keys first to both language files.

### Using Translations

**Server Components:**
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("campaigns");
  return <h1>{t("title")}</h1>;
}
```

**Client Components:**
```tsx
"use client";
import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("campaigns");
  return <h1>{t("title")}</h1>;
}
```

## Code Organization

### File Structure

```
app/[locale]/               # Internationalized routes
├── campaigns/              # Campaign-related pages
├── organizations/          # Organization-related pages
└── profile/                # User profile pages

components/                 # Reusable components
├── campaigns/              # Campaign-specific components
├── organizations/          # Organization-specific components
├── layout/                 # Layout components (header, footer)
└── ui/                     # Shared UI components (shadcn/ui)

lib/                        # Utility functions and services
├── adapters/               # Data transformation layers
├── services/               # API service functions
└── utils.ts                # General utilities

types/                      # TypeScript type definitions
├── campaign.ts
├── organization.ts
└── index.ts

messages/                   # i18n translation files
├── en.json
└── vi.json
```

### Component Organization

- **Page Components**: Located in `app/[locale]/`
- **Feature Components**: Located in `components/{feature}/`
- **Shared Components**: Located in `components/ui/`
- **Layout Components**: Located in `components/layout/`

## Component Development

### Component Guidelines

1. **Use TypeScript for all components** - Define proper interfaces for props:
   ```tsx
   interface CampaignCardProps {
     campaign: Fund;
   }

   export function CampaignCard({ campaign }: CampaignCardProps) {
     // ...
   }
   ```

2. **Mark client components explicitly** - Add `"use client"` directive when needed:
   ```tsx
   "use client";

   import { useState } from "react";

   export function InteractiveComponent() {
     const [state, setState] = useState();
     // ...
   }
   ```

3. **Use server components by default** - Only use client components when you need:
   - Browser APIs (localStorage, window, etc.)
   - React hooks (useState, useEffect, etc.)
   - Event handlers (onClick, onChange, etc.)

4. **Follow accessibility best practices**:
   - Use semantic HTML elements
   - Add ARIA labels where needed
   - Ensure keyboard navigation works
   - Provide proper alt text for images

5. **Use shadcn/ui components** - Leverage the existing UI component library:
   ```tsx
   import { Button } from "@/components/ui/button";
   import { Card } from "@/components/ui/card";
   ```

## API Integration

### Service Layer

All API calls should go through service functions in `lib/services/`:

```tsx
// lib/services/campaign.service.ts
export async function getCampaigns() {
  const response = await fetch(`${API_BASE_URL}/campaigns`);
  if (!response.ok) throw new Error("Failed to fetch campaigns");
  return response.json();
}
```

### Adapter Pattern

Use adapters to transform API responses to match the frontend types:

```tsx
// lib/adapters/campaign-adapter.ts
export function campaignToMockFormat(apiCampaign: ApiFund): Fund {
  return {
    id: apiCampaign.fundId,
    title: apiCampaign.fundName,
    // ... transform other fields
  };
}
```

### Error Handling

1. **Always handle errors gracefully**:
   ```tsx
   try {
     const data = await getCampaigns();
   } catch (err) {
     error = err instanceof Error ? err.message : "Unknown error";
     console.error("Error fetching campaigns:", err);
   }
   ```

2. **Provide fallback data** when appropriate:
   ```tsx
   try {
     campaigns = await getCampaigns();
   } catch (err) {
     // Fallback to mock data
     campaigns = mockCampaigns;
   }
   ```

3. **Display user-friendly error messages**:
   ```tsx
   {error && (
     <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
       <p className="font-semibold">⚠️ Connection Error</p>
       <p className="text-sm">{error}</p>
     </div>
   )}
   ```

## Styling Guidelines

### Tailwind CSS

1. **Use Tailwind utility classes** for styling:
   ```tsx
   <div className="flex items-center gap-4 p-6 rounded-lg bg-card">
   ```

2. **Follow responsive design patterns**:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   ```

3. **Use design tokens from theme**:
   ```tsx
   // Use theme colors
   className="bg-primary text-primary-foreground"

   // Use theme spacing
   className="p-4 gap-6 rounded-lg"
   ```

4. **Group related classes logically**:
   ```tsx
   // Layout, then spacing, then colors, then typography
   className="flex items-center gap-2 p-4 bg-card rounded-lg text-sm font-medium"
   ```

### Dark Mode

- Always consider dark mode when adding new components
- Use CSS variables for colors (already configured in the theme)
- Test components in both light and dark modes

## Type Safety

### Type Definitions

1. **Define types for all data structures** in `types/`:
   ```tsx
   // types/campaign.ts
   export interface Fund {
     id: string;
     title: string;
     goalAmount: number;
     currentAmount: number;
     // ...
   }
   ```

2. **Use readonly for props** when appropriate:
   ```tsx
   interface Props {
     readonly campaign: Fund;
     readonly onSelect?: (id: string) => void;
   }
   ```

3. **Avoid using `any`** - Use proper types or `unknown`:
   ```tsx
   // ❌ Bad
   const data: any = await fetch();

   // ✅ Good
   const data: Campaign = await getCampaign();
   ```

4. **Export types from index files** for easier imports:
   ```tsx
   // types/index.ts
   export * from "./campaign";
   export * from "./organization";
   ```

## Additional Best Practices

### Performance

1. **Use Next.js Image component** for images:
   ```tsx
   import Image from "next/image";

   <Image src={campaign.imageUrl} alt={campaign.title} width={800} height={600} />
   ```

2. **Implement proper loading states**:
   ```tsx
   {loading && <Skeleton />}
   {!loading && data && <Component data={data} />}
   ```

3. **Lazy load heavy components** when appropriate:
   ```tsx
   const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
     loading: () => <Skeleton />
   });
   ```

### Code Quality

1. **Write descriptive variable and function names**
2. **Keep functions small and focused** (single responsibility)
3. **Extract reusable logic into custom hooks**
4. **Add comments for complex logic only** (code should be self-documenting)

### Git Workflow

1. **Write clear commit messages** that describe what changed and why
2. **Keep commits focused** on a single change or feature
3. **Test changes** before committing
4. **Review code** before pushing to main branch

## Questions or Updates

If you have questions about these guidelines or suggestions for improvements, please:
1. Create an issue in the project repository
2. Discuss with the team
3. Update this document when new patterns emerge

---

**Last Updated**: 2025-11-16
