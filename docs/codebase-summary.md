# Land Price App - Codebase Summary

**Version:** 1.0.0
**Last Updated:** 2025-12-28
**Status:** Phase 1 Complete

## Overview

Land Price App is a Next.js 14 application for property valuation queries in Trà Vinh province, Vietnam. Built with Agribank brand identity and optimized for mobile-first experience.

## Project Structure

```
landprice/
├── app/
│   ├── layout.tsx           # Root layout with Be Vietnam Pro font
│   ├── page.tsx             # Home redirect to /login
│   ├── globals.css          # Global styles and animations
│   └── login/
│       └── page.tsx         # Login page with Agribank branding
├── components/
│   └── ui/
│       ├── button.tsx       # Reusable button component (primary, secondary, outline, social)
│       └── input.tsx        # Input component with icon support
├── docs/
│   ├── codebase-summary.md          # This file
│   ├── project-overview-pdr.md      # Product overview and requirements
│   ├── code-standards.md            # Code standards and patterns
│   ├── system-architecture.md       # System architecture
│   └── design-guidelines.md         # Design tokens and guidelines
├── mockup/                   # Design mockups and HTML prototypes
│   ├── css/design-system.css
│   └── *.html               # 6 screen mockups
├── .claude/                 # Claude Code workflows and agents
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS with Agribank design tokens
├── tsconfig.json            # TypeScript configuration
├── postcss.config.mjs       # PostCSS configuration
├── package.json             # Project dependencies
└── .eslintrc.json           # ESLint rules

```

## Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.18 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.7.2 | Type safety |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Be Vietnam Pro | Google Fonts | Vietnamese-optimized typeface |

## Key Components

### Root Layout (`app/layout.tsx`)
- Loads Be Vietnam Pro font with Vietnamese support
- Sets metadata and viewport configuration
- Theme color: Agribank Burgundy (#AE1C3E)
- Supports Vietnamese language

### Login Page (`app/login/page.tsx`)
- Full-screen login interface with Agribank branding
- Email/phone and password input fields
- Password visibility toggle
- "Remember me" checkbox and forgot password link
- Social login buttons (Google, Facebook)
- Decorative animated background elements
- Client-side state management for password toggle

### UI Components

#### Button Component (`components/ui/button.tsx`)
- **Variants:** primary, secondary, outline, social
- **Props:** children, variant, fullWidth, className, ...HTMLAttributes
- **Styling:** Tailwind CSS with custom gradients
- **Hover Effects:** Lift animation with shadow enhancement
- **Min Height:** 56px (touch-friendly)

#### Input Component (`components/ui/input.tsx`)
- **Features:** Icon support, right element support, icon positioning
- **Styling:** 56px height, 12px border radius, focus states
- **Props:** icon, rightElement, ...HTMLAttributes
- **ForwardRef:** Compatible with form libraries
- **Focus State:** Primary color border with shadow ring

## Design System

### Color Palette
- **Primary Burgundy:** #AE1C3E (Agribank Red)
- **Primary Dark:** #8B1631 (hover states)
- **Primary Light:** #C42D4F (accents)
- **Secondary Beige:** #F0E5E7 (backgrounds)
- **Accent Gold:** #D4AF37 (premium elements)

### Gradients
- `gradient-primary`: Primary burgundy with fade
- `gradient-primary-solid`: Solid burgundy blend
- `gradient-vibrant`: Multi-color blend
- `gradient-gold`: Gold gradient for secondary actions
- `gradient-hero`: Hero section gradient
- `gradient-dark`: Dark gradient for admin UI

### Animations
- `fadeInUp`: 0.8s entry animation for cards
- `slideUp`: 0.6s entry animation for modals
- `float`: 8s floating animation for decorative elements
- `float-reverse`: 6s reverse floating animation

### Spacing System (8px base)
- space-1: 4px
- space-2: 8px
- space-3: 12px
- space-4: 16px
- space-5: 20px
- space-6: 24px
- space-8: 32px
- space-10: 40px
- space-12: 48px

## Typography

**Font:** Be Vietnam Pro (Google Fonts)
- Weights: 300, 400, 500, 600, 700
- Subsets: Vietnamese, Latin
- CSS Variable: `--font-be-vietnam-pro`

**Font Sizes:**
- xs: 12px (captions)
- sm: 14px (secondary text)
- base: 16px (body)
- lg: 18px (section titles)
- xl: 20px (subtitles)
- 2xl: 24px (headings)
- 3xl: 30px (page titles)
- 4xl: 36px (hero headings)

## Development Patterns

### Component Naming
- UI components: PascalCase in `components/ui/`
- Pages: lowercase in `app/[route]/`
- TypeScript interfaces: Descriptive names with Props suffix

### Styling Approach
- **Primary:** Tailwind CSS utility classes
- **Components:** Gradient backgrounds for buttons
- **Animations:** CSS keyframes in globals.css
- **Responsive:** Mobile-first, max-width 428px constraint

### State Management
- **Client Components:** `'use client'` directive for interactive features
- **Login Page:** useState for password visibility toggle
- **Future:** Phase 5 will implement authentication

### Form Handling
- HTML form elements with semantic structure
- Custom Input component with icon support
- Button variants for different form actions

## Dependencies Overview

### Production
- **next:** Next.js 14 framework
- **react:** React 18 library
- **react-dom:** React DOM library

### Development
- **TypeScript:** Type checking and development
- **Tailwind CSS:** Styling framework
- **PostCSS:** CSS preprocessing with autoprefixer
- **ESLint:** Code linting with Next.js config

## Configuration Files

### next.config.js
- Next.js App Router configuration
- Image optimization settings
- Build output configuration

### tailwind.config.ts
- Extended theme configuration
- Custom colors matching Agribank brand
- Custom border radius values
- Custom spacing tokens
- Custom box shadow for buttons

### tsconfig.json
- Strict mode enabled
- Path alias: `@/*` for absolute imports
- Target: ES2020
- Module: esnext

### postcss.config.mjs
- Tailwind CSS processing
- Autoprefixer for vendor prefixes

## Mobile-First Design

- **Max-width:** 428px (iPhone 14 Pro Max)
- **Touch Targets:** Minimum 44x44px
- **Spacing:** Adequate padding for thumb interaction
- **Container:** `.mobile-container` class with shadow

## Future Development Phases

- **Phase 2:** Search and property lookup
- **Phase 3:** Calculation and comparison tools
- **Phase 4:** History and bookmarks
- **Phase 5:** Authentication system
- **Phase 6:** Admin dashboard

## Performance Considerations

- Font display: `swap` (Be Vietnam Pro)
- Dynamic imports for code splitting (future)
- Image optimization (next/image)
- CSS purging via Tailwind
- Static generation where possible

## Notes for Developers

1. All interactive components use `'use client'` for client-side hydration
2. Form validation not yet implemented (Phase 5)
3. Authentication endpoints not connected (Phase 5)
4. Design system is comprehensive; reference `design-guidelines.md` for specifics
5. Component library pattern established for future expansion
