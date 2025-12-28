# Land Price App - System Architecture

**Version:** 1.0.0
**Last Updated:** 2025-12-28
**Phase:** Phase 1 - UI Foundation

## Architecture Overview

Land Price App is built on Next.js 14 with App Router architecture, following a component-driven, mobile-first design pattern with server-client boundary clearly defined.

```
┌─────────────────────────────────────────────────────┐
│         Browser / Client Environment                 │
├─────────────────────────────────────────────────────┤
│                  Next.js App Router                  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Pages (Server Components by default)        │   │
│  │  • app/layout.tsx    (Root)                  │   │
│  │  • app/page.tsx      (Redirect to /login)    │   │
│  │  • app/login/page.tsx (Client Component)     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  UI Components Library                       │   │
│  │  • Button (variants: primary, secondary...)  │   │
│  │  • Input (with icon support)                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Styling Layer                               │   │
│  │  • Tailwind CSS (utility-first)              │   │
│  │  • Custom CSS Animations (fadeInUp, etc)     │   │
│  │  • Design Tokens (colors, spacing, fonts)    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Build & Dev Tools                           │   │
│  │  • TypeScript (strict mode)                  │   │
│  │  • PostCSS + Autoprefixer                    │   │
│  │  • ESLint (code quality)                     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
          ↓ (No backend API in Phase 1)
┌─────────────────────────────────────────────────────┐
│  Future: Backend Services (Phase 5+)                │
│  • Authentication API                               │
│  • Property Data Service                            │
│  • Admin Dashboard API                              │
└─────────────────────────────────────────────────────┘
```

## Layer Structure

### 1. Page Layer (`app/`)

#### Root Layout (`layout.tsx`)
- Wraps entire application
- Loads Be Vietnam Pro font
- Configures viewport and metadata
- Sets theme color
- Language: Vietnamese (lang="vi")

**Server Component:** Renders on server, sends HTML to client

#### Home Page (`page.tsx`)
- Minimal page that redirects to `/login`
- Uses Next.js `redirect()` function
- Server-side redirect (no client-side lag)

#### Login Page (`app/login/page.tsx`)
- **Type:** Client Component (`'use client'`)
- **Responsibility:** User authentication UI
- **State Management:** Local state for password visibility
- **Features:**
  - Email/phone input with icon
  - Password input with toggle
  - Remember me checkbox
  - Forgot password link
  - Social login buttons
  - Animated background elements

### 2. Component Layer (`components/`)

#### Button Component (`components/ui/button.tsx`)
- **Type:** Presentational component (Client component when imported)
- **Props:**
  ```typescript
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'social'
    fullWidth?: boolean
  }
  ```
- **Variants:**
  - **primary:** Burgundy gradient with shadow, hover lift
  - **secondary:** Gold gradient for secondary actions
  - **outline:** Transparent with border, fills on hover
  - **social:** White with border, minimal styling
- **Styling:** Inline Tailwind classes, 56px min-height for touch targets

#### Input Component (`components/ui/input.tsx`)
- **Type:** Presentational component with ForwardRef
- **Props:**
  ```typescript
  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode
    rightElement?: ReactNode
  }
  ```
- **Features:**
  - Left icon support (password icons, phone icons, etc)
  - Right element support (visibility toggle, clear button)
  - Focus states with shadow ring
  - Placeholder styling
  - 56px min-height for touch
- **Styling:** Gray background, primary color focus state

### 3. Styling Layer

#### Global Styles (`app/globals.css`)
```css
@tailwind base;        /* Tailwind base styles */
@tailwind components;  /* Component classes */
@tailwind utilities;   /* Utility classes */

@layer utilities {
  /* Custom animations */
  @keyframes fadeIn { ... }
  @keyframes slideUp { ... }
  @keyframes float { ... }

  /* Animation utility classes */
  .animate-fade-in { ... }
  .animate-slide-up { ... }
  .animate-float { ... }
  .animate-float-reverse { ... }
}
```

#### Design Tokens (`tailwind.config.ts`)
- **Colors:** Primary, secondary, accent palette
- **Backgrounds:** Gradient definitions
- **Typography:** Font family extension (Be Vietnam Pro)
- **Border Radius:** Custom radius values
- **Spacing:** 8px-based scale
- **Box Shadows:** Button-specific shadows

#### Font System (`app/layout.tsx`)
```typescript
const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})
```

### 4. Build & Dev Tools

#### TypeScript Configuration (`tsconfig.json`)
- **Target:** ES2020
- **Strict Mode:** Enabled
- **Module Resolution:** Node
- **Path Aliases:** `@/*` for imports

#### Tailwind Configuration (`tailwind.config.ts`)
- **Content:** Scans app, components, pages directories
- **Theme:** Extended with custom tokens
- **Plugins:** None in Phase 1

#### PostCSS Configuration (`postcss.config.mjs`)
- Processes Tailwind CSS
- Autoprefixes vendor prefixes
- Minifies in production

#### ESLint Configuration (`.eslintrc.json`)
- Extends Next.js recommended rules
- Enforces code quality standards

