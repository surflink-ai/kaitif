# Kaitif Animation Guidelines

Motion and animation patterns for the Kaitif Skatepark UI.

---

## Philosophy

Animation in a professional sports brand should feel:
- **Purposeful** - Every animation serves a function
- **Confident** - Smooth, decisive movements
- **Subtle** - Enhance without distracting
- **Fast** - Don't keep users waiting

### Don'ts
- No bouncy/playful animations (too casual)
- No flashy effects (distracting)
- No slow transitions (feels sluggish)
- No excessive motion (accessibility concerns)

---

## Timing & Easing

### Duration Scale
| Token | Duration | Use Case |
|-------|----------|----------|
| `fast` | 150ms | Micro-interactions, button states |
| `base` | 300ms | Most transitions, page elements |
| `slow` | 500ms | Page transitions, modals |

### Easing Functions
```css
/* Default - smooth deceleration */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* For elements entering */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* For elements with both enter/exit */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Standard Material-style ease */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

### Tailwind Classes
```tsx
// Fast transition
className="transition-all duration-150"

// Base transition
className="transition-all duration-300"

// Slow transition
className="transition-all duration-500"

// With custom easing
className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
```

---

## Micro-interactions

### Button Hover
Subtle scale and background change.

```tsx
// Primary button
className="
  transition-all duration-300
  hover:bg-[#F5F5F5] hover:scale-[1.02]
  active:scale-[0.98]
"

// Secondary button
className="
  transition-all duration-300
  hover:bg-white/5 hover:border-[#666666]
  active:scale-[0.98]
"

// Icon button
className="
  transition-all duration-200
  hover:text-white hover:bg-white/5
  active:scale-95
"
```

### Card Hover
Lift effect with border highlight.

```tsx
className="
  transition-all duration-300
  hover:border-[#3D3D3D]
  hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.6)]
  hover:-translate-y-1
"
```

### Input Focus
Border and ring transition.

```tsx
className="
  transition-all duration-200
  focus:outline-none focus:border-[#666666] focus:ring-1 focus:ring-[#666666]
"
```

### Link Hover
Simple color transition.

```tsx
className="
  transition-colors duration-200
  hover:text-white
"
```

---

## Page Transitions

Using Framer Motion for page-level animations.

### Fade Up (Default)
Standard page enter animation.

```tsx
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Usage
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="enter"
  exit="exit"
>
  {children}
</motion.div>
```

### Stagger Children
For lists and grids.

```tsx
const containerVariants = {
  enter: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Usage
<motion.div variants={containerVariants} initial="initial" animate="enter">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card item={item} />
    </motion.div>
  ))}
</motion.div>
```

---

## Component Animations

### Modal
Fade backdrop + scale content.

```tsx
// Backdrop
const backdropVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

// Content
const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};
```

### Toast Notification
Slide in from edge.

```tsx
const toastVariants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};
```

### Dropdown Menu
Fade + slight scale.

```tsx
const dropdownVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: -4,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: {
      duration: 0.1,
    },
  },
};
```

### Sidebar (Mobile)
Slide from left with overlay.

```tsx
const sidebarVariants = {
  initial: { x: "-100%" },
  enter: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: 0.2,
    },
  },
};
```

---

## Loading States

### Skeleton Pulse
Simple opacity animation.

```tsx
// CSS animation
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Tailwind
className="animate-pulse bg-[#2A2A2A]"
```

### Spinner
Simple rotation.

```tsx
// CSS
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Component
export function Spinner({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        sizes[size],
        "border-2 border-[#2A2A2A] border-t-white rounded-full animate-spin"
      )}
    />
  );
}
```

### Progress Bar
Width transition.

```tsx
<div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
  <div
    className="h-full bg-white rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Button Loading
Replace content with spinner.

```tsx
export function Button({ loading, children, ...props }) {
  return (
    <button disabled={loading} {...props}>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        children
      )}
    </button>
  );
}
```

---

## Scroll Animations

### Fade In On Scroll
Using Intersection Observer or Framer Motion's `whileInView`.

```tsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

### Parallax (Landing Page Only)
Subtle depth effect on scroll.

```tsx
// Use sparingly, only on landing page hero
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 100]);

<motion.div style={{ y }}>
  <Image src="/hero-bg.jpg" ... />
</motion.div>
```

---

## Gesture Animations

### Tap Feedback (Mobile)
Scale down on tap.

```tsx
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.1 }}
>
  {children}
</motion.button>
```

### Swipe to Dismiss
For cards and notifications.

```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x > 100) {
      onDismiss();
    }
  }}
>
  {children}
</motion.div>
```

---

## React Native (Mobile App)

### Reanimated Basics
```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Spring animation
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// On press
scale.value = withSpring(0.95, { damping: 15 });

// On release
scale.value = withSpring(1, { damping: 15 });
```

### Timing Configuration
```tsx
// Fast micro-interaction
withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) })

// Standard transition
withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })

// Spring for interactive elements
withSpring(1, { damping: 15, stiffness: 150 })
```

---

## Accessibility

### Reduced Motion
Always respect user preferences.

```tsx
// CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Framer Motion
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0 }}
  animate={{ opacity: 1 }}
>
```

### Focus Indicators
Always visible, animated.

```tsx
className="
  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0D0D0D]
  transition-shadow duration-200
"
```

---

## Animation Cheatsheet

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Button hover | scale, bg | 300ms | ease-out |
| Button active | scale | 100ms | ease-out |
| Card hover | translate, shadow, border | 300ms | ease-out |
| Input focus | border, ring | 200ms | ease-out |
| Link hover | color | 200ms | ease-out |
| Modal enter | opacity, scale, y | 200ms | ease-out |
| Modal exit | opacity, scale | 150ms | ease-in |
| Toast enter | opacity, y, scale | 300ms | ease-out |
| Page enter | opacity, y | 300ms | ease-out |
| Page exit | opacity | 200ms | ease-in |
| Skeleton | opacity | 1500ms | ease-in-out |
| Spinner | rotate | 1000ms | linear |
