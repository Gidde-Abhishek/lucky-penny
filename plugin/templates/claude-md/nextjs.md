## Architecture
- /app/ — App Router pages and layouts
- /app/api/ — API route handlers
- /components/ — Reusable UI components
- /lib/ — Utility functions and shared logic
- /public/ — Static assets

## Code Conventions
- Use Server Components by default — only add 'use client' when needed (state, effects, browser APIs)
- Data fetching in Server Components, not client-side useEffect
- Use Next.js Image component for all images
- Use Next.js Link component for all internal navigation
- Environment variables: NEXT_PUBLIC_ prefix for client-side only

## Rules
- ALWAYS prefer Server Components over Client Components
- NEVER fetch data in Client Components if it can be done server-side
- ALWAYS use the App Router patterns (layout.tsx, page.tsx, loading.tsx, error.tsx)
- NEVER import server-only code in Client Components
- ALWAYS use next/image for images (automatic optimization)
- ALWAYS use next/link for internal links (prefetching)
- ALWAYS handle loading and error states with loading.tsx and error.tsx

## Common Pitfalls
- Adding 'use client' unnecessarily (breaks Server Component benefits)
- Using useEffect for data fetching instead of Server Components
- Importing large client libraries in Server Components
- Not using generateStaticParams for dynamic routes that can be pre-rendered
