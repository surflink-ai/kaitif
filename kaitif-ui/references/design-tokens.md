# Kaitif Design Tokens

Complete design token system for the Kaitif Skatepark UI - **Storm Cloud Aesthetic**.

Dark, moody grays with electric yellow energy.

---

## Colors

### Background Palette (Storm Cloud Grays)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-storm` | `#0A0A0B` | Deepest storm - primary background |
| `bg-cloud` | `#111113` | Cloud layer - cards, elevated surfaces |
| `bg-slate` | `#1A1A1D` | Slate - inputs, secondary surfaces |
| `bg-ash` | `#252529` | Ash - hover states, tertiary surfaces |
| `bg-steel` | `#35353A` | Steel - borders, dividers |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-electric` | `#FFE500` | Electric yellow - THE accent. Primary CTAs, highlights |
| `accent-electric-dim` | `#BFA900` | Dimmed yellow - subtle states, disabled |
| `white` | `#FFFFFF` | Pure white - text, icons, secondary buttons |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#FFFFFF` | Headlines, primary text |
| `text-secondary` | `#9A9AA0` | Body text, descriptions |
| `text-tertiary` | `#5A5A62` | Captions, labels |
| `text-muted` | `#3A3A42` | Placeholders, disabled text |
| `text-inverse` | `#0A0A0B` | Text on light/electric backgrounds |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#EF4444` | Error states |
| `info` | `#3B82F6` | Information |

### Gamification Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `tier-bronze` | `#CD7F32` | Bronze tier |
| `tier-silver` | `#8A8A8A` | Silver tier |
| `tier-gold` | `#FFE500` | Gold tier (matches electric accent) |
| `tier-platinum` | `#E5E4E2` | Platinum tier |

---

## Typography

### Font Families
```css
--font-display: 'Plus Jakarta Sans', 'Satoshi', system-ui, sans-serif;
--font-body: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
--font-mono: 'SF Mono', 'JetBrains Mono', monospace;
```

### Type Scale
| Token | Size | Weight | Tracking | Line Height | Usage |
|-------|------|--------|----------|-------------|-------|
| `display-xl` | 72px (4.5rem) | 800 | -0.03em | 1.0 | Hero headlines |
| `display-lg` | 56px (3.5rem) | 700 | -0.025em | 1.05 | Page titles |
| `display` | 40px (2.5rem) | 700 | -0.02em | 1.1 | Section heroes |
| `heading-xl` | 32px (2rem) | 600 | -0.015em | 1.2 | Major headings |
| `heading-lg` | 24px (1.5rem) | 600 | -0.01em | 1.25 | Section headings |
| `heading` | 20px (1.25rem) | 600 | -0.01em | 1.3 | Card titles |
| `title` | 18px (1.125rem) | 500 | normal | 1.4 | Subtitles |
| `body-lg` | 18px (1.125rem) | 400 | normal | 1.6 | Large body text |
| `body` | 16px (1rem) | 400 | normal | 1.6 | Default body |
| `body-sm` | 14px (0.875rem) | 400 | normal | 1.5 | Small body |
| `caption` | 12px (0.75rem) | 500 | 0.02em | 1.4 | Labels, captions |
| `overline` | 11px (0.6875rem) | 600 | 0.1em | 1.2 | Overline labels |

### Typography Examples
```tsx
// Display - Plus Jakarta Sans, tight tracking
<h1 className="text-[72px] font-extrabold tracking-[-0.03em] leading-none text-white">
  Skate. Ride. Repeat.
</h1>

// Section heading
<h2 className="text-[32px] font-semibold tracking-[-0.015em] text-white">
  Upcoming Events
</h2>

// Card title
<h3 className="text-[20px] font-semibold text-white">
  Weekend Jam Session
</h3>

// Body text
<p className="text-base text-[#9A9AA0] leading-relaxed">
  Join the premier skatepark community in Barbados.
</p>

// Caption / Label
<span className="text-xs font-medium uppercase tracking-[0.02em] text-[#5A5A62]">
  Coming Soon
</span>

// Electric overline (for emphasis)
<span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#FFE500]">
  Featured Event
</span>
```

---

## Spacing

### Scale (8px base)
| Token | Value | Pixels |
|-------|-------|--------|
| `0` | 0 | 0px |
| `px` | 1px | 1px |
| `0.5` | 0.125rem | 2px |
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |
| `32` | 8rem | 128px |

