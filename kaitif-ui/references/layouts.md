# Kaitif Layout Patterns

Page layouts and structural patterns for the three distinct Kaitif interfaces.

**Storm Cloud Aesthetic** - Dark, moody grays with electric yellow energy.

---

## Overview: Three Distinct Experiences

Kaitif has three separate UI contexts, each with its own purpose and audience:

| Interface | Purpose | Tone | Key Traits |
|-----------|---------|------|------------|
| **Landing Page** | Marketing, conversion | Aspirational, dramatic | Full-bleed imagery, editorial typography, cinematic |
| **User App** | Daily engagement | Energetic, personal | Compact cards, gamification, electric accents |
| **Admin Dashboard** | Park operations | Functional, efficient | Data tables, forms, quick actions, utilitarian |

---

# 1. Landing Page (Marketing)

**Audience:** Prospective visitors, public
**Goal:** Inspire, inform, convert
**Tone:** Premium sports brand, dramatic atmosphere

### Design Principles
- **Cinematic** - Full-bleed hero images, dramatic overlays
- **Editorial** - Magazine-quality typography, generous whitespace
- **Electric Moments** - Yellow accent for CTAs and key elements
- **Clean** - Minimal UI, let content breathe

### Color Palette Adjustments
```
Landing pages lean into drama:
- More pure black (#000000) backgrounds for contrast
- Dramatic image overlays
- White text dominates
- Electric yellow (#FFE500) for primary CTAs
- Optional subtle electric glow effects
```

### Landing Page Shell

```tsx
export function LandingShell({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <LandingNav />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### Hero Section (Cinematic)

```tsx
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-skater.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dramatic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Optional: subtle electric glow */}
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#FFE500]/5 blur-[150px] rounded-full" />
      </div>

      {/* Content - left aligned, editorial */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-2xl">
          {/* Electric overline */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFE500] mb-6">
            Barbados Premier Skatepark
          </p>

          {/* Hero headline - massive, tight */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.03em] text-white leading-[0.95]">
            Skate.<br />Ride.<br />Repeat.
          </h1>

          {/* Subhead */}
          <p className="text-xl text-[#9A9AA0] mt-8 leading-relaxed max-w-md">
            Digital passes. Community challenges. The future of skating in the Caribbean.
          </p>

          {/* CTAs - electric primary */}
          <div className="flex gap-4 mt-12">
            <Button size="lg" className="px-10">
              Get Your Pass
            </Button>
            <ButtonSecondary size="lg">
              Explore
            </ButtonSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Feature Grid (Editorial)

```tsx
export function FeaturesSection() {
  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-xl mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFE500] mb-4">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white">
            Everything you need to ride
          </h2>
        </div>

        {/* Features - asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "p-8 border border-[#1A1A1D] rounded-2xl",
                "hover:border-[#FFE500]/20 transition-colors",
                i === 0 && "lg:col-span-2 lg:row-span-2 p-12" // Featured item
              )}
            >
              <feature.icon className="w-8 h-8 text-[#FFE500] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-[#5A5A62] text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Split Content Section

```tsx
export function ContentSection({ image, reverse = false }) {
  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
          reverse && "lg:[&>*:first-child]:order-2"
        )}>
          {/* Content */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFE500] mb-4">
              About the Park
            </p>
            <h2 className="text-4xl font-bold tracking-[-0.02em] text-white mb-8">
              World-class facilities in the Caribbean
            </h2>
            <p className="text-xl text-[#9A9AA0] leading-relaxed mb-8">
              Built in 2019 with a $1.4M investment, Kaitif Skatepark brings professional-grade skating to Barbados.
            </p>
            <Button>Plan Your Visit</Button>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={image} alt="" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

# 2. User App (Customer Dashboard)

**Audience:** Registered users, skaters
**Goal:** Engagement, gamification, community
**Tone:** Personal, energetic, rewarding

### Design Principles
- **Personal** - User-centric, their stats front and center
- **Gamified** - Progress bars, XP, levels, achievements with electric accents
- **Social** - Avatars, leaderboards, community activity
- **Efficient** - Quick access to passes, events, challenges

### Color Palette Adjustments
```
User app uses the full Storm Cloud palette:
- Rich storm black (#0A0A0B) primary background
- Cloud (#111113) for cards
- Electric yellow (#FFE500) for progress, achievements, active states
- White for text and secondary buttons
- Semantic colors for status
```

### App Shell (Authenticated)

```tsx
export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Desktop */}
      <div className="hidden lg:flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <MobileHeader />
        <main className="pb-20 p-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
```

### User Dashboard (Home)

