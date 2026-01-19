# Kaitif Component Library

Complete component patterns for the Kaitif Skatepark UI - **Storm Cloud Aesthetic**.

Dark, moody grays with electric yellow energy.

---

## Design Principles

Before implementing any component, remember:
- **Restraint** - Less is more. Avoid decoration for its own sake.
- **Hierarchy** - Clear visual weight distribution.
- **Electric Intentionality** - Yellow accent used sparingly for maximum impact.
- **Quality** - Every pixel should feel intentional.

---

## Buttons

### Primary Button (Electric)
The lightning strike - bold, confident, impossible to miss.

```tsx
export function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-4",
        "bg-[#FFE500] text-[#0A0A0B]",
        "text-sm font-semibold tracking-wide",
        "rounded-full",
        "transition-all duration-300",
        "hover:bg-[#FFF040] hover:scale-[1.02]",
        "hover:shadow-[0_0_24px_rgba(255,229,0,0.4)]",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Secondary Button
Clean white outline - clear but doesn't compete with electric.

```tsx
export function ButtonSecondary({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-4",
        "bg-transparent text-white",
        "text-sm font-semibold tracking-wide",
        "rounded-full",
        "border border-[#35353A]",
        "transition-all duration-300",
        "hover:bg-white/5 hover:border-[#5A5A62]",
        "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Ghost Button
Minimal text-style button.

```tsx
export function ButtonGhost({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2",
        "text-[#9A9AA0] text-sm font-medium",
        "transition-colors duration-200",
        "hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Icon Button
For icon-only actions.

```tsx
export function ButtonIcon({ icon: Icon, className, ...props }) {
  return (
    <button
      className={cn(
        "p-3 rounded-xl",
        "text-[#5A5A62]",
        "transition-all duration-200",
        "hover:text-white hover:bg-white/5",
        "active:scale-95",
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
```

### Danger Button
For destructive actions - use sparingly.

```tsx
export function ButtonDanger({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-8 py-4",
        "bg-[#EF4444] text-white",
        "text-sm font-semibold tracking-wide",
        "rounded-full",
        "transition-all duration-300",
        "hover:bg-[#DC2626] hover:scale-[1.02]",
        "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Cards

### Base Card
Storm cloud card with subtle border.

```tsx
export function Card({ children, className }) {
  return (
    <div
      className={cn(
        "bg-[#111113] rounded-2xl",
        "border border-[#252529]",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn("px-6 pt-6 pb-0", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn("text-lg font-semibold text-white", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}
```

### Interactive Card
Card with hover state for clickable items.

```tsx
export function CardInteractive({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#111113] rounded-2xl cursor-pointer",
        "border border-[#252529]",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]",
        "transition-all duration-300",
        "hover:border-[#35353A]",
        "hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7)]",
        "hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Stats Card
For displaying key metrics with optional electric highlight.

```tsx
export function StatsCard({ label, value, change, highlight = false }) {
  const isPositive = change?.startsWith('+');

  return (
    <Card className="p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-[#5A5A62] mb-2">
        {label}
      </p>
      <p className={cn(
        "text-4xl font-bold tracking-tight",
        highlight ? "text-[#FFE500]" : "text-white"
      )}>
        {value}
      </p>
      {change && (
        <p className={cn(
          "text-sm mt-2",
          isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
        )}>
          {change}
        </p>
      )}
    </Card>
  );
}
```

---

## Inputs & Forms

### Text Input
Clean input with electric focus state.

```tsx
export function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#9A9AA0]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3",
          "bg-[#1A1A1D] rounded-xl",
          "border border-[#252529]",
          "text-white placeholder-[#3A3A42]",
          "transition-all duration-200",
          "focus:outline-none focus:border-[#FFE500] focus:ring-1 focus:ring-[#FFE500]",
          error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
```

### Search Input
Search bar with icon.

```tsx
export function SearchInput({ placeholder = "Search...", className, ...props }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3A3A42]" />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "w-full pl-12 pr-4 py-3",
          "bg-[#1A1A1D] rounded-full",
          "border border-[#252529]",
          "text-white placeholder-[#3A3A42]",
          "transition-all duration-200",
          "focus:outline-none focus:border-[#5A5A62]",
          className
        )}
        {...props}
      />
    </div>
  );
}
```

### Select
Dropdown with custom styling.

```tsx
export function Select({ label, options, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#9A9AA0]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full px-4 py-3 appearance-none",
            "bg-[#1A1A1D] rounded-xl",
            "border border-[#252529]",
            "text-white",
            "transition-all duration-200",
            "focus:outline-none focus:border-[#FFE500]",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A62] pointer-events-none" />
      </div>
    </div>
  );
}
```

### Checkbox
Checkbox with electric checked state.

```tsx
export function Checkbox({ label, checked, onChange, className }) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer", className)}>
      <div
        className={cn(
          "w-5 h-5 rounded-md border transition-all duration-200",
          "flex items-center justify-center",
          checked
            ? "bg-[#FFE500] border-[#FFE500]"
            : "bg-transparent border-[#35353A] hover:border-[#5A5A62]"
        )}
      >
        {checked && <Check className="w-3 h-3 text-[#0A0A0B]" />}
      </div>
      <span className="text-[#9A9AA0]">{label}</span>
    </label>
  );
}
```

---

## Badges & Tags

### Badge
Pill-shaped status indicator.

```tsx
export function Badge({ variant = "default", children }) {
  const variants = {
    default: "bg-[#252529] text-[#9A9AA0]",
    success: "bg-[#22C55E]/15 text-[#22C55E]",
    warning: "bg-[#F59E0B]/15 text-[#F59E0B]",
    error: "bg-[#EF4444]/15 text-[#EF4444]",
    electric: "bg-[#FFE500]/15 text-[#FFE500]",
    live: "bg-[#FFE500] text-[#0A0A0B]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1",
        "text-xs font-medium",
        "rounded-full",
        variants[variant]
      )}
    >
      {variant === "live" && (
        <span className="w-1.5 h-1.5 bg-[#0A0A0B] rounded-full mr-2 animate-pulse" />
      )}
      {children}
    </span>
  );
}
```

### Points Badge
For XP and points display with electric styling.

```tsx
export function PointsBadge({ amount, label = "XP" }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE500]/10 border border-[#FFE500]/20 rounded-full">
      <span className="text-xs font-semibold text-[#FFE500]">+{amount}</span>
      <span className="text-xs text-[#FFE500]/70">{label}</span>
    </span>
  );
}
```

### Tier Badge
For achievement tiers.

```tsx
export function TierBadge({ tier }) {
  const styles = {
    bronze: "bg-[#CD7F32]/10 text-[#CD7F32] border-[#CD7F32]/20",
    silver: "bg-[#8A8A8A]/10 text-[#8A8A8A] border-[#8A8A8A]/20",
    gold: "bg-[#FFE500]/10 text-[#FFE500] border-[#FFE500]/20",
    platinum: "bg-[#E5E4E2]/10 text-[#E5E4E2] border-[#E5E4E2]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1",
        "text-xs font-semibold uppercase tracking-wider",
        "rounded-full border",
        styles[tier]
      )}
    >
      {tier}
    </span>
  );
}
```

---

## Navigation

### Sidebar
Desktop navigation with electric active indicator.

```tsx
export function Sidebar({ items, activeId }) {
  return (
    <aside className="w-64 bg-[#0A0A0B] border-r border-[#252529] h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Logo className="h-8" />
      </div>

      {/* Nav Items */}
      <nav className="px-3 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl relative",
              "transition-all duration-200",
              activeId === item.id
                ? "bg-[#FFE500]/10 text-[#FFE500]"
                : "text-[#5A5A62] hover:text-white hover:bg-white/5"
            )}
          >
            {activeId === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFE500] rounded-r-full" />
            )}
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### Bottom Navigation
Mobile navigation bar with electric active state.

