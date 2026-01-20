// Kaitif UI Package
// Brutalist design system with sharp edges and bold colors

// Utilities
export { cn, formatPrice, formatDate, formatDateTime, formatRelativeTime, truncate, getInitials } from "./lib/utils";

// Layout Components
export { Container } from "./components/container";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./components/card";
export { Separator } from "./components/separator";

// Form Components
export { Button, buttonVariants } from "./components/button";
export { Input } from "./components/input";
export { Textarea } from "./components/textarea";
export { Checkbox } from "./components/checkbox";
export { Label } from "./components/label";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/select";

// Feedback Components
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "./components/toast";
export { Toaster } from "./components/toaster";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/dialog";
export { Badge, badgeVariants } from "./components/badge";

// Navigation Components
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/tabs";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/dropdown-menu";
export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem } from "./components/sidebar";
export { BottomDock, BottomDockItem } from "./components/bottom-dock";

// Custom Components
export { Avatar } from "./components/avatar";
export { AvatarStack } from "./components/avatar-stack";
export { HypeMeter } from "./components/hype-meter";
export { XPBar } from "./components/xp-bar";
export { CountdownTimer } from "./components/countdown-timer";
export { WeatherWidget, type WeatherCondition } from "./components/weather-widget";
export { FeedPostCard } from "./components/feed-post-card";
export { FeedActivityCard } from "./components/feed-activity-card";
export { CreatePostForm } from "./components/create-post-form";
export { CommentSection } from "./components/comment-section";
export { LikeButton } from "./components/like-button";

// Hooks
export { useToast, toast } from "./hooks/use-toast";
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from "./hooks/use-media-query";
