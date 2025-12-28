# Agribank Tra Vinh - Land Price App Design Guidelines

## 1. Brand Identity

### 1.1 Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Burgundy | `#AE1C3E` | Main brand color (Agribank Red), CTAs, headers |
| Primary Dark | `#8B1631` | Hover states, emphasis, darker accents |
| Primary Light | `#C42D4F` | Accents, gradients, lighter tones |
| Secondary Beige | `#F0E5E7` | Light backgrounds, subtle accents |
| Accent Gold | `#D4AF37` | Special accents, badges, premium elements |

### 1.2 Gradient System

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(86.7deg, #AE1C3E 0.85%, rgba(174, 28, 62, 0.45) 98.94%);

/* Primary Solid Gradient */
--gradient-primary-solid: linear-gradient(135deg, #AE1C3E 0%, #C42D4F 50%, #D93D5F 100%);

/* Vibrant Gradient (Hero sections) */
--gradient-vibrant: linear-gradient(135deg, #AE1C3E 0%, #C42D4F 40%, #D4AF37 100%);

/* Gold Gradient (Secondary actions) */
--gradient-gold: linear-gradient(135deg, #D4AF37 0%, #E5C55A 100%);

/* Hero Gradient */
--gradient-hero: linear-gradient(160deg, #AE1C3E 0%, #C42D4F 40%, #8B1631 100%);

/* Dark Gradient (Admin sidebar) */
--gradient-dark: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%);
```

### 1.3 Typography

**Font Family:** Be Vietnam Pro (Google Fonts)
- Excellent Vietnamese character support
- Modern, clean, professional appearance

**Font Weights:**
- Light: 300 (subtle text)
- Regular: 400 (body text)
- Medium: 500 (labels, emphasis)
- Semibold: 600 (subheadings)
- Bold: 700 (headings, CTAs)

**Font Sizes:**
- xs: 0.75rem (12px) - captions, badges
- sm: 0.875rem (14px) - secondary text
- base: 1rem (16px) - body text
- lg: 1.125rem (18px) - section titles
- xl: 1.25rem (20px) - page subtitles
- 2xl: 1.5rem (24px) - section headings
- 3xl: 1.875rem (30px) - page titles
- 4xl: 2.25rem (36px) - hero headings

## 2. Spacing System

8px base unit with consistent scale:
- space-1: 4px
- space-2: 8px
- space-3: 12px
- space-4: 16px
- space-5: 20px
- space-6: 24px
- space-8: 32px
- space-10: 40px
- space-12: 48px

## 3. Component Design

### 3.1 Buttons

**Primary Button:**
- Background: gradient-primary
- Color: white
- Border-radius: 16px (radius-xl)
- Min-height: 48px (mobile touch target)
- Shadow: 0 4px 14px rgba(0, 132, 61, 0.3)
- Hover: translateY(-2px), stronger shadow

**Secondary Button:**
- Background: gradient-orange
- Similar specs to primary

**Outline Button:**
- Background: transparent
- Border: 2px solid primary
- Hover: fill with primary

### 3.2 Form Inputs

- Border: 2px solid gray-200
- Border-radius: 12px (radius-lg)
- Padding: 12px 16px (with icon: padding-left 48px)
- Min-height: 52px
- Focus: border-color primary, box-shadow focus ring

### 3.3 Cards

- Background: white
- Border-radius: 24px (radius-2xl)
- Shadow: 0 4px 20px rgba(0, 132, 61, 0.1)
- Hover: stronger shadow, subtle lift

### 3.4 Price Cards

- Border-left: 4px solid primary (indicator)
- Padding: 16px
- Highlight variant: full gradient background

## 4. Screen Layouts

### 4.1 Mobile Layout (Primary)
- Max-width: 428px (iPhone 14 Pro Max)
- Bottom navigation with 4 items
- Safe area padding for notch devices
- Sticky header with brand gradient

### 4.2 Admin Layout (Desktop)
- Fixed sidebar: 280px width
- Dark theme sidebar
- Light content area
- Top bar with search and notifications

## 5. Animation Guidelines

### 5.1 Transitions
- Fast: 150ms (micro-interactions)
- Normal: 200ms (standard transitions)
- Slow: 300ms (page transitions)

### 5.2 Animations
- fadeInUp: Entry animation for cards
- scaleIn: Entry for modals/results
- pulse: Subtle attention grabber

### 5.3 Reduced Motion
Always respect `prefers-reduced-motion` preference.

## 6. Accessibility

### 6.1 Color Contrast
- Text on background: minimum 4.5:1
- Large text: minimum 3:1
- All interactive elements have visible focus states

### 6.2 Touch Targets
- Minimum size: 44x44px
- Adequate spacing between targets

### 6.3 Vietnamese Language Support
- All fonts support full Vietnamese character set
- Text renders correctly with diacritical marks

## 7. Icon System

Using Heroicons (outline style, stroke-width: 2)
- Size in navigation: 24x24px
- Size in forms: 20x20px
- Size in buttons: 20-22px

## 8. File Structure

```
mockup/
├── css/
│   └── design-system.css    # Core design tokens and components
├── 01-login.html            # Login screen
├── 02-home-search.html      # Home/Search screen
├── 03-results.html          # Results with calculation
├── 04-history.html          # Search history
└── 05-admin-dashboard.html  # Admin dashboard
```

## 9. Design Decisions Rationale

### Why Agribank Burgundy Red?
- Official Agribank brand color (#AE1C3E)
- Conveys trust, professionalism, and authority
- Creates strong brand recognition and consistency
- Differentiates from green-themed competitors while maintaining sophistication

### Why Be Vietnam Pro Font?
- Designed specifically for Vietnamese language
- Clean, modern appearance
- Excellent readability at all sizes

### Why Card-Based Layout?
- Clear visual hierarchy
- Easy to scan information
- Familiar pattern for mobile users

### Why Bottom Navigation?
- Thumb-friendly on mobile devices
- Industry standard for mobile apps
- Easy access to main sections

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-28 | Initial design system and 5 screen mockups |
