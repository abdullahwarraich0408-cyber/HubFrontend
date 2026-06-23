# PharmaHub — Frontend Design Specification
### Multi-Vendor Online Pharmacy Marketplace
**Version 2.0 · Complete UI/UX Blueprint · June 2025**

> **Document Purpose:** This specification is the single source of truth for the PharmaHub frontend. It covers design system tokens, component library, all three portal layouts (Customer · Vendor · Admin), page-by-page wireframe intent, responsive behaviour, state handling, and technology stack. Hand this document directly to a frontend development team.

---

## Table of Contents

1. [Design Philosophy & Aesthetic Direction](#1-design-philosophy--aesthetic-direction)
2. [Design System](#2-design-system)
   - 2.1 [Colour Palette](#21-colour-palette)
   - 2.2 [Typography](#22-typography)
   - 2.3 [Spacing System](#23-spacing-system)
   - 2.4 [Border Radius](#24-border-radius)
   - 2.5 [Shadows & Elevation](#25-shadows--elevation)
   - 2.6 [Icon Library](#26-icon-library)
3. [Global Layout Structure](#3-global-layout-structure)
4. [Shared Components](#4-shared-components)
5. [Customer Portal — Page by Page](#5-customer-portal--page-by-page)
6. [Vendor Portal — Page by Page](#6-vendor-portal--page-by-page)
7. [Admin Portal — Page by Page](#7-admin-portal--page-by-page)
8. [Empty States & Error States](#8-empty-states--error-states)
9. [Notification System](#9-notification-system)
10. [Responsive / Mobile Design](#10-responsive--mobile-design)
11. [Loading & Skeleton States](#11-loading--skeleton-states)
12. [Animations & Motion](#12-animations--motion)
13. [Accessibility Standards](#13-accessibility-standards)
14. [Future-Proofing Notes](#14-future-proofing-notes)
15. [Technology Stack](#15-technology-stack)
16. [Tailwind CSS Configuration](#16-tailwind-css-configuration)

---

## 1. Design Philosophy & Aesthetic Direction

### Concept — *"Clinical Clarity meets Human Warmth"*

PharmaHub sits at the intersection of medical precision and consumer-grade accessibility. The interface rejects the cold, sterile feel common to most pharmacy websites. Every design decision communicates three qualities: **Trust**, **Clarity**, and **Care**.

### Aesthetic Pillars

| Pillar | Description | How it manifests |
|---|---|---|
| **Trustworthy** | Clean layouts, zero visual noise, strong hierarchy | Ample whitespace, consistent alignment, no decorative clutter |
| **Modern Medical** | Professional but never intimidating | Soft teal over harsh blue, rounded corners, approachable typography |
| **Accessible** | High contrast, legible, inclusive | WCAG AA throughout, large tap targets, clear error states |
| **Efficient** | Users reach their goal in 2 clicks or fewer | Persistent search, clear navigation, inline filtering |

### Portal Identity Summary

| Portal | Primary Users | Visual Tone |
|---|---|---|
| **Customer Portal** | Patients, caregivers, general public | Light, airy, warm — e-commerce feel |
| **Vendor Portal** | Pharmacy owners, product managers | Clean dashboard, teal accents, data-focused |
| **Admin Portal** | Platform administrators | Deep navy, gold accents, authority and control |

---

## 2. Design System

### 2.1 Colour Palette

The palette has been tuned for **WCAG AA contrast compliance** at all standard text sizes. All colour values are defined as CSS custom properties (see §16 for the Tailwind config).

#### Brand & Primary Colours

| Token | Hex Value | Tailwind Class | Usage |
|---|---|---|---|
| `--color-brand-primary` | `#0B6E72` | `brand-primary` | Main CTAs, links, interactive focus |
| `--color-brand-dark` | `#084F52` | `brand-dark` | CTA hover states, pressed states |
| `--color-brand-light` | `#E6F4F5` | `brand-light` | Hover backgrounds, chip fills, tinted panels |
| `--color-brand-mist` | `#F0F9FA` | `brand-mist` | Section tints, subtle card backgrounds |

> **Primary Teal rationale:** Shifted from `#0D7377` to `#0B6E72` for improved contrast ratio (4.8:1 on white). Slightly deeper, still medical without being corporate.

#### Surface & Background Colours

| Token | Hex Value | Usage |
|---|---|---|
| `--color-surface-base` | `#FFFFFF` | Page backgrounds, card surfaces |
| `--color-surface-subtle` | `#F6F8FA` | Section backgrounds, alternating rows |
| `--color-surface-raised` | `#FFFFFF` | Cards, dropdowns (pair with shadow) |
| `--color-surface-overlay` | `#F0F9FA` | Tinted panels, banner backgrounds |

#### Dark / Header Colours

| Token | Hex Value | Usage |
|---|---|---|
| `--color-ink-900` | `#0C1A2E` | Sidebar backgrounds, hero sections, footer |
| `--color-ink-800` | `#152845` | Admin portal secondary backgrounds |
| `--color-ink-headline` | `#0C1A2E` | Page headings, display text |

> **Navy rationale:** Shifted from `#0A1628` to `#0C1A2E` — warmer undertone, less harsh on screens.

#### Semantic / Status Colours

| Token | Hex Value | Tailwind Class | Usage |
|---|---|---|---|
| `--color-success` | `#0F9D58` | `status-success` | In-stock, completed, active status |
| `--color-success-surface` | `#DCFCE7` | — | Success badge background |
| `--color-success-text` | `#14532D` | — | Success badge text |
| `--color-warning` | `#D97706` | `status-warning` | Low stock, pending, caution |
| `--color-warning-surface` | `#FEF3C7` | — | Warning badge background |
| `--color-warning-text` | `#78350F` | — | Warning badge text |
| `--color-danger` | `#DC2626` | `status-danger` | Errors, out-of-stock, destructive actions |
| `--color-danger-surface` | `#FEE2E2` | — | Danger badge background |
| `--color-danger-text` | `#7F1D1D` | — | Danger badge text |
| `--color-info` | `#2563EB` | `status-info` | Informational badges, processing state |
| `--color-info-surface` | `#DBEAFE` | — | Info badge background |
| `--color-info-text` | `#1E3A8A` | — | Info badge text |

#### Accent Colours

| Token | Hex Value | Usage |
|---|---|---|
| `--color-accent-gold` | `#B8860B` | Admin portal highlights, premium badges |
| `--color-accent-gold-surface` | `#FEF9C3` | Gold badge background |

#### Neutral / Text Colours

| Token | Hex Value | Tailwind Class | Usage |
|---|---|---|---|
| `--color-neutral-900` | `#111827` | `text-base` | Primary body text |
| `--color-neutral-600` | `#4B5563` | `text-secondary` | Supporting text, descriptions |
| `--color-neutral-500` | `#6B7280` | `text-muted` | Placeholder text, secondary labels |
| `--color-neutral-300` | `#D1D5DB` | `border-default` | Borders, dividers |
| `--color-neutral-200` | `#E5E7EB` | `border-subtle` | Subtle row separators |
| `--color-neutral-100` | `#F7F8FA` | `bg-input` | Input field backgrounds |

---

### 2.2 Typography

**Design decision:** Two fonts only — one serif for authority and warmth on headlines, one geometric sans for all UI text. Monospace reserved exclusively for data/code contexts.

#### Font Stack

| Role | Font Family | Source | npm / Loader |
|---|---|---|---|
| **Display & Headings** | DM Serif Display | Google Fonts | `next/font/google` |
| **UI / Body Text** | Plus Jakarta Sans | Google Fonts | `next/font/google` |
| **Data / Code** | JetBrains Mono | Google Fonts | `next/font/google` |

> **Self-hosting via `next/font/google`:** All three fonts are automatically self-hosted by Next.js — no external `<link>` tag, zero layout shift, GDPR-safe. Do **not** use a `<link>` to fonts.googleapis.com.

#### Type Scale

| Token | Size | Weight | Font | Line Height | Usage |
|---|---|---|---|---|---|
| `text-display` | 52px | 700 | DM Serif Display | 1.1 | Hero headlines |
| `text-h1` | 36px | 700 | DM Serif Display | 1.15 | Page titles |
| `text-h2` | 28px | 600 | Plus Jakarta Sans | 1.25 | Section headings |
| `text-h3` | 22px | 600 | Plus Jakarta Sans | 1.3 | Card/panel headers |
| `text-h4` | 18px | 600 | Plus Jakarta Sans | 1.4 | Sub-section labels |
| `text-body-lg` | 16px | 400 | Plus Jakarta Sans | 1.6 | Lead paragraphs |
| `text-body` | 14px | 400 | Plus Jakarta Sans | 1.6 | Standard body copy |
| `text-small` | 12px | 400 | Plus Jakarta Sans | 1.5 | Captions, meta |
| `text-label` | 11px | 600 | Plus Jakarta Sans | 1 | UPPERCASE · LS 0.08em |
| `text-code` | 13px | 400 | JetBrains Mono | 1.5 | Order IDs, TXN codes |

---

### 2.3 Spacing System

**Base unit: 4px.** All spacing values are multiples of 4 for pixel-perfect alignment on any screen density.

| Token | Value | Tailwind | Common Use |
|---|---|---|---|
| `space-1` | 4px | `p-1` / `m-1` | Icon internal padding, micro gaps |
| `space-2` | 8px | `p-2` / `m-2` | Inline element gaps |
| `space-3` | 12px | `p-3` / `m-3` | Compact component inner padding |
| `space-4` | 16px | `p-4` / `m-4` | Standard component padding |
| `space-6` | 24px | `p-6` / `m-6` | Card padding, section gaps |
| `space-8` | 32px | `p-8` / `m-8` | Section vertical spacing |
| `space-12` | 48px | `p-12` / `m-12` | Large section breaks |
| `space-16` | 64px | `p-16` / `m-16` | Hero vertical padding |
| `space-24` | 96px | `p-24` / `m-24` | Full-page section separation |

---

### 2.4 Border Radius

| Token | Value | Tailwind | Applied To |
|---|---|---|---|
| `radius-sm` | 6px | `rounded` | Small chips, compact badges |
| `radius-md` | 8px | `rounded-lg` | Buttons, input fields, small cards |
| `radius-lg` | 12px | `rounded-xl` | Cards, table containers, panels |
| `radius-xl` | 16px | `rounded-2xl` | Modals, large drawers |
| `radius-pill` | 9999px | `rounded-full` | Badges, pill tags, customer search bar |
| `radius-circle` | 50% | `rounded-full` | Avatars, icon buttons |

---

### 2.5 Shadows & Elevation

Elevation is communicated through shadow only — no background colour changes on cards.

| Token | CSS Value | Usage |
|---|---|---|
| `shadow-card` | `0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.06)` | Default card rest state |
| `shadow-card-hover` | `0 4px 16px rgba(11,110,114,0.14), 0 1px 4px rgba(0,0,0,0.06)` | Card on hover (teal-tinted) |
| `shadow-dropdown` | `0 4px 20px rgba(0,0,0,0.10)` | Dropdown menus, popovers |
| `shadow-modal` | `0 24px 64px rgba(0,0,0,0.20)` | Modal dialogs |
| `shadow-navbar` | `0 1px 0 rgba(0,0,0,0.08)` | Sticky top navigation |
| `shadow-focus` | `0 0 0 3px rgba(11,110,114,0.20)` | Keyboard focus rings (teal) |

---

### 2.6 Icon Library

**Primary:** [Phosphor Icons](https://phosphoricons.com/)
- **Package:** `@phosphor-icons/react` (v2.x)
- **Install:** `npm install @phosphor-icons/react`
- **Weight used:** `regular` for navigation/UI, `bold` for emphasis, `fill` for active/selected states
- **Default size:** 20px for navigation, 16px for inline text, 24px for empty states, 32px for KPI cards

**Why Phosphor?** Consistent stroke weight system across 1,000+ icons, native medical/pharmaceutical icons (Pill, Flask, FirstAid, Stethoscope, Heartbeat, SyringeSimple, Package), and official React package with tree-shaking.

**Example usage:**
```tsx
import { Pill, Package, ChartLine } from '@phosphor-icons/react';

<Pill size={20} weight="regular" />
<Package size={20} weight="bold" />
<ChartLine size={24} weight="fill" color="var(--color-brand-primary)" />
```

---

## 3. Global Layout Structure

### 3.1 Breakpoints

Aligned with Tailwind CSS v3 default breakpoints:

| Name | Range | Tailwind Prefix | Notes |
|---|---|---|---|
| `xs` (mobile) | 0 – 639px | (default) | Single-column, bottom tab nav |
| `sm` | 640px – 767px | `sm:` | Two-column grids emerge |
| `md` | 768px – 1023px | `md:` | Tablet, sidebar collapses |
| `lg` | 1024px – 1279px | `lg:` | Desktop, full sidebar visible |
| `xl` | 1280px – 1535px | `xl:` | Wide desktop, content max-width caps |
| `2xl` | 1536px+ | `2xl:` | Ultra-wide, outer margins grow |

**Content max-width:** `1280px` centred with auto horizontal margins on `2xl` screens.

---

### 3.2 Grid System

| Context | Columns | Gutter | Outer Margin |
|---|---|---|---|
| Desktop (`lg+`) | 12 columns | 24px | 80px |
| Tablet (`md`) | 8 columns | 16px | 32px |
| Mobile (`sm` and below) | 4 columns | 16px | 16px |

---

### 3.3 Three Portal Layouts

Each user role has its own layout shell and visual identity. Portals are separated by route prefix.

#### Customer Portal — `/`
```
Route prefix:  / (public) | /account (authenticated)
Layout:        Full-width page with sticky top navbar
Nav type:      Top navbar (64px) + secondary category bar (48px)
Max-width:     1280px centred
Auth guard:    Cart/checkout/account routes require login
```

#### Vendor Portal — `/vendor`
```
Route prefix:  /vendor
Layout:        Fixed left sidebar + scrollable main content
Sidebar:       260px expanded | 72px icon-only collapsed
Auth guard:    All routes require vendor role
Visual tone:   Neutral white + teal accents
```

#### Admin Portal — `/admin`
```
Route prefix:  /admin
Layout:        Fixed left sidebar + scrollable main content
Sidebar:       260px expanded | 72px icon-only collapsed
Auth guard:    All routes require admin role
Visual tone:   Deep navy sidebar + gold accent highlights
```

---

## 4. Shared Components

### 4.1 Button System

#### Variants

| Variant | Background | Text | Border | Use Case |
|---|---|---|---|---|
| **Primary** | `#0B6E72` | White | None | Main CTA: Add to Cart, Submit, Publish |
| **Secondary** | Transparent | `#0B6E72` | `1.5px #0B6E72` | Secondary actions: Edit, Export |
| **Danger** | `#DC2626` | White | None | Destructive: Delete, Deactivate |
| **Ghost** | Transparent | `#6B7280` | None | Dismiss: Cancel, Close |
| **Icon** | `#F6F8FA` | — | None | Toolbar actions: filter, sort, close |

#### Sizes

| Size | Height | Padding (H) | Font Size |
|---|---|---|---|
| `btn-sm` | 36px | 12px | 13px |
| `btn-md` | 44px | 20px | 14px (default) |
| `btn-lg` | 52px | 28px | 15px |

#### States
```
Default  → as specified above
Hover    → Primary: darken 8% (color-brand-dark) + scale(1.01)
           Secondary: background brand-mist
           Danger: darken 8%
Active   → scale(0.98), remove hover shadow
Focus    → shadow-focus ring (3px teal, 2px offset)
Disabled → opacity 0.45, cursor not-allowed, no interaction
Loading  → Label replaced by 3 animated dots (stagger bounce),
           pointer-events: none
```

---

### 4.2 Form Components

#### Text Input
```
Height:           44px
Background:       #F7F8FA  (var --color-neutral-100)
Border:           1.5px solid #D1D5DB
Border-radius:    8px
Padding:          0 16px
Label:            Floating label pattern (animates above field on focus/filled)

States:
  Focus  → border: #0B6E72, box-shadow: shadow-focus
  Error  → border: #DC2626, helper text in red below
  Success→ border: #0F9D58, checkmark icon on right (optional)
  Disabled → opacity 0.6, background #F0F0F0, cursor not-allowed
```

#### Select / Dropdown
```
Same dimensions as Text Input
Custom caret: Phosphor <CaretDown> (16px, gray-500)
Opens: styled ul list, each option 40px tall
  Option hover: background brand-mist
  Option selected: brand-mist + left teal tick icon
```

#### Textarea
```
Min-height:   120px
Max-height:   320px (overflow-y: auto)
Resize:       vertical only
Styling:      same as Text Input
```

#### Checkboxes & Radio Buttons
```
Checkbox:
  Size: 18×18px | Border-radius: 4px
  Unchecked: border 1.5px #D1D5DB, white fill
  Checked:   background #0B6E72, white Phosphor <Check> (12px bold) centered
  Intermediate: background #0B6E72, white minus bar

Radio:
  Size: 18×18px | Border-radius: 50%
  Unchecked: border 1.5px #D1D5DB
  Checked:   outer ring #0B6E72 (2px), inner teal dot (8px)
```

#### Search Input
```
Customer-facing (hero / navbar):
  Border-radius: 9999px (pill)
  Left icon:     Phosphor <MagnifyingGlass> (20px, gray-500)
  Right:         Phosphor <X> clear button — appears only when value present
  Right (optional): mic icon for voice search
  Height: 48px (hero) | 44px (navbar)

Admin/Vendor filter search:
  Border-radius: 8px (square)
  Same icon placement
  Height: 40px (compact)
```

#### File Upload
```
Container:
  Border: 2px dashed #D1D5DB | Border-radius: 12px | Padding: 32px
  Center content:
    Phosphor <CloudArrowUp> (40px, gray-400)
    Primary text: "Drag & drop files here" (14px 600)
    Secondary: "or click to browse" (14px, teal link)
    Caption: "JPG, PNG up to 5MB" (12px, gray-500)

Hover state:
  Border-color: #0B6E72 | Background: brand-mist | Icon turns teal

Uploaded state:
  Thumbnail grid (3 columns)
  Each thumbnail: 80×80px with ×remove overlay on hover
  First image labeled "Main" with a teal banner tag
  Drag-to-reorder enabled (Framer Motion drag)
```

#### Price Range Slider
```
Two-handle range slider
Track fill (between handles): #0B6E72
Track empty: #D1D5DB
Handles: 20px circle, white fill, 2px teal border, shadow-card
Values displayed as text tags below each handle
```

#### Password Strength Meter
```
Four segment bar below password input:
  Weak (1/4):    All segments #FEE2E2 (red tint), label "Weak"
  Fair (2/4):    2 segments #FEF3C7 (amber), label "Fair"  
  Good (3/4):    3 segments brand-light (teal), label "Good"
  Strong (4/4):  4 segments #DCFCE7 (green), label "Strong"
Animation: segments fill left-to-right with 200ms ease transition
```

---

### 4.3 Card Components

#### Product Card — Customer View

```
Dimensions:   Fills grid column (min 200px, max 300px)
Border-radius: 12px | Shadow: shadow-card | Hover: shadow-card-hover + translateY(-2px)
Transition:    200ms ease

Structure:

┌─────────────────────────────┐
│ [Category Badge]            │  ← Pill, top-left, teal
│                             │
│       Product Image         │  ← 16:9 or square, object-fit cover
│    (Out of Stock overlay)   │  ← Semi-black overlay + white centered text
│                             │
│  [♡ Wishlist]               │  ← Absolute top-right, 32px icon button
├─────────────────────────────┤
│ VENDOR NAME                 │  ← 11px UPPERCASE, gray-500
│ Product Name  (2 lines max) │  ← 15px 600, clamp(2 lines)
│ Formula / Generic name      │  ← 12px italic, gray-500
│                             │
│ ● In Stock · 48 units       │  ← Green dot + text (amber/red variants)
│                             │
│ PKR 1,850                   │  ← 18px 700, brand-primary
├─────────────────────────────┤
│  [    Add to Cart    ]      │  ← Full-width primary button
└─────────────────────────────┘
```

#### KPI / Stats Card — Admin & Vendor Dashboards

```
Background: White | Border: 1px solid #E5E7EB | Border-radius: 12px
Padding: 24px

Structure:
  Top-left:  Icon in 44×44px rounded square (color varies by metric)
  Top-right: Trend indicator (Phosphor arrow icon + % change, green/red)
  Middle:    Metric value (32px, DM Serif Display, ink-headline)
  Bottom:    Label (12px UPPERCASE, gray-500)
```

#### Vendor Product Card — Management List View

```
Horizontal layout | Border-bottom: 1px solid #E5E7EB | Padding: 16px

Left:   Product thumbnail (72×72px, border-radius 8px)
Center: Product name (14px 600) | SKU (12px mono, gray-500)
        Category badge | Stock indicator
Right:  Price (16px 600, teal) | Status badge
        Actions: [Edit icon] [Delete icon]
```

---

### 4.4 Navigation Components

#### Top Navbar — Customer Portal

```
Height: 64px | Background: White | Shadow: shadow-navbar | Position: sticky top-0 z-50

Left section:
  Logo: Phosphor <FirstAidKit> icon (teal, 28px) + "PharmaHub" in DM Serif Display 22px

Center section (desktop only):
  Pill search bar, 480px wide max
  Left icon: MagnifyingGlass (teal)
  Placeholder: "Search medicines, brands, categories..."
  Right: optional Microphone icon

Right section (desktop):
  [Location pin] City name → click to change (dropdown)
  [Bell] Notification badge (red dot + count)
  [User avatar] Name or "Sign In" button
  [Cart] Item count badge (teal circle, white number)

Mobile (< 768px):
  Row 1: Logo | [Cart icon] [Hamburger icon]
  Row 2: Full-width search bar (no pill radius, 8px radius)
```

#### Secondary Category Bar — Customer Portal

```
Height: 48px | Background: #0C1A2E | Text: White
Scrollable horizontal with hidden scrollbar

Categories:
  Medicines | Prescription | Health Devices | Vitamins |
  Herbal | Personal Care | Baby Care | Offers

Each item: 14px, 16px horizontal padding
Hover: text becomes teal-300, underline
Active: bottom 2px teal border, slightly brighter text
```

#### Sidebar — Vendor & Admin Portals

```
Width: 260px expanded | 72px collapsed
Background: #0C1A2E (Vendor) | #0C1A2E with gold accent (Admin)
Position: fixed, left-0, top-0, full height, z-40
Transition: width 250ms ease (Framer Motion layout animation)

Top section:
  Full logo when expanded | Icon-only when collapsed
  Toggle button (Phosphor <ArrowLineLeft> / <ArrowLineRight>)

Nav item anatomy:
  Height: 44px | Padding: 0 12px | Border-radius: 8px (inside sidebar)
  Icon (20px) + Label text (14px 500)
  Active:   Left 3px teal border + background rgba(11,110,114,0.18) + teal icon
  Hover:    Background rgba(255,255,255,0.06)
  Collapsed: Icon centered, tooltip on hover (right side)

Bottom section:
  User avatar (40px circle) + name + role chip
  Settings link | Logout button

--- VENDOR SIDEBAR ITEMS ---
  Dashboard          (Phosphor: SquaresFour)
  My Products        (Phosphor: Pill)
  Add Product        (Phosphor: PlusCircle)
  Orders             (Phosphor: Package)
  Sales Report       (Phosphor: ChartLineUp)
  Account Settings   (Phosphor: Gear)

--- ADMIN SIDEBAR ITEMS ---
  Dashboard          (Phosphor: SquaresFour)
  Vendors            (Phosphor: Storefront)
  Customers          (Phosphor: Users)
  All Products       (Phosphor: Pills)
  All Orders         (Phosphor: ListBullets)
  Transactions       (Phosphor: CreditCard)
  Reports            (Phosphor: ChartBar)
  Audit Log          (Phosphor: ClockCounterClockwise)
  Settings           (Phosphor: Gear)
```

---

### 4.5 Status Badges

All badges: pill shape (`border-radius: 9999px`) | `11px` | `600 weight` | `UPPERCASE` | `6px 12px` padding

| Status | Background | Text Colour | Phosphor Icon (optional) |
|---|---|---|---|
| Active / In Stock | `#DCFCE7` | `#14532D` | `CheckCircle` (fill) |
| Inactive / Deactivated | `#FEE2E2` | `#7F1D1D` | `XCircle` (fill) |
| Pending | `#FEF3C7` | `#78350F` | `Clock` |
| Low Stock | `#FEF3C7` | `#78350F` | `Warning` |
| Out of Stock | `#FEE2E2` | `#7F1D1D` | `MinusCircle` |
| Processing | `#DBEAFE` | `#1E3A8A` | `ArrowsClockwise` |
| Shipped | `#EDE9FE` | `#4C1D95` | `Package` |
| Delivered | `#DCFCE7` | `#14532D` | `CheckCircle` (fill) |
| Cancelled | `#F3F4F6` | `#374151` | `X` |
| Premium | `#FEF9C3` | `#713F12` | `Star` (fill, gold) |

---

### 4.6 Data Tables — Admin & Vendor

```
Container:    White card, border-radius 12px, shadow-card
Header row:   Background #F6F8FA | 12px UPPERCASE | gray-500 | 600 weight | height 48px
Body rows:    Height 56px | bottom border 1px #E5E7EB
Row hover:    Background #F6F8FA
Selected row: Background brand-mist + left teal accent 2px

Columns:
  [□] Checkbox column (left, 40px)
  Content columns (flexible)
  [⋮] Actions column (right, 120px): view / edit / delete icon buttons

Sorting:
  Sortable column headers: show <ArrowsDownUp> icon on hover
  Active sort: teal icon + bold header text + direction caret

Bulk action bar (appears when ≥1 row selected):
  Floats above table bottom | White background | shadow-dropdown
  "X items selected" | [Delete Selected] [Change Status ▾] [Export]

Pagination:
  Position: below table, flex row
  Left: "Showing 1–20 of 143 results" (14px gray-500)
  Right: [← Prev] [1] [2] [3] … [7] [Next →]
  Rows per page selector: "20 per page ▾"
```

---

### 4.7 Modal Dialogs

```
Backdrop: rgba(12,26,46,0.55) | blur(2px)
Position: fixed inset-0 flex items-center justify-center z-50
Animation (Framer Motion): fade in (200ms) + scale 0.95→1 (150ms ease-out)
Close on backdrop click: Yes (except confirmation modals)

Modal widths:
  sm  (confirmation):  400px max
  md  (forms):         560px max
  lg  (product detail):800px max

Structure:
  ┌───────────────────────────────────┐
  │ Title (H3)              [× Close] │  ← Header (56px)
  ├───────────────────────────────────┤  ← 1px divider
  │                                   │
  │   Content area                    │  ← Scrollable if tall (max-h: 70vh)
  │                                   │
  ├───────────────────────────────────┤  ← 1px divider
  │           [Cancel]  [Confirm CTA] │  ← Footer, right-aligned buttons
  └───────────────────────────────────┘

Confirmation modal variant:
  Centered icon (large, 48px, red for destructive / amber for warning)
  Title + description text (centered)
  Two buttons: [Cancel (ghost)] [Action (danger)]
```

---

### 4.8 Toast Notifications

Powered by **Sonner** (`sonner` package — see §15).

```
Position: top-right | Stacks downward | z-index: 9999
Width: 360px | Border-radius: 12px | Padding: 14px 16px
Shadow: shadow-modal

Types:
  Success: #0F9D58 left border (3px) + Phosphor <CheckCircle> (green)
  Error:   #DC2626 left border    + Phosphor <XCircle> (red)
  Warning: #D97706 left border    + Phosphor <Warning> (amber)
  Info:    #0B6E72 left border    + Phosphor <Info> (teal)

Structure per toast:
  [Icon 20px] | [Title 14px 600] + [Message 13px gray-500] | [× Dismiss]

Animation: slide in from right (250ms ease), auto-dismiss after 4s
           manual dismiss on × click
```

---

## 5. Customer Portal — Page by Page

### 5.1 Landing / Home Page

#### Hero Section
```
Full-width | Height: 520px desktop | 360px mobile
Background: linear-gradient(135deg, #0C1A2E 0%, #0B6E72 100%)
Overlay: radial dot-grid SVG pattern (opacity 0.06, white dots)

Left column (55%):
  - Tag chip (pill): "Pakistan's Trusted Medicine Marketplace" 
    (teal border, light-teal background, small Phosphor <ShieldCheck> icon)
  - H1 (DM Serif Display 52px, white):
    "Your Health, Delivered to Your Door"
  - Subtext (18px, white/80%, max 2 lines):
    "Authentic medicines from verified vendors, delivered across Pakistan."
  - Search bar (600px, white bg, rounded-full, teal CTA button)
    Placeholder: "Search by medicine name, formula, or brand..."
  - Trust row (3 items, flex, gap 24px, 14px white/70%):
    ✓ 100% Authentic · ✓ 1,800+ Cities · ✓ 24/7 Support

Right column (45%):
  - Floating product/health illustration
  - Subtle CSS float animation (translateY ±8px, 3s ease-in-out loop)
```

#### Quick Category Bar
```
White background | Padding: 32px 0 | Border-bottom: 1px solid #E5E7EB

8 category pills — each:
  Background: #F6F8FA | Border-radius: 12px | Padding: 16px 20px
  Phosphor icon (32px, teal) centered above label
  Label: 13px 500
  Hover: Background brand-light, icon stays teal
  Active: Background brand-primary, text white, icon white

Categories: Prescription Meds | OTC Medicines | Vitamins | Supplements |
            Baby Care | Skincare | Devices | Herbal
```

#### Featured Products Section
```
Section header: "Featured Products" (H2 left) + "View All →" (14px teal, right)
Grid: 4 cols desktop | 2 cols tablet | 1 col mobile | gap 20px
Product cards (see §4.3)
```

#### Vendor Spotlight
```
Section header: "Top Vendors on PharmaHub"
Horizontal scrollable row of vendor cards (gap 16px)

Vendor card (200px wide):
  - Vendor logo/avatar (72px circle, border 2px white, shadow-card)
  - Vendor name (15px 600)
  - "142 products" (12px gray-500)
  - Rating stars (placeholder, disabled)
  - "View Store →" (teal link)
```

#### Categories Grid
```
Full-width | Background: #0C1A2E | Padding: 64px 80px

3×3 or 4×2 grid of category cards (gap 16px)
Each card (aspect-ratio: 4/3):
  - Full-bleed category image (object-cover)
  - Gradient overlay: transparent → rgba(12,26,46,0.75) bottom 60%
  - Bottom-left: Category name (18px 600 white) + count (12px white/70%)
  - Hover: image scale(1.04, 300ms ease) + slightly brighter overlay
```

#### How It Works
```
White background | 3 columns | gap 32px | Padding: 64px 80px

Step connector: dashed line (2px dashed #D1D5DB) between columns (desktop)

Each step:
  - Numbered circle: 48px, gradient teal fill, white number (18px 700)
  - Phosphor icon (32px, teal, below circle)
  - Title (18px 600)
  - Description (14px gray-500, max 2 lines)

Step 1: Search or Browse (Phosphor: MagnifyingGlass)
Step 2: Add to Cart & Checkout (Phosphor: ShoppingCart)
Step 3: Get Delivered (Phosphor: TruckSimple)
```

#### Footer
```
Background: #0C1A2E | Text: white/70% | Padding: 64px 80px 32px

4 columns:
  Col 1: Logo + tagline + social icons (Facebook, Instagram, Twitter, LinkedIn)
          Phosphor social icons, 20px, white/60%, hover white
  Col 2: Quick Links (Home | Browse | Supplements | Offers)
  Col 3: Customer Support (Help Centre | Contact Us | Returns | Track Order)
  Col 4: Download App — store badge buttons + QR code placeholder

Bottom bar (32px top margin, 1px top border white/10%):
  © 2025 PharmaHub — Privacy Policy · Terms of Service · Cookie Policy
```

---

### 5.2 Authentication Pages

#### Login Page
```
Split layout (50/50)

Left panel — Branded:
  Background: #0C1A2E
  Large Phosphor <FirstAidKit> icon (80px, teal, centered)
  Headline: "Welcome back to PharmaHub" (28px, DM Serif Display, white)
  3 trust bullets with Phosphor <Check> icons (teal)

Right panel — Form:
  Background: White | Padding: 48px
  Logo top-center
  H2: "Sign in to your account"
  [Email input]
  [Password input] + show/hide toggle (Phosphor <Eye> / <EyeSlash>)
  Row: "Remember me" checkbox | "Forgot password?" (teal link)
  [Primary "Sign In" button — full width]
  Divider: — or —
  "Don't have an account? Create one" (teal link)

Note: No social login (outside project requirements)
```

#### Customer Registration Page
```
Same split layout as Login

Form fields (right panel):
  [First Name] [Last Name]  ← two columns
  [Email Address]
  [Phone Number]  ← with Pakistan (+92) country code prefix
  [Password]      ← with password strength meter (see §4.2)
  [Confirm Password]
  [Date of Birth]  ← optional, React Day Picker
  [☑ I agree to the Terms of Service and Privacy Policy]
  [Primary "Create Account" — full width]
  "Already have an account? Sign In" (teal link)
```

#### Forgot Password — 3-Step Flow
```
Centered card (480px max, border-radius 16px, shadow-card, padding 40px)

Step 1: Enter email
  Heading: "Reset your password"
  Subtext: "Enter your email and we'll send a reset link"
  [Email input]
  [Send Reset Link — primary full width]

Step 2: Email sent confirmation
  Phosphor <EnvelopeOpen> (64px, teal)
  "Check your email"
  "We've sent a reset link to john@example.com"
  "Didn't receive it? Resend in 60s" (countdown, then link re-enables)

Step 3: New password form
  [New Password] + strength meter
  [Confirm Password]
  [Set New Password — primary full width]
  Success: redirect to login with toast "Password updated successfully"
```

---

### 5.3 Product Listing / Browse Page

```
Full-page: Left sidebar (280px fixed) + Right content area (flex 1)
Sidebar background: White with subtle right border (1px #E5E7EB)

Left Sidebar:
  "Filters" (16px 600) + "Clear All" (teal link)
  
  Filter sections — each collapsible accordion:
  1. Category       — checkbox list with product counts in parentheses
  2. Price Range    — dual-handle slider + min/max text inputs
  3. Vendor         — checkbox list (max 5 shown + "Show 8 more" link)
  4. Availability   — toggle (In Stock / All)
  5. Product Type   — checkbox group

  Applied filters: dismissible teal pill chips (× to remove each)

Main Content Area:
  Top bar (flex, space-between):
    Left: "Showing 124 results for 'paracetamol'" (14px gray-500)
    Right: Sort dropdown | [Grid icon] [List icon] view toggle

  Grid view: 3 cols desktop | 2 cols tablet | 1 col mobile | gap 20px
  List view: horizontal cards — image left (100×100) | details centre | CTA right
  
  Pagination: bottom, centred
```

---

### 5.4 Product Detail Page

```
Breadcrumb: Home › Medicines › Pain Relief › Product Name (12px, gray-500, links teal)

Two-column layout:

Left (45%) — Image Gallery:
  Main image: square, max 480px, border-radius 12px
  Thumbnails row (below): up to 5, 64×64px, border on active
  Click thumbnail → swap main image (cross-fade 150ms)
  Hover main image: magnifier zoom effect
  "In Stock" / "Out of Stock" badge overlay (top-right)

Right (55%) — Product Information:
  [Category badge chip]
  "Sold by: MedCo Pharma" (12px, gray-500, teal link)
  H1: Product Name (DM Serif Display 32px)
  Italic: "Paracetamol 500mg / Tablet" (16px, gray-500)
  ★★★★☆ 4.2 · (148 reviews) ← placeholder, disabled for now
  
  Price: PKR 1,850 (28px 700, teal)
  ● 48 units available (green dot, 14px)
  
  [Description — expandable: "show more / show less"]
  
  ─── divider ───
  
  Quantity: [−] [  3  ] [+] (48px height, 120px total width)
  [Add to Cart — full width primary, 52px]
  [Buy Now — full width secondary, 52px]
  
  ─── divider ───
  
  Product Details accordion (Phosphor <CaretDown> open/close):
    ▶ Composition / Formula
    ▶ How to Use
    ▶ Side Effects (collapsed by default)
    ▶ Storage Instructions
    ▶ Manufacturer Info

Below fold:
  "More from MedCo Pharma" — horizontal scroll product row
  "Related Products" — horizontal scroll product row
```

---

### 5.5 Shopping Cart Page

```
Two-column layout:

Left (65%) — Cart Items:
  Header: "Your Cart (3 items)" (H2)

  Each item row (padding 20px 0, border-bottom 1px #E5E7EB):
    Thumbnail (72×72px, border-radius 8px)
    [Product name (14px 600) + Formula (12px gray)]
    "Sold by: MedCo Pharma" (12px gray-500)
    Unit price (14px)
    Quantity stepper [− | N | +]
    Line total (16px 600)
    [Trash icon] remove button (ghost, red on hover)

  "Continue Shopping" ← text link (bottom left)

Right (35%) — Order Summary (sticky on scroll):
  Card (border-radius 12px, shadow-card, padding 24px):
    "Order Summary" (H3)
    Subtotal:       PKR 5,550
    Delivery:       Free
    Discount:       − PKR 200  (green text)
    ─────────────────────────
    Total:          PKR 5,350  (20px 700, teal)
    
    [Proceed to Checkout — full width primary lg]
    Payment icons row: Visa · Mastercard · JazzCash · Easypaisa · COD

Empty Cart State:
  Phosphor <ShoppingCart> (80px, gray-300)
  "Your cart is empty" (20px 600)
  "Looks like you haven't added any medicines yet"
  [Browse Medicines — primary button]
```

---

### 5.6 Checkout Page

```
Multi-step layout

Progress indicator (top, horizontal):
  Step 1: Delivery  →  Step 2: Payment  →  Step 3: Confirm
  Completed: filled teal circle + Phosphor <Check>
  Current:   filled teal circle + step number
  Upcoming:  gray circle + step number
  Connecting line: teal (completed) | gray (upcoming)

STEP 1 — Delivery Details:
  Full Name          | Phone Number        ← 2 columns
  Street Address     (full width)
  City               | Province           ← 2 columns
  Postal Code                             ← optional
  Delivery Instructions (textarea)
  [☐ Save this address for future orders]
  [Continue →  primary]

STEP 2 — Payment:
  Left (60%):
    Payment method — radio card group:
      [ ] Credit / Debit Card  (Visa / Mastercard icons)
      [ ] JazzCash
      [ ] Easypaisa
      [ ] Cash on Delivery
    
    If Card:
      Card Number (Phosphor card brand auto-detection on right)
      Cardholder Name
      Expiry MM/YY  |  CVV (with Phosphor <Info> tooltip)
      "🔒 Secured by SSL encryption" (12px gray-500)
    
  Right (40%): Sticky order summary (same as cart, compact)
  [Pay Now / Place Order — full width primary lg]

STEP 3 — Order Confirmation:
  Framer Motion checkmark circle draw animation (teal, 80px)
  "Order Placed Successfully!" (H1, DM Serif Display)
  "Your order is being prepared by the vendor."
  
  Order ID: #ORD-2025-04821 (16px monospace, teal, copy-to-clipboard icon)
  Estimated delivery: 2–4 business days
  
  [View Order Details — primary]  [Continue Shopping — ghost]
```

---

### 5.7 Customer Account Dashboard

**Layout:** Left sidebar (account nav, 240px) + Main content area

#### Account Sidebar
```
User avatar (72px circle) | Name (16px 600) | Email (13px gray-500)
Navigation:
  My Orders
  Transaction History
  Saved Addresses
  Profile Settings
  Change Password
  Logout (red text, bottom)
```

#### My Orders Page
```
Tab bar: All | Processing | Delivered | Cancelled

Each order card (padding 20px, border-radius 12px, shadow-card, margin-bottom 12px):
  Top row: Order #ORD-2025-04821 (monospace) | Date | [Status badge]
  Items row: thumbnails + names (condensed, 3 max then "+2 more")
  Bottom row: Total PKR 5,350 | [View Details — secondary button]

Order Detail (full page expand or side drawer):
  Vertical timeline stepper:
    ● Order Placed (date/time)
    ● Processing
    ● Shipped
    ● Delivered ← (grayed out if not yet)
  
  Items table | Delivery address | Payment method
  [Download Invoice — ghost button with Phosphor <DownloadSimple>]
```

#### Transaction History Page
```
Table: Date | Transaction ID (monospace) | Description | Amount | Status badge
Filter: date range picker (top right)
Amount: teal for payments
Empty state: "No transactions yet"
```

---

## 6. Vendor Portal — Page by Page

### 6.1 Vendor Dashboard

```
Page greeting: "Good morning, Ahmed Pharmacy 👋" + current date (right, gray-500)

KPI Cards row (4 cards):
  1. Total Products    — Phosphor <Pill> (teal bg) + count
  2. New Orders Today  — Phosphor <Package> (blue bg) + count
  3. Revenue This Month — Phosphor <CurrencyDollar> (green bg) + PKR amount
  4. Low Stock Alerts  — Phosphor <Warning> (amber bg) + count

Two-column section (60% / 40%):
  Left — Recent Orders (compact table, last 5):
    Columns: Order ID | Product | Qty | City | Status badge | Time ago
    "View All Orders →" teal link below

  Right — Top Selling Products (ranked list):
    Rank medal icon | Thumbnail | Name | Units sold | Revenue
    (max 5 items)

Sales Chart (Recharts LineChart):
  Full-width card below
  30-day revenue trend (teal line, gradient fill below)
  Toggle buttons: Daily | Weekly | Monthly
  Hover tooltip: date + PKR amount
```

---

### 6.2 My Products Page

```
Top bar:
  H2: "My Products" | Chip: "47 Products"
  [Search by name] [Category ▾] [Status: All ▾] | [+ Add Product (primary)]

Table (TanStack Table):
  [□] | Image | Name | Category | Price | Stock | Status | Actions

Image:    48×48px rounded (8px)
Name:     600 weight, clickable → edit page
Category: small teal badge
Price:    teal
Stock:    dot + number
  • Green: > 10 units
  • Amber: 1–10 units
  • Red:   0 units + "Out of Stock" chip
Status:   Active / Inactive badge
Actions:  [Edit icon] [Delete icon] — delete shows confirmation modal

Bulk action bar (sticky bottom, appears on selection):
  "{X} items selected"  [Delete Selected (danger)] [Toggle Status ▾]
```

---

### 6.3 Add / Edit Product Page

```
Full-page form | Two-column layout

Left (60%):
  ── Basic Information ──
  Product Name *               (required)
  Generic Formula / Composition
  Description                  (TipTap rich text: bold, italic, lists)
  Category *                   (searchable select dropdown)

  ── Pricing & Inventory ──
  Price (PKR) *                (number with "PKR" prefix)
  Stock Quantity *             (number input)
  SKU / Barcode                (optional text, monospace font)
  Low Stock Alert Threshold    "Notify me when stock falls below [  ] units"

Right (40%):
  ── Product Images ──
  File upload area (see §4.2)
  Thumbnail grid (3 cols, drag-to-reorder, × to remove)
  First image labeled "Main" with teal banner
  Limit: 8 images | Max 5MB each | JPG, PNG, WebP

  ── Product Status ──
  Toggle: Active ● / ○ Inactive
  Helper: "Inactive products are hidden from all customers"

  ── Customer Preview ──
  Read-only mini product card preview (shows how it will appear in listing)

Sticky bottom action bar (64px, white, shadow above):
  [Cancel (ghost, left)] | [Save as Draft] | [Publish Product (primary, right)]
```

---

### 6.4 Orders Management — Vendor View

```
Top: 4 count pills → All Orders | Processing | Delivered | Cancelled

Filter bar: [Date range picker] [Status ▾] [Search by Order ID]

Orders table:
  Order ID (mono) | Date | Customer City | Items (count) |
  Total | Payment Status | Order Status | [View]

Row click / View button → Order Detail Side Panel (slides from right, 480px):
  Phosphor <X> close button
  Order ID + timestamp
  Items: thumbnail + name + qty + price each
  Order total (bold)
  Customer delivery address (masked to city + area for privacy)
  Payment confirmed badge
  Order Status (view-only — vendor cannot change status)
  "Contact Support" link for disputes
```

---

### 6.5 Sales Report — Vendor View

```
Date range presets: [Today] [7 Days] [30 Days] [Custom]

Summary metrics bar (4 mini KPI cards):
  Total Revenue | Total Orders | Units Sold | Avg Order Value

Recharts LineChart — Revenue over selected period
  X-axis: dates | Y-axis: PKR amount | Teal line + gradient fill
  Responsive + tooltip on hover

Products Performance Table (TanStack, sortable):
  Product Name | Units Sold | Revenue (PKR) | % of Total Sales
  Sorted by revenue descending by default

[Export as CSV — ghost button, top right, Phosphor <DownloadSimple>]
```

---

## 7. Admin Portal — Page by Page

> **Admin portal visual identity:** Same sidebar layout as Vendor but with `--color-accent-gold` highlights on active states and section headings. Conveys authority and elevated access level.

### 7.1 Admin Dashboard

```
Top KPI row (5 cards):
  Total Vendors | Total Customers | Total Products |
  Today's Orders | Total Revenue (all-time)

Second row:
  Left (60%): Orders chart (Recharts BarChart, last 30 days, teal bars)
  Right (40%): Top Vendors by Sales (leaderboard list, rank + name + revenue)

Third row:
  Left (50%): Recent Transactions
    Compact table: TXN ID (mono) | Vendor | Amount | Status badge
  Right (50%): Recent Audit Log
    Last 8 entries: timestamp + actor + action summary (color-coded dot)
```

---

### 7.2 Vendor Management Page

```
H2: "Vendors" | [+ Create Vendor (primary, right)]
Filter bar: [Search by name/email] [Status: All / Active / Inactive ▾]

Vendors table:
  [□] | Avatar | Vendor Name | Email | Products | Joined | Status | Actions

Actions:
  [View icon]   → Vendor profile modal
  [Edit icon]   → Edit vendor modal
  [Toggle icon] → Activate / Deactivate (with confirmation modal)

Create Vendor Modal (560px):
  Business / Vendor Name *
  Contact Person Name *
  Email Address *        (becomes login credential)
  Temporary Password     (auto-generated, shown once, copy-to-clipboard)
  Phone Number
  Business Address
  Internal Notes         (admin-only, not shown to vendor)
  Note banner: "Login credentials will be emailed to the vendor automatically"
  [Create Account (primary)]

Edit Vendor Modal: Same fields pre-populated + Status toggle at bottom

Deactivate Confirmation Modal:
  Phosphor <Warning> (48px, amber)
  "Deactivate [Vendor Name]?"
  "This vendor will immediately lose portal access and all their products
   will be hidden from customers until reactivated."
  [Cancel (ghost)] [Deactivate (danger)]
```

---

### 7.3 Customer Management Page

```
Customers table:
  [□] | Avatar | Full Name | Email | Phone | Registered | Total Orders | Status | Actions

Actions: View details | Toggle status (activate/deactivate)

Customer Detail Modal:
  Profile info (name, email, phone, registration date)
  Order history summary (count, last order date)
  Total lifetime spend (teal, 600 weight)
  Account status toggle with confirmation
```

---

### 7.4 All Products Page — Admin View

```
Same table structure as Vendor's My Products page

Additional column: Vendor Name (link → vendor profile)

Admin capabilities:
  View all products across all vendors
  Filter by vendor (dropdown)
  View product detail
  Note: Product editing belongs to Vendor — Admin monitors only
        (Admin override capability can be added in future phase)
```

---

### 7.5 All Orders Page — Admin View

```
Orders table:
  Order ID | Date | Customer | Vendor | Items | Total | Payment Status | Order Status

Filter bar: [Date range] [Vendor ▾] [Order Status ▾] [Payment Status ▾]

Order Detail Modal (800px):
  Full order summary
  Customer name + delivery address
  Vendor name + link
  Ordered items table
  Payment verification details
  Transaction ID (monospace, copy-to-clipboard)
  Payment gateway response snippet
```

---

### 7.6 Transactions Page

```
Summary bar (top, 4 KPI mini cards):
  Total Processed | Successful Count | Failed Count | Refunded

Transactions table:
  Transaction ID (mono) | Date & Time | Customer | Vendor |
  Amount | Method | Gateway Ref | Status badge

Filter: [Date range] [Vendor ▾] [Payment Method ▾] [Status ▾]

Row click → Transaction Detail Modal:
  All table fields expanded
  Payment gateway raw response data (collapsible code block, JetBrains Mono)
  Linked order reference (clickable → order detail)
```

---

### 7.7 Reports Page

```
Three main tabs: Products | Orders | Sales

Toolbar (below tabs):
  [Date range picker] [Vendor ▾] | [Export CSV] [Export PDF]

── Products Report ──
  Bar chart: Products per vendor (Recharts BarChart, horizontal)
  Donut chart: Products by category
  Table: Out-of-stock products list

── Orders Report ──
  Line chart: Orders over time
  Donut chart: Orders by status
  Bar chart: Orders per vendor
  Summary table for selected period

── Sales Report ──
  Area chart: Revenue over time (teal gradient fill)
  Horizontal bar chart: Revenue by vendor
  Stacked bar: Revenue by category
  Summary table: Vendor | Orders | Revenue | Avg Order Value
```

---

### 7.8 Audit Log Page

```
Read-only (cannot modify or delete entries)

Table:
  Timestamp (mono, full date+time) | User + Role badge | Action dot | Description | IP

Action type colour coding:
  ● Green  (fill) — Created   (new vendor, new product)
  ● Blue   (fill) — Updated   (edits to vendor, product, prices)
  ● Red    (fill) — Deleted / Deactivated
  ● Gray         — Login / Logout
  ● Amber  (fill) — System events

Search: [by user] [by action type ▾] [date range]

Example descriptions (human-readable):
  "Admin John created Vendor account for MedCo Pharma"
  "Vendor Ali updated product: Panadol 500mg — price changed PKR 120 → 135"
  "Admin John deactivated Vendor: Generic Meds Co"
```

---

## 8. Empty States & Error States

### Empty States

Each empty state: centred in its container, consistent anatomy.

```
Structure:
  Phosphor illustration icon (80px, gray-300)  ← relevant to context
  Heading: 16px 600 weight
  Sub-message: 14px gray-500, max 2 lines
  Optional CTA button (primary or ghost)
```

| Context | Icon | Heading | Sub-message | CTA |
|---|---|---|---|---|
| No products | `Pill` | "No products yet" | "Add your first product to get started" | + Add Product |
| No orders | `Package` | "No orders received yet" | "Share your store link to start selling" | Share Store |
| Cart empty | `ShoppingCartSimple` | "Your cart is empty" | "Looks like you haven't added any medicines" | Browse Medicines |
| No results | `MagnifyingGlass` | "No results for '{query}'" | "Try different keywords or browse categories" | Browse All |
| No customers | `Users` | "No customers yet" | "Customers will appear here once they register" | — |
| No transactions | `CreditCard` | "No transactions yet" | "Completed payments will appear here" | — |

---

### Error Pages

#### 404 — Not Found
```
Large "404" (DM Serif Display 120px, teal, opacity 0.15, absolute behind content)
Phosphor <MapTrifold> (64px, gray-400)
"Page not found" (H1)
"The page you're looking for doesn't exist or has been moved."
[Go Home (primary)]  [Contact Support (ghost)]
```

#### 500 — Server Error
```
Phosphor <Warning> (64px, amber)
"Something went wrong" (H1)
"Our team has been automatically notified. Please try again."
[Retry (primary)]
```

#### Offline
```
Phosphor <WifiSlash> (64px, gray-400)
"You appear to be offline"
"Check your connection and try again."
Auto-retry indicator with Phosphor <ArrowsClockwise> spinning icon
```

---

## 9. Notification System

### In-App Notification Centre (Bell Dropdown)

```
Trigger: Phosphor <Bell> icon in navbar, red badge with unread count
Dropdown panel: 380px wide | max-height 480px | scrollable | shadow-modal | border-radius 12px

Header row: "Notifications" (16px 600) | "Mark all as read" (teal link, right)

Each notification item (padding 14px 16px):
  Unread: 3px left teal border + background brand-mist
  Read:   white background
  
  Left:  Icon (40px circle, colored per notification type)
  Right: Title (14px 600) + Message (13px gray-500, 2-line clamp)
         Timestamp (12px gray-400, relative: "2 min ago", "3 days ago")

Types & colours:
  Order confirmed  → teal icon background
  Order shipped    → blue icon background
  Order delivered  → green icon background
  New order (vendor) → blue
  Low stock alert  → amber, Phosphor <Warning>
  System alert     → red

Footer: "View all notifications →" (teal link, centred)
```

---

## 10. Responsive / Mobile Design

### Customer Mobile Experience (< 768px)

```
Navigation:
  Top bar: Logo | Cart | Hamburger
  REPLACED BY: Fixed bottom tab bar (5 tabs)
    Home | Search | Cart | Orders | Account
    Active tab: teal icon + teal label, 2px top border

Search:
  Taps search tab → full-screen search overlay (slide up, 300ms)
  Recent searches + suggested categories shown

Filters:
  "Filter & Sort" button → bottom sheet / drawer (slides up from bottom)
  Full filter UI in sheet format, close button top-right

Product Detail:
  Single-column scroll
  Sticky "Add to Cart" button at bottom (above tab bar)
  Image gallery: swipeable (Framer Motion drag, momentum)

Checkout:
  Single long scroll page (no multi-step on mobile)
  All steps collapsed into one vertical form
```

### Vendor / Admin Mobile (< 768px)

```
Sidebar → Hamburger menu (slides from left, overlays content)
Tables → Card stacks (each row becomes a compact card)
Charts → Summary number cards + mini Recharts Sparkline
Forms  → Full-width single column, stacked labels above inputs
Modals → Full-screen sheet (bottom to top slide)
```

---

## 11. Loading & Skeleton States

### Skeleton Screens (preferred over spinners)

```
All data-loading sections show skeleton placeholders matching content layout:

Animation: CSS pulse — opacity cycles 1.0 → 0.5 → 1.0 (1.5s ease-in-out loop)
Colour:    #E5E7EB base | #F3F4F6 highlight

Product card skeleton:
  Gray rectangle (image) + 3 gray lines (varying widths) + gray button

Table skeleton:
  Header row (gray) + 5 alternating body rows (light gray lines)

Dashboard KPI skeleton:
  4 gray rounded rectangles (matching card dimensions)

Chart skeleton:
  Gray card with pulsing rectangular placeholder

Form skeleton:
  Stacked gray input-height rectangles with label-sized lines above
```

### Full-Page Loading (Initial App Load)
```
Centred logo (opacity 0.6) 
Teal progress bar sliding across very top of page (indeterminate)
Background: white
```

---

## 12. Animations & Motion

Powered by **Framer Motion** (`framer-motion` v11+). Mark all animated components with `'use client'`.

| Motion | Duration | Easing | Notes |
|---|---|---|---|
| Page transition | 250ms | `easeInOut` | Fade + slight Y offset |
| Modal open | 200ms | `easeOut` | Scale 0.95→1 + fade |
| Modal close | 150ms | `easeIn` | Scale 1→0.97 + fade |
| Sidebar expand | 250ms | `easeInOut` | Width animation (layout) |
| Toast slide-in | 250ms | `spring(stiff)` | From right |
| Toast fade-out | 200ms | `easeIn` | Auto after 4s |
| Card hover lift | 200ms | `easeOut` | translateY −2px |
| Button press | 100ms | — | scale 0.98 |
| Floating hero image | 3000ms | `easeInOut` | Loop, ±8px Y |
| Checkout checkmark | 600ms | `easeOut` | SVG path draw animation |
| Skeleton pulse | 1500ms | `easeInOut` | Loop, opacity 0.5↔1 |

**Reduced motion:** All animations respect `prefers-reduced-motion: reduce` via Framer Motion's `useReducedMotion()` hook.

---

## 13. Accessibility Standards

**Target:** WCAG 2.1 AA compliance throughout.

| Requirement | Implementation |
|---|---|
| Colour contrast | All text/bg combinations tested ≥ 4.5:1 (normal text), ≥ 3:1 (large text) |
| Focus indicators | Visible `shadow-focus` ring on all interactive elements (3px teal, no `outline: none` without replacement) |
| Keyboard navigation | Full keyboard flow for nav, modals, dropdowns, forms |
| ARIA labels | All icon-only buttons have `aria-label`; modals use `role="dialog"` + `aria-labelledby` |
| Screen reader | Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`) throughout |
| Form errors | Error messages linked to inputs via `aria-describedby`, not just colour alone |
| Skip link | "Skip to main content" anchor link as first focusable element |
| Images | All product images have `alt` text; decorative images use `alt=""` |
| Tap targets | Minimum 44×44px for all interactive elements on mobile |

---

## 14. Future-Proofing Notes

Design placeholders are built into the current spec to accommodate these planned features without structural rework:

| Feature | Current Placeholder |
|---|---|
| Prescription Upload | Dedicated tab/category already in navigation |
| Doctor Consultation | Placeholder link in navbar and homepage |
| Ratings & Reviews | Star UI shown on product cards (disabled state) |
| Wishlist | Heart icon on product cards (visual only, non-functional) |
| Loyalty Points | UI space reserved in customer account sidebar |
| Notification Preferences | "Notifications" tab in Settings (placeholder) |
| Multi-language / i18n | All text in component string constants for easy extraction |
| Dark Mode | Full CSS custom properties setup supports theme switching via `[data-theme="dark"]` |
| Mobile App (React Native) | Design mirrors native app patterns — bottom nav, swipe gestures |
| Push Notifications | Notification system architecture supports extension to push |

---

## 15. Technology Stack

### Core Framework & Tooling

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Next.js** | `15+` | `next` | App Router, SSR, routing, API routes |
| **React** | `18+` | `react`, `react-dom` | UI component library |
| **JavaScript** | `ES2022+` | — | Language standard; no TypeScript |

> **Routing note:** Use Next.js App Router exclusively. React Router v6 is **incompatible** with Next.js — do not use it. Route protection is handled via Next.js Middleware (`middleware.ts`).

---

### Styling

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Tailwind CSS** | `v3.4+` | `tailwindcss` | Utility-first styling, custom tokens |
| **PostCSS** | `8+` | `postcss`, `autoprefixer` | Tailwind processing pipeline |
| **clsx** | `2+` | `clsx` | Conditional class merging |
| **tailwind-merge** | `2+` | `tailwind-merge` | Conflict-free Tailwind class merging |

> **Component approach:** Build custom components on top of Tailwind — **do not use** Material UI, Bootstrap, Chakra UI, or Ant Design. Maintaining design token alignment is easier with utility-first.

---

### UI Components & Icons

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Phosphor Icons** | `v2.x` | `@phosphor-icons/react` | All iconography |
| **Radix UI Primitives** | `latest` | `@radix-ui/react-*` | Accessible unstyled primitives (Dialog, Select, Tooltip, etc.) |
| **Headless UI** | `v2+` | `@headlessui/react` | Accessible Menu, Transition, Combobox |

---

### Forms & Validation

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **React Hook Form** | `v7+` | `react-hook-form` | Form state, performance |
| **Zod** | `v3+` | `zod` | Schema declaration + validation |
| **@hookform/resolvers** | `v3+` | `@hookform/resolvers` | RHF ↔ Zod bridge |

---

### State Management

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Redux Toolkit** | `v2+` | `@reduxjs/toolkit`, `react-redux` | Auth state, UI state, global app state |
| **TanStack Query** | `v5+` | `@tanstack/react-query` | Server state, caching, background sync |

---

### Data & Tables

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **TanStack Table** | `v8+` | `@tanstack/react-table` | Sortable, filterable, paginated admin tables |
| **Recharts** | `v2+` | `recharts` | Dashboard charts, reports (`'use client'` required) |

---

### Animations

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Framer Motion** | `v11+` | `framer-motion` | Page transitions, modals, toasts, gestures (`'use client'` required) |

---

### Rich Text & Editors

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **TipTap** | `v2+` | `@tiptap/react`, `@tiptap/starter-kit` | Product description editor for vendors (`'use client'` required) |

---

### Date & Time

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **React Day Picker** | `v8+` | `react-day-picker` | Date pickers, date range selectors (`'use client'` required) |
| **date-fns** | `v3+` | `date-fns` | Date formatting, arithmetic, parsing |

---

### Notifications / Toasts

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **Sonner** | `v1+` | `sonner` | Toast notifications (replaces react-hot-toast; built for Next.js App Router) |

---

### Fonts

| Technology | Version | Package | Purpose |
|---|---|---|---|
| **next/font/google** | Built-in | — | Self-hosted Google Fonts: DM Serif Display + Plus Jakarta Sans + JetBrains Mono |

> Zero layout shift. GDPR-compliant. No external font requests at runtime.

---

### Recommended Dev Dependencies

| Package | Purpose |
|---|---|
| `eslint`, `eslint-config-next` | Code quality |
| `prettier`, `prettier-plugin-tailwindcss` | Code formatting + Tailwind class sorting |
| `husky`, `lint-staged` | Pre-commit hooks |

---

## 16. Tailwind CSS Configuration

The following is the recommended `tailwind.config.js` extending the default theme with PharmaHub's design tokens.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      // ─── COLOURS ─────────────────────────────────────────────────
      colors: {
        brand: {
          primary:  '#0B6E72',
          dark:     '#084F52',
          light:    '#E6F4F5',
          mist:     '#F0F9FA',
        },
        ink: {
          900:      '#0C1A2E',
          800:      '#152845',
          headline: '#0C1A2E',
        },
        surface: {
          base:     '#FFFFFF',
          subtle:   '#F6F8FA',
          input:    '#F7F8FA',
        },
        neutral: {
          100:      '#F7F8FA',
          200:      '#E5E7EB',
          300:      '#D1D5DB',
          500:      '#6B7280',
          600:      '#4B5563',
          900:      '#111827',
        },
        status: {
          success:        '#0F9D58',
          'success-bg':   '#DCFCE7',
          'success-text': '#14532D',
          warning:        '#D97706',
          'warning-bg':   '#FEF3C7',
          'warning-text': '#78350F',
          danger:         '#DC2626',
          'danger-bg':    '#FEE2E2',
          'danger-text':  '#7F1D1D',
          info:           '#2563EB',
          'info-bg':      '#DBEAFE',
          'info-text':    '#1E3A8A',
        },
        accent: {
          gold:     '#B8860B',
          'gold-bg':'#FEF9C3',
        },
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────
      fontFamily: {
        heading: ['DM Serif Display', 'Georgia', 'serif'],
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display': ['52px', { lineHeight: '1.1',  fontWeight: '700' }],
        'h1':      ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2':      ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':      ['22px', { lineHeight: '1.3',  fontWeight: '600' }],
        'h4':      ['18px', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6',  fontWeight: '400' }],
        'body':    ['14px', { lineHeight: '1.6',  fontWeight: '400' }],
        'small':   ['12px', { lineHeight: '1.5',  fontWeight: '400' }],
        'label':   ['11px', { lineHeight: '1',    fontWeight: '600' }],
        'code':    ['13px', { lineHeight: '1.5',  fontWeight: '400' }],
      },

      // ─── SPACING ─────────────────────────────────────────────────
      spacing: {
        '18': '72px',
        '22': '88px',
      },

      // ─── BORDER RADIUS ───────────────────────────────────────────
      borderRadius: {
        'sm':   '6px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        'pill': '9999px',
      },

      // ─── SHADOWS ─────────────────────────────────────────────────
      boxShadow: {
        'card':        '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.06)',
        'card-hover':  '0 4px 16px rgba(11,110,114,0.14), 0 1px 4px rgba(0,0,0,0.06)',
        'dropdown':    '0 4px 20px rgba(0,0,0,0.10)',
        'modal':       '0 24px 64px rgba(0,0,0,0.20)',
        'navbar':      '0 1px 0 rgba(0,0,0,0.08)',
        'focus':       '0 0 0 3px rgba(11,110,114,0.20)',
      },

      // ─── ANIMATION ───────────────────────────────────────────────
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'skeleton': 'skeleton-pulse 1.5s ease-in-out infinite',
        'float':    'float 3s ease-in-out infinite',
      },

      // ─── BREAKPOINTS ─────────────────────────────────────────────
      screens: {
        'xs': '475px',
        // sm, md, lg, xl, 2xl remain Tailwind defaults
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // Prose styles for rich text
    require('@tailwindcss/forms'),         // Base form element reset
    require('@tailwindcss/line-clamp'),    // Text truncation utilities
  ],
};

module.exports = config;
```

### CSS Custom Properties Setup

Add to your `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand */
    --color-brand-primary:  #0B6E72;
    --color-brand-dark:     #084F52;
    --color-brand-light:    #E6F4F5;
    --color-brand-mist:     #F0F9FA;

    /* Ink / Dark */
    --color-ink-900:        #0C1A2E;
    --color-ink-800:        #152845;

    /* Surfaces */
    --color-surface-base:   #FFFFFF;
    --color-surface-subtle: #F6F8FA;

    /* Status */
    --color-success:        #0F9D58;
    --color-warning:        #D97706;
    --color-danger:         #DC2626;
    --color-info:           #2563EB;

    /* Typography */
    --font-heading: 'DM Serif Display', Georgia, serif;
    --font-sans:    'Plus Jakarta Sans', system-ui, sans-serif;
    --font-mono:    'JetBrains Mono', Menlo, monospace;
  }

  /* Dark mode support (future) */
  [data-theme="dark"] {
    --color-surface-base:   #0F172A;
    --color-surface-subtle: #1E293B;
    /* extend as needed */
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

---

*End of PharmaHub Frontend Design Specification v2.0*

*This document covers all UI/UX design decisions for the 48 system requirements.*
*Ready to be handed to a frontend development team.*

---

**Document authored:** June 2025 · **Next review:** Before v2 development milestone
