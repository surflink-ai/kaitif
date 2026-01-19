---
name: kaitif-ui
description: |
  **Kaitif Skatepark UI/UX Design System**: Generate premium professional sports interfaces with a moody Storm Cloud aesthetic - dark grays with electric yellow energy.
  - MANDATORY TRIGGERS: kaitif, skatepark, ui, ux, design, component, layout, page, screen, interface, frontend, styling
  - Covers: Next.js web app, React Native mobile, admin dashboard
  - Design tokens: storm cloud dark theme, electric yellow accent, moody sophistication
  - Use when building any visual component, page, screen, or UI element for the Kaitif ecosystem
---

# Kaitif UI/UX Design System

Generate premium professional sports interfaces with a moody **Storm Cloud** aesthetic.

## Design Philosophy

**Storm Cloud Aesthetic** - Dark, moody, electric. The tension before the storm meets explosive energy.

### Core Principles
1. **Moody Atmosphere** - Deep, layered grays create depth and drama
2. **Electric Energy** - Sharp yellow cuts through the darkness with purpose
3. **Athletic Authority** - Bold but controlled. Powerful but refined.
4. **Editorial Clarity** - Magazine-quality typography and spacing
5. **Confident Contrast** - Dark foundations with moments of electric brilliance

### Visual DNA
- **Surfaces**: Layered storm grays - dark to deeper, creating atmospheric depth
- **Accent**: Electric yellow (#FFE500) - the lightning strike, used with intent
- **White**: Pure white for text and critical UI elements
- **Typography**: Editorial quality. Strong hierarchy. Confident weight contrasts.
- **Space**: Generous whitespace. Let elements breathe.
- **Motion**: Smooth, confident, purposeful. Never flashy.

---

## Quick Reference

### Core Colors
```
// Storm Cloud Backgrounds (Layered Grays)
--bg-storm: #0A0A0B         // Deepest storm - primary background
--bg-cloud: #111113         // Cloud layer - cards, elevated surfaces
--bg-slate: #1A1A1D         // Slate - inputs, secondary surfaces
--bg-ash: #252529           // Ash - hover states, tertiary
--bg-steel: #35353A         // Steel - borders, dividers

// Electric Accent
--accent-electric: #FFE500  // Electric yellow - THE accent. Lightning strike.
--accent-electric-dim: #BFA900  // Dimmed yellow for subtle states

// Neutrals
--white: #FFFFFF            // Pure white - text, icons, key elements
--silver: #9A9AA0           // Silver gray - secondary text
--zinc: #5A5A62             // Zinc - tertiary text, captions
--graphite: #3A3A42         // Graphite - muted text, placeholders

// Semantic Colors
--semantic-success: #22C55E // Green - success states
--semantic-warning: #F59E0B // Amber - warnings (softer than electric)
--semantic-error: #EF4444   // Red - errors
--semantic-info: #3B82F6    // Blue - information
```

### Typography Scale
```
Display:   Plus Jakarta Sans / Satoshi, 4rem-6rem, -0.03em tracking, 700-800 weight
Headline:  Plus Jakarta Sans / Satoshi, 2rem-3rem, -0.02em tracking, 700 weight
Title:     Plus Jakarta Sans / Satoshi, 1.25rem-1.5rem, -0.01em, 600 weight
Body:      Inter / SF Pro, 1rem, normal tracking, 400-500 weight
Caption:   Inter / SF Pro, 0.75rem-0.875rem, 0.02em tracking, 500 weight, uppercase optional
Mono:      SF Mono / JetBrains Mono, 0.875rem
```

### Spacing System (8px base)
```
xs: 4px   | sm: 8px   | md: 16px  | lg: 24px
xl: 32px  | 2xl: 48px | 3xl: 64px | 4xl: 96px | 5xl: 128px
```

---

## Signature Elements

### 1. Premium Card
Storm cloud depth with subtle atmospheric layering.

```tsx
<div className="
  bg-[#111113] rounded-2xl
  border border-[#252529]
  shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]
  transition-all duration-300
  hover:border-[#35353A] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7)]
">
  <div className="p-6">
    {children}
  </div>
</div>
```

### 2. Primary Button (Electric)
The lightning strike - bold, confident, impossible to miss.

```tsx
<button className="
  px-8 py-4
  bg-[#FFE500] text-[#0A0A0B]
  font-semibold text-sm tracking-wide
  rounded-full
  transition-all duration-300
  hover:bg-[#FFF040] hover:scale-[1.02]
  hover:shadow-[0_0_24px_rgba(255,229,0,0.4)]
  active:scale-[0.98]
">
  Get Started
</button>
```

### 3. Secondary Button
Clean white outline - clear but doesn't compete with electric.

```tsx
<button className="
  px-8 py-4
  bg-transparent text-white
  font-semibold text-sm tracking-wide
  rounded-full
  border border-[#35353A]
  transition-all duration-300
  hover:bg-white/5 hover:border-[#5A5A62]
">
  Learn More
</button>
```

### 4. Ghost Button
Minimal presence, appears on interaction.

```tsx
<button className="
  px-6 py-3
  bg-transparent text-[#9A9AA0]
  font-medium text-sm
  rounded-lg
  transition-all duration-200
  hover:bg-white/5 hover:text-white
">
  View All
</button>
```

### 5. Stat Display
Editorial number presentation with electric accent option.

```tsx
{/* Standard stat */}
<div className="text-center">
  <div className="text-5xl font-display font-bold tracking-tight text-white">
    2,450
  </div>
  <div className="text-xs uppercase tracking-widest text-[#5A5A62] mt-2">
    Total XP
  </div>
</div>

{/* Electric highlighted stat */}
<div className="text-center">
  <div className="text-5xl font-display font-bold tracking-tight text-[#FFE500]">
    #1
  </div>
  <div className="text-xs uppercase tracking-widest text-[#5A5A62] mt-2">
    Current Rank
  </div>
</div>
```

### 6. Progress Bar
Clean with electric fill - energy charging up.

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-xs">
    <span className="text-[#5A5A62] uppercase tracking-wider">Progress</span>
    <span className="text-white font-medium">2,450 / 3,000</span>
  </div>
  <div className="h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
    <div
      className="h-full bg-[#FFE500] rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

### 7. Accent Highlights
Electric moments - use sparingly for maximum impact.

```tsx
{/* Live indicator */}
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-pulse shadow-[0_0_8px_rgba(255,229,0,0.6)]" />
  <span className="text-xs font-medium uppercase tracking-wider text-[#FFE500]">Live</span>
</div>

{/* Achievement badge */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFE500]/10 border border-[#FFE500]/20 rounded-full">
  <Trophy className="w-4 h-4 text-[#FFE500]" />
  <span className="text-xs font-medium text-[#FFE500]">Legend</span>
</div>

{/* Active tab indicator */}
<div className="h-0.5 w-full bg-[#FFE500] rounded-full" />
```

---

## Component Categories

### Core UI
| Component | Key Traits |
|-----------|-----------|
| **Buttons** | Rounded-full, electric primary, white secondary |
| **Cards** | Rounded-2xl, storm backgrounds, subtle borders |
| **Inputs** | Rounded-xl, slate backgrounds, electric focus ring |
| **Badges** | Pill shapes, muted or electric depending on importance |
| **Tabs** | Understated, electric active indicator |

### Feature Components
| Component | Key Traits |
|-----------|-----------|
| **Pass Card** | Premium feel, electric QR border glow option, clean info |
| **Challenge Card** | Image-forward, electric progress bar, difficulty dots |
| **Event Card** | Editorial layout, electric "LIVE" indicator, clean metadata |
| **Leaderboard Row** | Electric for #1, clean white for others, rank prominent |
| **Listing Card** | Product photography style, price in white, electric sale badge |

### Navigation
| Component | Key Traits |
|-----------|-----------|
| **Sidebar** | Clean icons, electric active indicator bar |
| **Bottom Nav** | Minimal icons, electric active state (icon or dot) |
| **Top Bar** | Logo (can have electric accent), search, white icons |

---

## Layout Patterns

### Hero Section
```tsx
<section className="relative min-h-[80vh] bg-[#0A0A0B] overflow-hidden">
  {/* Background - atmospheric gradient */}
  <div className="absolute inset-0">
    <Image src="/hero.jpg" fill className="object-cover opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/60 via-[#0A0A0B]/85 to-[#0A0A0B]" />
    {/* Optional: subtle electric glow at bottom */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFE500]/5 blur-[150px] rounded-full" />
  </div>

  {/* Content */}
  <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-widest text-[#FFE500] mb-4">
        Barbados Premier Skatepark
      </p>
      <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white leading-[1.1]">
        Skate. Ride.<br/>Repeat.
      </h1>
      <p className="text-lg text-[#9A9AA0] mt-6 leading-relaxed max-w-lg">
        Digital passes, challenges, and community. Join the movement at Kaitif Skatepark.
      </p>
      <div className="flex gap-4 mt-10">
        <ButtonPrimary>Get Your Pass</ButtonPrimary>
        <ButtonSecondary>Explore</ButtonSecondary>
      </div>
    </div>
  </div>
</section>
```

### Dashboard Grid
```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Stats row - electric highlight on key stat */}
  <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard label="Total XP" value="2,450" />
    <StatCard label="Level" value="12" highlight />
    <StatCard label="Streak" value="5 days" />
    <StatCard label="Rank" value="#24" />
  </div>

  {/* Main content */}
  <div className="col-span-12 lg:col-span-8 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Your Pass</CardTitle>
      </CardHeader>
      <CardContent>
        <PassDisplay />
      </CardContent>
    </Card>
  </div>

  {/* Sidebar */}
  <div className="col-span-12 lg:col-span-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <LeaderboardPreview />
      </CardContent>
    </Card>
  </div>
</div>
```

### Section Layout
```tsx
<section className="py-24">
  <div className="container mx-auto px-6">
    {/* Section header */}
    <div className="flex items-end justify-between mb-12">
      <div>
        <p className="text-sm uppercase tracking-widest text-[#FFE500] mb-2">
          Featured
        </p>
        <h2 className="text-3xl font-display font-bold text-white">
          Upcoming Events
        </h2>
      </div>
      <Link href="/events" className="text-sm font-medium text-[#9A9AA0] hover:text-white transition-colors">
        View All →
      </Link>
    </div>

    {/* Content grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
</section>
```

---

## Color Usage Guidelines

### When to Use Electric Yellow (#FFE500)
✅ **Do use for:**
- Primary CTA buttons
- Live/active indicators
- Progress bars (filled portion)
- Active tab indicators
- Important badges (featured, new, live)
- Key metrics or achievements
- Section overlines/labels that need emphasis
- Interactive focus states

❌ **Don't use for:**
- Large background areas
- Body text
- Secondary elements
- Everything - it loses impact when overused

### When to Use White (#FFFFFF)
- Primary headlines and titles
- Body text
- Icons
- Secondary buttons (outline)
- Important UI elements
- Stat values

### Gray Scale Usage
- `#0A0A0B` - Page backgrounds
- `#111113` - Cards, modals, elevated surfaces
- `#1A1A1D` - Input backgrounds, wells
- `#252529` - Borders, dividers (default)
- `#35353A` - Borders (hover), stronger dividers
- `#5A5A62` - Captions, labels, placeholders
- `#9A9AA0` - Secondary text, descriptions

---

## Animation Guidelines

### Principles
- **Purposeful**: Every animation serves a function
- **Subtle**: Enhance, don't distract
- **Smooth**: Use ease-out curves for natural feel
- **Quick**: Keep durations short (150-300ms)

### Electric Glow Effect
```css
/* Hover glow for electric elements */
box-shadow: 0 0 24px rgba(255, 229, 0, 0.4);
transition: box-shadow 0.3s ease;

/* Pulsing glow for live indicators */
@keyframes electric-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 229, 0, 0.6); }
  50% { box-shadow: 0 0 16px rgba(255, 229, 0, 0.8); }
}
```

### Micro-interactions
```css
/* Hover lift */
transform: translateY(-2px);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Button scale */
hover: scale(1.02)
active: scale(0.98)

/* Fade in */
opacity: 0 → 1
transform: translateY(8px) → translateY(0)
duration: 0.3s
```

### Timing
```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

---

## Platform Notes

### Next.js Web (apps/web, apps/admin)
- Use next/font for Plus Jakarta Sans + Inter
- Server components for static content
- Framer Motion for page transitions (subtle)
- CSS native animations for micro-interactions

### React Native (apps/mobile)
- NativeWind for Tailwind
- System fonts fallback (SF Pro / Roboto)
- Reanimated for smooth 60fps animations
- Avoid heavy shadows & glows (performance)

---

## Quality Checklist

- [ ] Storm black (#0A0A0B) for primary backgrounds
- [ ] Electric yellow (#FFE500) as THE accent - used intentionally
- [ ] White for text, icons, and secondary buttons
- [ ] Electric used sparingly for maximum impact
- [ ] Rounded-2xl for cards, rounded-full for buttons
- [ ] Subtle shadows with atmospheric depth
- [ ] Clear typography hierarchy (white headlines, gray body)
- [ ] Generous whitespace
- [ ] Smooth, subtle animations
- [ ] Electric glow effects on hover for primary CTAs
- [ ] No unnecessary decoration or visual noise

---

## Detailed References

- **Design Tokens**: See [references/design-tokens.md](references/design-tokens.md)
- **Components**: See [references/components.md](references/components.md)
- **Layouts**: See [references/layouts.md](references/layouts.md)
- **Animations**: See [references/animations.md](references/animations.md)
- **Tailwind Config**: Copy [assets/tailwind-preset.js](assets/tailwind-preset.js)