```tsx
export function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome + Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-[#5A5A62]">Level {user.level} • {user.xp.toLocaleString()} XP</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="electric">{user.streak} day streak</Badge>
          <Badge>Rank #{user.rank}</Badge>
        </div>
      </div>

      {/* Progress to next level - electric progress bar */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#5A5A62]">Progress to Level {user.level + 1}</span>
          <span className="text-sm font-medium text-[#FFE500]">{user.xpToNextLevel} XP needed</span>
        </div>
        <ProgressBar value={user.xpProgress} max={100} showLabel={false} />
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pass */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Your Pass</CardTitle>
              <Link href="/passes" className="text-sm text-[#5A5A62] hover:text-[#FFE500]">
                Manage
              </Link>
            </CardHeader>
            <CardContent>
              <PassCardCompact pass={user.activePass} />
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Link href="/events" className="text-sm text-[#5A5A62] hover:text-white">
                View All →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map(event => (
                  <EventRowCompact key={event.id} event={event} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Challenges</CardTitle>
              <Badge variant="electric">{activeChallenges.length} Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeChallenges.slice(0, 3).map(challenge => (
                  <ChallengeRowCompact key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Leaderboard</CardTitle>
              <Link href="/leaderboard" className="text-sm text-[#5A5A62] hover:text-white">
                Full Board →
              </Link>
            </CardHeader>
            <CardContent>
              <LeaderboardPreview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### List View (Events, Challenges, Marketplace)

```tsx
export function ListPageLayout({ title, filters, children }) {
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-3">
          {filters}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}
```

---

# 3. Admin Dashboard (Park Operations)

**Audience:** Park staff, administrators
**Goal:** Efficiency, oversight, management
**Tone:** Functional, professional, data-driven

### Design Principles
- **Utilitarian** - Function over form
- **Dense** - More information per screen
- **Actionable** - Clear CTAs, quick operations
- **Data-first** - Tables, charts, metrics prominent

### Color Palette Adjustments
```
Admin uses a more subdued palette:
- Same backgrounds (#0A0A0B, #111113)
- Less electric yellow - use white/secondary buttons more
- More use of subtle borders for table/form structure
- Status colors for operational states
- Electric only for critical actions or alerts
```

### Admin Shell

```tsx
export function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-6 bg-[#0A0A0B]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

### Admin Overview Dashboard

```tsx
export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#5A5A62]">Park operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ]}
            className="w-40"
          />
          <ButtonSecondary>
            <Download className="w-4 h-4 mr-2" />
            Export
          </ButtonSecondary>
        </div>
      </div>

      {/* Key Metrics - 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Today's Check-ins"
          value="147"
          change="+23% vs yesterday"
        />
        <StatsCard
          label="Active Passes"
          value="1,234"
        />
        <StatsCard
          label="Revenue (Today)"
          value="$892"
          change="+12%"
          highlight
        />
        <StatsCard
          label="Pending Waivers"
          value="8"
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Check-ins (Last 7 Days)</h3>
          </div>
          <CheckInsChart />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Pass Sales</h3>
          </div>
          <SalesChart />
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Check-ins */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Check-ins</CardTitle>
            <Link href="/admin/checkins" className="text-sm text-[#5A5A62] hover:text-white">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <RecentCheckinsTable />
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Pending Actions</CardTitle>
            <Badge variant="warning">8 items</Badge>
          </CardHeader>
          <CardContent>
            <PendingActionsList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Admin Table Layout

```tsx
export function AdminTablePage({ title, description, actions, children }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-[#5A5A62] mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput placeholder="Search..." className="w-64" />
          <Select
            options={statusOptions}
            placeholder="Status"
            className="w-32"
          />
          <Select
            options={dateOptions}
            placeholder="Date"
            className="w-32"
          />
          <ButtonGhost>Reset Filters</ButtonGhost>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {children}
      </Card>
    </div>
  );
}
```

### Admin Data Table

```tsx
export function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#252529]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#5A5A62]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#252529]">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-[#1A1A1D] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-white">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Admin Form Layout

```tsx
export function AdminFormPage({ title, description, onSubmit, children }) {
  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-[#5A5A62] mt-1">{description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit}>
        <Card className="divide-y divide-[#252529]">
          {children}
        </Card>
      </form>
    </div>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="font-medium text-white">{title}</h3>
        {description && (
          <p className="text-sm text-[#5A5A62] mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
```

---

## Summary: Visual Differentiation

| Element | Landing Page | User App | Admin Dashboard |
|---------|-------------|----------|-----------------|
| **Background** | Pure black (#000) | Storm black (#0A0A0B) | Storm black (#0A0A0B) |
| **Primary CTA** | Electric yellow | Electric yellow | White/Secondary |
| **Typography** | Editorial, large | Standard, medium | Dense, small |
| **Imagery** | Full-bleed, cinematic | Thumbnails, avatars | Minimal, charts |
| **Whitespace** | Generous | Moderate | Compact |
| **Cards** | Minimal borders | Standard borders | Visible borders |
| **Electric Usage** | CTAs, overlines | Progress, badges, active | Alerts, critical only |
| **Data** | Stats only | Gamification | Tables, forms |
| **Navigation** | Minimal header | Sidebar + bottom nav | Full sidebar |
