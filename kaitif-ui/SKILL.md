---
name: kaitif-ui
description: |
  **Kaitif Skatepark UI/UX Design System**: Generate premium professional sports interfaces with a modern Glass Morphism / Apple Liquid Glass aesthetic - translucent frosted glass effects with electric yellow energy.
  - MANDATORY TRIGGERS: kaitif, skatepark, ui, ux, design, component, layout, page, screen, interface, frontend, styling
  - Covers: Next.js web app, React Native mobile, admin dashboard
  - Design tokens: glass morphism, translucent surfaces, electric yellow accent, soft shadows
  - Use when building any visual component, page, screen, or UI element for the Kaitif ecosystem
---

# Kaitif UI/UX Design System

Generate premium professional sports interfaces with a modern **Glass Morphism / Apple Liquid Glass** aesthetic.

## Design Philosophy

**Glass Morphism Aesthetic** - Translucent, layered, elegant. Frosted glass surfaces with electric energy.

### Core Principles
1. **Translucent Depth** - Layered glass surfaces with backdrop blur create visual hierarchy
2. **Electric Energy** - Sharp yellow (#FFE500) cuts through the glass with purpose
3. **Soft Elegance** - Rounded corners, soft shadows, and subtle animations
4. **Clean Minimalism** - Generous whitespace, clear typography, no visual noise
5. **Ambient Atmosphere** - Subtle gradient backgrounds and glow effects for depth

### Visual DNA
- **Surfaces**: Translucent glass with backdrop-blur - `bg-white/5` to `bg-white/12`
- **Borders**: Subtle white opacity - `border-white/8` to `border-white/15`
- **Accent**: Electric yellow (#FFE500) - the energy, used with intent
- **Shadows**: Soft, blurred shadows - no harsh edges
- **Corners**: Generous rounding - `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- **Motion**: Smooth, subtle, natural. 300ms transitions with ease-out.

---

## Quick Reference

### Core Colors
```
// Background Layers
--bg-base: #0A0A0F           // Deep space - primary background
--bg-secondary: #12121A      // Elevated layer
--bg-ambient: radial-gradient(...) // Subtle colored orbs

// Glass Properties
--glass-bg: rgba(255, 255, 255, 0.05)       // Default glass
--glass-bg-light: rgba(255, 255, 255, 0.08) // Hover/active glass
--glass-bg-solid: rgba(255, 255, 255, 0.12) // Prominent glass
--glass-border: rgba(255, 255, 255, 0.1)    // Default border
--glass-border-light: rgba(255, 255, 255, 0.15) // Hover border

// Electric Accent
--accent-electric: #FFE500  // Electric yellow - THE accent
--accent-glow: rgba(255, 229, 0, 0.3) // Glow effect

// Neutrals
--white: #FFFFFF            // Pure white - text, icons
--white-80: rgba(255, 255, 255, 0.8)  // Primary text
--white-60: rgba(255, 255, 255, 0.6)  // Secondary text
--white-40: rgba(255, 255, 255, 0.4)  // Muted text

// Semantic Colors
--semantic-success: #22C55E
--semantic-warning: #F59E0B
--semantic-error: #EF4444
--semantic-info: #3B82F6
```

### Typography Scale
```
Display:   Geist Sans, 3rem-4rem, -0.02em tracking, 600-700 weight
Heading:   Geist Sans, 1.5rem-2rem, -0.01em tracking, 600 weight
Title:     Geist Sans, 1.125rem-1.25rem, normal, 500-600 weight
Body:      Geist Sans, 1rem, normal tracking, 400 weight
Caption:   Geist Sans, 0.75rem-0.875rem, normal, 400-500 weight
Mono:      Geist Mono, 0.875rem
```

### Spacing System (8px base)
```
xs: 4px   | sm: 8px   | md: 16px  | lg: 24px
xl: 32px  | 2xl: 48px | 3xl: 64px | 4xl: 96px
```

---

## Signature Elements

### 1. Glass Card
Translucent surface with frosted glass effect.

```tsx
<div className="
  bg-white/[0.05] backdrop-blur-xl
  border border-white/[0.08]
  rounded-2xl
  shadow-[0_8px_32px_rgba(0,0,0,0.3)]
  p-6
  relative
  before:absolute before:inset-x-0 before:top-0 before:h-px 
  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  before:rounded-t-2xl
">
  {children}
</div>
```

### 2. Primary Button (Electric)
Bold, rounded pill with electric glow.

```tsx
<button className="
  px-8 py-4
  bg-[#FFE500] text-[#0A0A0F]
  font-medium text-sm
  rounded-full
  shadow-[0_0_20px_rgba(255,229,0,0.3)]
  transition-all duration-300
  hover:shadow-[0_0_30px_rgba(255,229,0,0.5)]
  hover:scale-[1.02]
  active:scale-[0.98]
">
  Get Started
</button>
```

### 3. Secondary Button (Glass)
Glass outline button with subtle hover.

```tsx
<button className="
  px-8 py-4
  bg-white/[0.05] text-white backdrop-blur-md
  font-medium text-sm
  rounded-full
  border border-white/[0.15]
  transition-all duration-300
  hover:bg-white/[0.1] hover:border-white/[0.25]
  active:scale-[0.98]
">
  Learn More
</button>
```

### 4. Ghost Button
Minimal presence, appears on interaction.

```tsx
<button className="
  px-4 py-2
  text-white/70 text-sm font-medium
  rounded-xl
  transition-all duration-200
  hover:bg-white/[0.08] hover:text-white
">
  View All
</button>
```

### 5. Glass Input
Translucent input with electric focus state.

```tsx
<input className="
  w-full px-4 py-3
  bg-white/[0.05] backdrop-blur-md
  border border-white/[0.1]
  rounded-xl
  text-white placeholder-white/40
  transition-all duration-200
  focus:bg-white/[0.08]
  focus:border-[#FFE500]/50
  focus:ring-2 focus:ring-[#FFE500]/20
  focus:shadow-[0_0_16px_rgba(255,229,0,0.1)]
  focus:outline-none
" />
```

### 6. Progress Bar
Minimal with electric fill.

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-xs">
    <span className="text-white/50">Progress</span>
    <span className="text-white font-medium">2,450 / 3,000</span>
  </div>
  <div className="h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
    <div
      className="h-full bg-[#FFE500] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,229,0,0.5)]"
      style={{ width: '82%' }}
    />
  </div>
</div>
```

### 7. Glass Badge
Pill-shaped status indicator.

```tsx
{/* Default - Electric */}
<span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[#FFE500] text-[#0A0A0F] shadow-[0_0_12px_rgba(255,229,0,0.3)]">
  Active
</span>

{/* Secondary - Glass */}
<span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/[0.1] text-white/80 border border-white/[0.1] backdrop-blur-sm">
  Draft
</span>
```

### 8. Electric Glow Effects
Use sparingly for maximum impact.

```tsx
{/* Pulsing live indicator */}
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-pulse shadow-[0_0_8px_rgba(255,229,0,0.6)]" />
  <span className="text-xs font-medium text-[#FFE500]">Live</span>
</div>

{/* Active navigation indicator */}
<div className="w-1 h-6 bg-[#FFE500] rounded-full shadow-[0_0_10px_rgba(255,229,0,0.5)]" />
```

---

## Layout Patterns

### Hero Section
```tsx
<section className="relative min-h-[80vh] overflow-hidden">
  {/* Ambient background */}
  <div className="absolute inset-0">
    <Image src="/hero.jpg" fill className="object-cover opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/60 via-[#0A0A0F]/85 to-[#0A0A0F]" />
    {/* Electric glow orb */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFE500]/8 blur-[150px] rounded-full" />
  </div>

  {/* Content */}
  <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-[#FFE500] mb-4">
        Barbados Premier Skatepark
      </p>
      <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
        Skate. Ride.<br/>Repeat.
      </h1>
      <p className="text-lg text-white/60 mt-6 leading-relaxed max-w-lg">
        Digital passes, challenges, and community. Join the movement at Kaitif Skatepark.
      </p>
      <div className="flex gap-4 mt-10">
        <Button>Get Your Pass</Button>
        <Button variant="secondary">Explore</Button>
      </div>
    </div>
  </div>
</section>
```

### Dashboard Layout
```tsx
<div className="min-h-screen bg-[#0A0A0F]">
  {/* Glass Sidebar */}
  <aside className="fixed inset-y-0 left-0 w-64 bg-[#0A0A0F]/80 backdrop-blur-2xl border-r border-white/[0.08]">
    {/* Nav items with active indicator */}
  </aside>

  {/* Main Content */}
  <main className="pl-64 p-8">
    <div className="grid grid-cols-12 gap-6">
      {/* Cards with glass effect */}
    </div>
  </main>
</div>
```

### Glass Navigation Bar (Mobile)
```tsx
<nav className="fixed bottom-0 inset-x-0 bg-[#0A0A0F]/80 backdrop-blur-2xl border-t border-white/[0.08] pb-safe">
  {/* Top highlight line */}
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  
  <div className="flex items-center justify-evenly h-14 px-4">
    {/* Nav items */}
  </div>
</nav>
```

---

## Color Usage Guidelines

### When to Use Electric Yellow (#FFE500)
✅ **Do use for:**
- Primary CTA buttons
- Active navigation indicators
- Progress bars (filled portion)
- Important badges (live, new, featured)
- Focus states and glow effects
- Key metrics or achievements

❌ **Don't use for:**
- Large background areas
- Body text
- Secondary elements
- Everything - it loses impact when overused

### When to Use White/Opacity
- `text-white` - Headlines, important text
- `text-white/80` - Primary body text
- `text-white/60` - Secondary text, descriptions
- `text-white/40` - Muted text, placeholders
- `bg-white/5` - Glass surfaces
- `border-white/10` - Borders, dividers

---

## Animation Guidelines

### Principles
- **Subtle**: Enhance, don't distract
- **Smooth**: Use ease-out curves
- **Quick**: 150-300ms durations
- **Purposeful**: Every animation serves UX

### Electric Glow Animation
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 229, 0, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 229, 0, 0.5); }
}
```

### Hover Effects
```css
/* Card lift */
hover:-translate-y-0.5
hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]

/* Button scale */
hover:scale-[1.02]
active:scale-[0.98]

/* Glow intensify */
hover:shadow-[0_0_30px_rgba(255,229,0,0.5)]
```

### Timing
```css
--duration-fast: 150ms;
--duration-base: 300ms;
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

---

## Quality Checklist

- [ ] Deep background (#0A0A0F) with ambient gradients
- [ ] Glass surfaces with `backdrop-blur-xl` and white/5-12 backgrounds
- [ ] Electric yellow (#FFE500) used intentionally for accents
- [ ] Rounded corners: `rounded-xl` to `rounded-3xl`
- [ ] Soft shadows with blur
- [ ] Subtle white/10 borders on glass
- [ ] Inner highlight gradients on glass surfaces
- [ ] Clear typography hierarchy
- [ ] Generous whitespace
- [ ] Smooth 300ms transitions
- [ ] Electric glow on primary CTAs
- [ ] No harsh edges or brutalist elements

---

## Platform Notes

### Next.js Web (apps/web, apps/admin)
- Use next/font for Geist Sans + Geist Mono
- Server components for static content
- CSS transitions for micro-interactions
- Framer Motion for page transitions (optional)

### React Native (apps/mobile)
- NativeWind for Tailwind
- System fonts fallback
- Reanimated for smooth 60fps animations
- Use `BlurView` for glass effects (limited support)

---

## Detailed References

- **Design Tokens**: See [references/design-tokens.md](references/design-tokens.md)
- **Components**: See [references/components.md](references/components.md)
- **Layouts**: See [references/layouts.md](references/layouts.md)
- **Animations**: See [references/animations.md](references/animations.md)
- **Tailwind Config**: See apps/web/tailwind.config.js