### Component Spacing
```
Card padding: 24px (p-6)
Card internal gap: 16px (gap-4)
Section vertical padding: 96px (py-24)
Section horizontal padding: 24px mobile, 48px desktop
Grid gap: 24px (gap-6)
Button padding: 16px 32px (px-8 py-4)
Input padding: 12px 16px (px-4 py-3)
Badge padding: 6px 12px (px-3 py-1.5)
```

---

## Shadows

### Elevation Scale
```css
/* Subtle - for hover states */
--shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.4);

/* Card - default elevation */
--shadow-card: 0 4px 24px -4px rgba(0, 0, 0, 0.6);

/* Lifted - hover state for cards */
--shadow-lifted: 0 8px 32px -4px rgba(0, 0, 0, 0.7);

/* Modal - overlays */
--shadow-modal: 0 24px 48px -12px rgba(0, 0, 0, 0.8);

/* Inner - for inputs */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3);

/* Electric glow - for primary CTAs on hover */
--shadow-glow-electric: 0 0 24px rgba(255, 229, 0, 0.4);
--shadow-glow-electric-sm: 0 0 8px rgba(255, 229, 0, 0.6);
```

### Usage
```tsx
// Default card
className="shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]"

// Card on hover
className="hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7)]"

// Electric button hover glow
className="hover:shadow-[0_0_24px_rgba(255,229,0,0.4)]"

// Live indicator glow
className="shadow-[0_0_8px_rgba(255,229,0,0.6)]"
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0 | Sharp edges (rarely used) |
| `sm` | 6px | Badges, small elements |
| `DEFAULT` | 8px | Buttons (non-primary), inputs |
| `md` | 12px | Small cards, dropdowns |
| `lg` | 16px | Medium cards |
| `xl` | 20px | Large cards |
| `2xl` | 24px | Featured cards, modals |
| `full` | 9999px | Pills, avatars, primary buttons |

### Usage
```tsx
// Primary button - pill shape
className="rounded-full"

// Card
className="rounded-2xl"

// Input
className="rounded-xl"

// Badge
className="rounded-full"
```

---

## Borders

### Widths
```css
--border-0: 0px;
--border-DEFAULT: 1px;
--border-2: 2px;
```

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `border-default` | `#252529` | Default borders |
| `border-hover` | `#35353A` | Hover state borders |
| `border-focus` | `#5A5A62` | Focus state borders |
| `border-electric` | `#FFE500` | Electric focus ring (primary inputs) |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Base |
| `z-10` | 10 | Raised elements |
| `z-20` | 20 | Dropdowns |
| `z-30` | 30 | Sticky elements |
| `z-40` | 40 | Fixed navigation |
| `z-50` | 50 | Modal backdrop |
| `z-60` | 60 | Modal content |
| `z-70` | 70 | Toast notifications |
| `z-80` | 80 | Tooltips |
| `z-max` | 9999 | Maximum |

---

## Breakpoints

| Token | Min Width | Target |
|-------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Container
```css
--container-padding: 24px;
--container-max: 1280px;
```

---

## Animation

### Durations
```css
--duration-fast: 150ms;
--duration-DEFAULT: 300ms;
--duration-slow: 500ms;
```

### Easings
```css
--ease-DEFAULT: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
```

### Electric Glow Animation
```css
@keyframes electric-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 229, 0, 0.6); }
  50% { box-shadow: 0 0 16px rgba(255, 229, 0, 0.8); }
}
```

---

## CSS Variables

```css
:root {
  /* Background */
  --color-bg-storm: #0A0A0B;
  --color-bg-cloud: #111113;
  --color-bg-slate: #1A1A1D;
  --color-bg-ash: #252529;
  --color-bg-steel: #35353A;

  /* Accent */
  --color-accent-electric: #FFE500;
  --color-accent-electric-dim: #BFA900;
  --color-white: #FFFFFF;

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #9A9AA0;
  --color-text-tertiary: #5A5A62;
  --color-text-muted: #3A3A42;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Border */
  --color-border: #252529;
  --color-border-hover: #35353A;

  /* Typography */
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'SF Mono', monospace;

  /* Animation */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-DEFAULT: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```