```tsx
export function BottomNav({ items, activeId }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0B]/95 backdrop-blur-lg border-t border-[#252529] z-50 pb-safe">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 min-w-[64px]",
              "transition-colors duration-200",
              activeId === item.id ? "text-[#FFE500]" : "text-[#3A3A42]"
            )}
          >
            <item.icon className="w-6 h-6" />
            {item.label && (
              <span className="text-[10px] font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

### Header
Top navigation bar.

```tsx
export function Header({ user }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-lg border-b border-[#252529]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo (mobile) */}
        <Logo className="h-6 lg:hidden" />

        {/* Search (desktop) */}
        <div className="hidden lg:block flex-1 max-w-md">
          <SearchInput placeholder="Search..." />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ButtonIcon icon={Search} className="lg:hidden" />
          <ButtonIcon icon={Bell} />
          <Avatar src={user.avatar} size="sm" />
        </div>
      </div>
    </header>
  );
}
```

### Tabs
Tab navigation with electric active state.

```tsx
export function Tabs({ tabs, activeId, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-[#111113] rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg",
            "transition-all duration-200",
            activeId === tab.id
              ? "bg-[#FFE500] text-[#0A0A0B]"
              : "text-[#5A5A62] hover:text-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Data Display

### Avatar
User avatar.

```tsx
export function Avatar({ src, alt, size = "md" }) {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        sizes[size],
        "rounded-full object-cover border-2 border-[#252529]"
      )}
    />
  );
}
```

### Progress Bar
Minimal progress indicator with electric fill.

```tsx
export function ProgressBar({ value, max, showLabel = true }) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-[#5A5A62]">{value.toLocaleString()} / {max.toLocaleString()}</span>
          <span className="text-white font-medium">{percentage}%</span>
        </div>
      )}
      <div className="h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFE500] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

### Leaderboard Row
Single leaderboard entry with electric #1 highlight.

```tsx
export function LeaderboardRow({ rank, user, points }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {/* Rank */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
          rank === 1 && "bg-[#FFE500] text-[#0A0A0B]",
          rank === 2 && "bg-[#8A8A8A] text-[#0A0A0B]",
          rank === 3 && "bg-[#CD7F32] text-white",
          rank > 3 && "text-[#5A5A62]"
        )}
      >
        {rank}
      </div>

      {/* User */}
      <Avatar src={user.avatar} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{user.name}</p>
        <p className="text-xs text-[#5A5A62]">Level {user.level}</p>
      </div>

      {/* Points */}
      <p className={cn(
        "font-semibold tabular-nums",
        rank === 1 ? "text-[#FFE500]" : "text-white"
      )}>
        {points.toLocaleString()}
      </p>
    </div>
  );
}
```

---

## Feature Components

### Pass Card
Digital park pass display.

```tsx
export function PassCard({ pass }) {
  const daysLeft = Math.ceil((new Date(pass.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7;

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#5A5A62] mb-1">
              Park Pass
            </p>
            <h3 className="text-2xl font-bold text-white">{pass.type}</h3>
          </div>
          <Badge variant={isExpiring ? "warning" : "success"}>
            {daysLeft} days left
          </Badge>
        </div>

        {/* QR Code with electric border */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white rounded-xl ring-2 ring-[#FFE500]/20">
            <QRCode value={pass.barcodeId} size={140} />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#5A5A62] mb-1">Pass ID</p>
            <p className="font-mono text-white">{pass.barcodeId.slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#5A5A62] mb-1">Valid Until</p>
            <p className="text-white">{format(new Date(pass.expiresAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="px-6 pb-6">
        <ButtonSecondary className="w-full justify-center">
          Add to Wallet
        </ButtonSecondary>
      </div>
    </Card>
  );
}
```

### Challenge Card
Trick challenge display with electric progress.

```tsx
export function ChallengeCard({ challenge }) {
  return (
    <CardInteractive className="overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={challenge.thumbnail}
          alt={challenge.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#FFE500] flex items-center justify-center">
            <Play className="w-6 h-6 text-[#0A0A0B] ml-1" />
          </div>
        </div>

        {/* Points */}
        <div className="absolute top-4 right-4">
          <PointsBadge amount={challenge.xpReward} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Difficulty - electric dots for filled */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full",
                  i <= challenge.difficulty ? "bg-[#FFE500]" : "bg-[#252529]"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-[#5A5A62] uppercase tracking-wider">
            {challenge.difficultyLevel}
          </span>
        </div>

        <h3 className="font-semibold text-white mb-1">{challenge.name}</h3>
        <p className="text-sm text-[#5A5A62] line-clamp-2">{challenge.description}</p>

        {/* Completions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#252529]">
          <Users className="w-4 h-4 text-[#5A5A62]" />
          <span className="text-xs text-[#5A5A62]">
            {challenge.completions.toLocaleString()} completions
          </span>
        </div>
      </div>
    </CardInteractive>
  );
}
```

### Event Card
Event display with electric live indicator.

```tsx
export function EventCard({ event }) {
  const isLive = event.status === 'live';

  return (
    <CardInteractive className="overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />

        {/* Date */}
        <div className="absolute bottom-4 left-4">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[#5A5A62]">
              {format(new Date(event.date), 'MMM')}
            </p>
            <p className="text-3xl font-bold text-white leading-none">
              {format(new Date(event.date), 'd')}
            </p>
          </div>
        </div>

        {/* Live badge - electric */}
        {isLive && (
          <div className="absolute top-4 right-4">
            <Badge variant="live">Live</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <Badge className="mb-3">{event.category}</Badge>
        <h3 className="font-semibold text-white mb-2">{event.title}</h3>

        {/* Attendees */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#252529]">
          <div className="flex -space-x-2">
            {event.attendees.slice(0, 4).map((attendee, i) => (
              <Avatar key={i} src={attendee.avatar} size="xs" />
            ))}
            {event.attendees.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-[#252529] flex items-center justify-center text-xs text-[#5A5A62]">
                +{event.attendees.length - 4}
              </div>
            )}
          </div>
          <PointsBadge amount={event.xpReward} />
        </div>
      </div>
    </CardInteractive>
  );
}
```

### Listing Card
Marketplace item with electric sale badge.

```tsx
export function ListingCard({ listing }) {
  return (
    <CardInteractive className="overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square">
        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />

        {/* Condition */}
        <div className="absolute top-3 left-3">
          <Badge>{listing.condition.replace('_', ' ')}</Badge>
        </div>

        {/* Sale badge - electric */}
        {listing.onSale && (
          <div className="absolute top-3 right-12">
            <Badge variant="electric">Sale</Badge>
          </div>
        )}

        {/* Favorite */}
        <button className="absolute top-3 right-3 p-2 bg-[#0A0A0B]/50 backdrop-blur-sm rounded-full hover:bg-[#0A0A0B]/80 transition-colors">
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-[#5A5A62] mb-1">{listing.category}</p>
        <h3 className="font-semibold text-white mb-2 line-clamp-1">{listing.title}</h3>

        <p className="text-2xl font-bold text-white">
          ${listing.price.toFixed(2)}
        </p>

        {/* Seller */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#252529]">
          <Avatar src={listing.seller.avatar} size="xs" />
          <span className="text-sm text-[#5A5A62] flex-1">{listing.seller.name}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[#FFE500] fill-current" />
            <span className="text-sm text-white">{listing.seller.rating}</span>
          </div>
        </div>
      </div>
    </CardInteractive>
  );
}
```

---

## Feedback & Overlays

### Toast
Notification toast.

```tsx
export function Toast({ type = "info", message, onClose }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "text-[#22C55E]",
    error: "text-[#EF4444]",
    warning: "text-[#F59E0B]",
    info: "text-[#3B82F6]",
  };

  const Icon = icons[type];

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#111113] border border-[#252529] rounded-xl shadow-xl">
      <Icon className={cn("w-5 h-5", colors[type])} />
      <p className="flex-1 text-sm text-white">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
        <X className="w-4 h-4 text-[#5A5A62]" />
      </button>
    </div>
  );
}
```

### Modal
Dialog overlay.

```tsx
export function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-lg bg-[#111113] rounded-2xl border border-[#252529] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#252529]">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <ButtonIcon icon={X} onClick={onClose} />
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-3 p-6 border-t border-[#252529]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Skeleton
Loading placeholder.

```tsx
export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "bg-[#252529] rounded-lg animate-pulse",
        className
      )}
    />
  );
}
```

### Empty State
No content placeholder.

```tsx
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1D] flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-[#3A3A42]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#5A5A62] max-w-sm mb-8">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```
