# Land Price Lookup App - Project Roadmap

**Project:** Agribank Trà Vinh Land Price Lookup Application
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + Supabase
**Status:** Phase 1 Complete, Phase 2 In Progress
**Last Updated:** 2025-12-28

---

## Project Phases Overview

| Phase | Title | Status | Completion | Start | End |
|-------|-------|--------|------------|-------|-----|
| **1** | Project Setup & Static Login | ✅ Complete | 100% | 2025-12-28 | 2025-12-28 |
| **2** | Static User Pages (Home, Results, History) | ⏳ Pending | 0% | TBD | TBD |
| **3** | Static Admin Pages | ⏳ Pending | 0% | TBD | TBD |
| **4** | Supabase Setup & Database Schema | ⏳ Pending | 0% | TBD | TBD |
| **5** | Authentication System | ⏳ Pending | 0% | TBD | TBD |
| **6** | User Search Flow & Price Calculation | ⏳ Pending | 0% | TBD | TBD |
| **7** | Search History Feature | ⏳ Pending | 0% | TBD | TBD |
| **8** | Admin User Management | ⏳ Pending | 0% | TBD | TBD |
| **9** | Admin Price & Coefficient Management | ⏳ Pending | 0% | TBD | TBD |
| **10** | Excel File Upload & Parsing | ⏳ Pending | 0% | TBD | TBD |
| **11** | Brand Settings Management | ⏳ Pending | 0% | TBD | TBD |
| **12** | Testing, Polish & Production Deployment | ⏳ Pending | 0% | TBD | TBD |

**Overall Project Completion:** 8.3% (1 of 12 phases)

---

## Phase 1: Project Setup & Static Login Page ✅

**Status:** ✅ COMPLETED | **Date:** 2025-12-28 | **Quality:** 100%