## Data Flow

### Phase 1 (Current)

```
User Browser
    ↓
[Next.js Server]
    ↓
Root Layout (layout.tsx) - Server Component
    ↓
Page Router Decision
    ├─ "/" → Redirect to "/login"
    └─ "/login" → LoginPage (Client Component)

LoginPage (Client Component)
    ├─ Renders Button components
    ├─ Renders Input components
    ├─ Manages password visibility state
    └─ Form submission → console.log (TODO)
```

### Future Flow (Phase 5+)

```
LoginPage
    ↓
[Form Submission]
    ↓
Authentication API Endpoint
    ├─ Validate credentials
    ├─ Create session/JWT
    └─ Return user data
    ↓
[Redirect to Dashboard]
    ↓
App/dashboard/page.tsx
    ├─ Fetch user data
    ├─ Render user interface
    └─ Connect to property service
```

## Mobile-First Responsive Design

### Container Strategy
```html
<div class="mobile-container">
  <!-- Max-width: 428px -->
  <!-- Centers on larger screens -->
  <!-- Shadow for visual distinction -->
</div>
```

### Touch Target Standards
- **Minimum:** 44x44px
- **Button min-height:** 56px
- **Input min-height:** 56px
- **Padding:** Adequate spacing between interactive elements

### Viewport Configuration
```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,           // Prevent user zoom
  userScalable: false,       // Disable pinch zoom
  themeColor: '#AE1C3E',     // Address bar color
}
```

## Component Composition Pattern

### Example: Login Form
```tsx
<form onSubmit={handleLogin}>
  <Input
    icon={<PhoneIcon />}
    placeholder="Number or Email"
  />
  <Input
    type={showPassword ? 'text' : 'password'}
    icon={<LockIcon />}
    rightElement={<ToggleButton />}
  />
  <Button variant="primary" fullWidth>
    Login
  </Button>
</form>
```

## Performance Characteristics

### Font Loading
- Be Vietnam Pro loaded via Google Fonts
- Font display: `swap` (show fallback immediately)
- Vietnamese + Latin subsets only

### CSS Processing
- Tailwind CSS purges unused styles
- No external CSS files needed
- Inline styles generated per variant

### JavaScript Bundle
- Client components only in interactive areas
- Server components render on server
- Minimal JS needed for Phase 1

### Build Artifacts
- Static HTML from server components
- Hydrated interactive components
- CSS inlined in HTML

## Security Considerations (Phase 1)

- No sensitive data stored locally
- Password fields use HTML native input
- Form submission currently disabled (Phase 5)
- No API calls in Phase 1
- Content Security Policy ready (Phase 5)

## Accessibility Features

- Semantic HTML structure
- Form labels associated with inputs
- Keyboard navigation support
- Focus states clearly visible
- Icons as SVG with ARIA labels (future)
- Color contrast meets WCAG AA standards

## Development Workflow

### File Structure Organization
```
app/
  ├── layout.tsx          # Root server component
  ├── globals.css         # Global styles
  ├── page.tsx            # Home page
  └── login/
      └── page.tsx        # Login client component

components/
  └── ui/
      ├── button.tsx      # Reusable button
      └── input.tsx       # Reusable input
```

### Import Strategy
- Absolute imports using `@/` alias
- Components imported from `@/components/`
- Styles imported from `@/app/`

### Hot Module Replacement
- Fast Refresh enabled by default
- Changes reflect immediately in browser
- State preserved during edits

## Future Architecture Evolution

### Phase 2: Search & Results
- Dashboard page with search interface
- Results display component
- Price calculation logic

### Phase 3: Advanced Features
- Comparison tools
- Map integration
- PDF export functionality

### Phase 4: History & Bookmarks
- Local storage or IndexedDB for history
- Bookmark management UI

### Phase 5: Authentication
- Backend authentication service
- Session management middleware
- Protected routes

### Phase 6: Admin Dashboard
- Admin layout with sidebar
- Data management interface
- Analytics dashboard

## Dependencies & Versions

| Package | Version | Why |
|---------|---------|-----|
| next | ^14.2.18 | Latest stable with App Router |
| react | ^18.3.1 | Latest stable React |
| react-dom | ^18.3.1 | Latest stable ReactDOM |
| tailwindcss | ^3.4.17 | Latest utility CSS framework |
| typescript | ^5.7.2 | Type safety |
| postcss | ^8.4.49 | CSS preprocessing |
| autoprefixer | ^10.4.20 | Vendor prefix support |
| eslint | ^8.57.1 | Code linting |

## Monitoring & Debugging (Phase 1)

- ESLint for code quality
- TypeScript for type checking
- Browser DevTools for component inspection
- Console logging for form submissions
- Build-time error detection

## Scalability Notes

- Component library pattern allows easy expansion
- Design tokens centralized in Tailwind config
- Page-based routing scales with feature additions
- CSS-in-JS (via Tailwind) avoids specificity issues
- TypeScript prevents runtime errors