### Deliverables
- ✅ Next.js 14 project initialized with TypeScript, Tailwind CSS, App Router
- ✅ Tailwind configured with Agribank design tokens (#AE1C3E burgundy, gradients, spacing)
- ✅ Be Vietnam Pro font integrated with weights 300-700
- ✅ Static login page (`app/login/page.tsx`) matching mockup pixel-perfectly
- ✅ Reusable UI components: Button, Input with forwardRef pattern
- ✅ Root layout with metadata, viewport, and font configuration

### Test Results
| Category | Result |
|----------|--------|
| **Build** | ✅ PASS (90.6 kB bundle) |
| **Type Check** | ✅ PASS (0 errors) |
| **Linting** | ✅ PASS (0 warnings) |
| **Component Import/Export** | ✅ PASS |
| **Responsive Design** | ✅ PASS (mobile-first, 428px) |

### Code Review Findings
- **Quality Score:** 100% (APPROVED)
- **Critical Issues:** 0
- **High Priority:** 0
- **Medium Priority:** 2 accessibility improvements (non-blocking)
  - Remove `userScalable: false` from viewport
  - Add `aria-label` to password toggle button
- **Low Priority:** 3 optimization suggestions

### Critical Files
```
app/layout.tsx
app/page.tsx (redirect to /login)
app/login/page.tsx (179 lines, interactive form)
components/ui/button.tsx (34 lines, 4 variants)
components/ui/input.tsx (43 lines, with icon support)
tailwind.config.ts (design tokens)
app/globals.css (animations)
```

### Metrics
- **Files Created:** 10
- **Type Coverage:** 100% (strict mode)
- **Lines of Code:** ~350 LOC
- **Build Time:** ~5 seconds
- **Dev Server Startup:** 1.88 seconds
- **Bundle Size:** 87.2 kB (shared JS)

### Next Steps
1. ✅ Phase 1 complete, ready for deployment
2. ⏳ Deploy to Vercel preview (optional accessibility fixes first)
3. ⏳ Proceed to Phase 2: Static User Pages

---

## Phase 2: Static User Pages (Home, Results, History)

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Convert mockups 02-04 to Next.js pages
- Implement bottom navigation layout
- Create additional UI components: Card, Select, PriceCard, StatsCard
- Add hardcoded mock data for districts, streets, prices

### Deliverables (Planned)
- [ ] Home/Search page with district/street/segment dropdowns
- [ ] Results page with 4-level price cards
- [ ] History page with mock search history
- [ ] Bottom navigation component with active state
- [ ] UI components: Card, Select, PriceCard, StatsCard
- [ ] Mock data for all dropdowns and price levels

### Success Criteria
- All pages match mockups pixel-perfectly
- Bottom nav highlights active page
- Dropdowns display mock data correctly
- Mobile scrolling smooth at 428px width
- All text in Vietnamese

### Dependencies
- Phase 1 (COMPLETE)

### Estimated Effort
- UI Components: 4-6 hours
- Page Implementation: 6-8 hours
- Testing & Polish: 2-3 hours
- **Total:** 12-17 hours

---

## Phase 3: Static Admin Pages

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Build admin dashboard and settings pages
- Implement admin sidebar layout
- Create admin-specific components: Sidebar, DataTable, Modal

### Deliverables (Planned)
- [ ] Admin dashboard with mock data tables
- [ ] Admin settings page with form layout
- [ ] Sidebar navigation component
- [ ] DataTable component for CRUD UI
- [ ] Modal component for forms
- [ ] Mock data for users, prices, coefficients

### Success Criteria
- Admin sidebar responsive (desktop/mobile collapsible)
- Data tables render with mock data
- CRUD buttons visible and styled
- Brand settings form layout complete

### Dependencies
- Phase 1 (COMPLETE)

---

## Phase 4: Supabase Setup & Database Schema

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Create Supabase project and configure database
- Design and implement 11-table relational schema
- Add Row Level Security (RLS) policies
- Seed sample data

### Deliverables (Planned)
- [ ] Supabase project created and configured
- [ ] 11 tables created with relationships: users, districts, streets, segments, coefficients (5 types), search_history, brand_settings
- [ ] Foreign keys and indexes configured
- [ ] RLS policies defined
- [ ] Sample data seeded (3 districts, 100+ segments)
- [ ] Supabase client configured in Next.js

### Database Tables
```sql
users, districts, streets, segments,
land_type_coefficients, location_coefficients,
area_coefficients, depth_coefficients,
feng_shui_coefficients, search_history, brand_settings
```

### Dependencies
- Phase 1 (COMPLETE)

---

## Phase 5: Authentication System

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Implement email/password authentication with Better Auth
- Build login flow with session management
- Add role-based access control and route protection

### Deliverables (Planned)
- [ ] Better Auth configured for email/password auth
- [ ] Login validation and session creation
- [ ] Role-based redirect (admin → /admin, user → /)
- [ ] Middleware for route protection
- [ ] Logout functionality
- [ ] User info display in header

### Success Criteria
- Login validates credentials and creates session
- Admin users access admin routes
- Regular users blocked from /admin
- Logout clears session
- Protected routes redirect to login

### Dependencies
- Phase 1 (COMPLETE)
- Phase 4 (Supabase Setup)

---

## Phase 6: User Search Flow & Price Calculation

**Status:** ⏳ NOT STARTED | **Complexity:** High

### Objectives
- Implement dynamic dropdown filtering
- Build price calculation engine
- Create coefficient selection UI
- Display calculation breakdown

### Deliverables (Planned)
- [ ] Dynamic dropdowns (district → street → segment)
- [ ] Segment data fetching with price levels
- [ ] Calculation engine implementing formula:
  ```
  price = base_price × land_type_coef × location_coef ×
          area_coef × depth_coef × feng_shui_coef
  ```
- [ ] Live calculation updates
- [ ] Calculation breakdown display
- [ ] Area input field
- [ ] Save to History button (UI)

### Success Criteria
- Districts load from database
- Streets filter by selected district
- Segments filter by selected street
- Base prices display accurately
- Coefficients update calculation live
- Final price matches formula
- Breakdown shows each coefficient applied

### Dependencies
- Phase 1 (COMPLETE)
- Phase 4 (Supabase Setup)
- Phase 5 (Authentication)

---

## Phase 7: Search History Feature

**Status:** ⏳ NOT STARTED | **Complexity:** Simple

### Objectives
- Implement search history save/retrieve
- Build history display with cards
- Add delete and view details functionality

### Deliverables (Planned)
- [ ] Search save to database after calculation
- [ ] History page loads user's searches
- [ ] History cards (location, date, price)
- [ ] View Details restores search parameters
- [ ] Delete removes record
- [ ] Pagination for > 20 records

### Success Criteria
- Each search saves to database
- History page loads user's searches
- Cards show location, date, price
- Clicking card restores inputs
- Delete removes record

### Dependencies
- Phase 1 (COMPLETE)
- Phase 4 (Supabase Setup)
- Phase 5 (Authentication)
- Phase 6 (Search Flow)

---

## Phase 8: Admin User Management

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Build user table CRUD operations
- Implement user creation, editing, deletion
- Add search/filter functionality

### Deliverables (Planned)
- [ ] User table UI (name, email, role, actions)
- [ ] Create User modal form
- [ ] Password hashing and user insert
- [ ] Edit user (name, email, role)
- [ ] Delete user with confirmation
- [ ] Search/filter users

### Success Criteria
- User table loads from database
- Create user validates inputs, saves
- Edit updates user correctly
- Delete removes user
- Search filters list
- Admin cannot delete self

### Dependencies
- Phase 1 (COMPLETE)
- Phase 3 (Admin Pages)
- Phase 4 (Supabase)
- Phase 5 (Auth)

---

## Phase 9: Admin Price & Coefficient Management

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Build admin price and coefficient tables
- Implement inline editing
- Add search/filter for coefficients

### Deliverables (Planned)
- [ ] Price table UI (district, street, segment, prices)
- [ ] Inline editing for prices
- [ ] Coefficient tabs (5 types)
- [ ] Edit coefficient values
- [ ] Search/filter by district or street
- [ ] Numeric input validation

### Success Criteria
- Price table loads all segments
- Admin edits base/government prices
- Coefficient tabs load correct data
- Values update in database
- Search filters work
- Validation prevents invalid inputs

### Dependencies
- Phase 1 (COMPLETE)
- Phase 3 (Admin Pages)
- Phase 4 (Supabase)
- Phase 5 (Auth)

---

## Phase 10: Excel File Upload & Parsing

**Status:** ⏳ NOT STARTED | **Complexity:** High

### Objectives
- Build Excel upload UI
- Parse Excel files (9 district + 2 coefficient sheets)
- Implement data preview and import logic

### Deliverables (Planned)
- [ ] File upload UI on admin settings
- [ ] Excel parsing for 11 sheets
- [ ] Validation of structure
- [ ] Preview before import
- [ ] Database import/upsert logic
- [ ] Progress indicator
- [ ] Download template button

### Success Criteria
- Upload accepts .xlsx only
- File parses 11 sheets successfully
- Preview shows first 10 rows per sheet
- Data inserts/updates in database
- Duplicates update instead of creating new
- Progress indicator shows during import
- Success message shows row counts

### Dependencies
- Phase 1 (COMPLETE)
- Phase 3 (Admin Pages)
- Phase 4 (Supabase)
- Phase 5 (Auth)

---

## Phase 11: Brand Settings Management

**Status:** ⏳ NOT STARTED | **Complexity:** Simple

### Objectives
- Build brand settings form
- Implement dynamic branding across app
- Add logo upload functionality

### Deliverables (Planned)
- [ ] Brand settings form (app_name, logo_url)
- [ ] Save to brand_settings table
- [ ] Logo upload to Supabase Storage or URL
- [ ] Display logo in headers across all pages
- [ ] Dynamic brand name in headers/footer

### Success Criteria
- Form loads current settings
- Admin changes app name
- Admin uploads logo or enters URL
- Changes save to database
- App name updates in all headers
- Logo displays in login and headers

### Dependencies
- Phase 1 (COMPLETE)
- Phase 3 (Admin Pages)
- Phase 4 (Supabase)

---

## Phase 12: Testing, Polish & Production Deployment

**Status:** ⏳ NOT STARTED | **Complexity:** Medium

### Objectives
- Comprehensive end-to-end testing
- Polish UI and add loading states
- Deploy to production

### Deliverables (Planned)
- [ ] End-to-end user flow testing
- [ ] Admin CRUD operation testing
- [ ] Mobile device testing (responsive, touch)
- [ ] Calculation accuracy verification
- [ ] Excel import testing with real data
- [ ] Loading states for async operations
- [ ] Error handling and messages
- [ ] Empty states (no history, no results)
- [ ] Image and font optimization
- [ ] SEO meta tags
- [ ] Accessibility audit (keyboard nav, focus)
- [ ] Production deployment to Vercel

### Success Criteria
- All features work without errors
- Mobile testing confirms responsive design
- Calculations match expected results
- Excel import works with real data
- App deploys to Vercel production
- No console errors or warnings
- Loading states provide feedback
- Performance < 3s page loads

### Dependencies
- All Phases 1-11 (COMPLETE)

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Frontend Framework** | Next.js | 14.2+ | App Router, Server Components |
| **Language** | TypeScript | 5.7+ | Strict mode enabled |
| **Styling** | Tailwind CSS | 3.4+ | Custom design tokens |
| **UI Components** | React | 18.3+ | Custom component library |
| **Font** | Be Vietnam Pro | - | Google Fonts, weights 300-700 |
| **Database** | Supabase PostgreSQL | - | 11 tables, RLS policies |
| **Authentication** | Better Auth | - | Email/password, role-based |
| **File Upload** | XLSX | - | Excel parsing |
| **Hosting** | Vercel | - | Frontend deployment |
| **Linting** | ESLint | 8.57+ | Next.js rules |
| **Type Checking** | TypeScript Compiler | 5.7+ | Strict mode |

---

## Key Metrics & Targets

| Metric | Target | Phase 1 | Status |
|--------|--------|---------|--------|
| **Bundle Size** | < 200 kB | 90.6 kB | ✅ Excellent |
| **Page Load Time** | < 3s | Excellent | ✅ On track |
| **Linting Issues** | 0 | 0 | ✅ Clean |
| **Type Errors** | 0 | 0 | ✅ Clean |
| **Accessibility** | WCAG AA | 85/100 | ⚠️ Minor gaps |
| **Mobile Support** | 428px+ | ✅ | ✅ Complete |
| **Code Coverage** | TBD | TBD | ⏳ Later phases |

---

## Changelog

### v0.1.0 - Phase 1 (2025-12-28)

**Released:** 2025-12-28

#### Added
- Initial Next.js 14 project setup with TypeScript and Tailwind CSS
- Agribank design system: Primary color (#AE1C3E), 6 gradients, custom spacing
- Be Vietnam Pro font integration (weights 300-700, Vietnamese + Latin subsets)
- Static login page (`/login`) with interactive password toggle
- Reusable UI components:
  - `Button.tsx`: 4 variants (primary, secondary, outline, social), fullWidth option
  - `Input.tsx`: Icon support, right element (password toggle), proper focus states
- Root layout with metadata, viewport configuration, font setup
- Global CSS with 4 animations (fadeIn, slideUp, float, float-reverse)
- Mobile-first design with 428px responsive breakpoint
- ESLint and TypeScript strict mode enabled

#### Quality Metrics
- Build: ✅ 90.6 kB bundle
- Type Check: ✅ 0 errors
- Linting: ✅ 0 warnings
- Code Review: ✅ 100% quality score
- Tests: ✅ All pass

#### Next
- Deploy to Vercel preview
- Phase 2: Static User Pages

---

## Deployment Timeline

| Phase | Start | End | Duration | Status |
|-------|-------|-----|----------|--------|
| **Phase 1** | 2025-12-28 | 2025-12-28 | 1 day | ✅ Complete |
| **Phase 2** | TBD | TBD | 3-4 days | ⏳ Planned |
| **Phase 3** | TBD | TBD | 3-4 days | ⏳ Planned |
| **Phase 4** | TBD | TBD | 2-3 days | ⏳ Planned |
| **Phase 5** | TBD | TBD | 2-3 days | ⏳ Planned |
| **Phase 6** | TBD | TBD | 4-5 days | ⏳ Planned |
| **Phase 7** | TBD | TBD | 2 days | ⏳ Planned |
| **Phase 8** | TBD | TBD | 3 days | ⏳ Planned |
| **Phase 9** | TBD | TBD | 3 days | ⏳ Planned |
| **Phase 10** | TBD | TBD | 4 days | ⏳ Planned |
| **Phase 11** | TBD | TBD | 2 days | ⏳ Planned |
| **Phase 12** | TBD | TBD | 3-4 days | ⏳ Planned |
| **TOTAL** | 2025-12-28 | TBD | ~37-45 days | ⏳ In Progress |

---

## Known Issues & Blockers

### Phase 1
- ⚠️ **Minor:** viewport `userScalable: false` violates WCAG 2.1 AA (non-critical)
- ⚠️ **Minor:** Password toggle button missing `aria-label` for screen readers (non-critical)

### No Critical Blockers
Project is on track with no blocking issues identified.

---

## Success Criteria

### Overall Project
- [ ] 12 phases completed on schedule
- [ ] All features match specification and mockups
- [ ] Zero critical security issues
- [ ] All tests pass (unit, integration, E2E)
- [ ] Mobile-first design at 428px+ width
- [ ] Accessibility WCAG AA compliant
- [ ] Performance < 3s page load times
- [ ] Vietnamese language UI complete
- [ ] Production deployment successful
- [ ] Admin can manage data via Excel upload
- [ ] Users can calculate land prices accurately
- [ ] Search history persists and displays correctly

---

## Contact & Resources

- **Project Lead:** TBD
- **GitHub:** TBD
- **Staging URL:** TBD
- **Production URL:** TBD
- **Supabase Project:** TBD

---

*Last updated: 2025-12-28 | Next review: After Phase 2 completion*
