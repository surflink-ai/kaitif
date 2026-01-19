// Kaitif Skatepark Constants

// Pass Pricing (in cents)
export const PASS_PRICES = {
  DAY: 1500, // $15.00
  WEEK: 5000, // $50.00
  MONTH: 15000, // $150.00
  ANNUAL: 100000, // $1,000.00
} as const;

// Pass Duration (in days)
export const PASS_DURATION = {
  DAY: 1,
  WEEK: 7,
  MONTH: 30,
  ANNUAL: 365,
} as const;

// XP System
export const XP_VALUES = {
  CHECK_IN: 10,
  FIRST_OF_DAY: 5,
  EVENT_ATTENDANCE_BASE: 25,
  EVENT_COMPETITION: 100,
  CHALLENGE_BEGINNER: 50,
  CHALLENGE_INTERMEDIATE: 100,
  CHALLENGE_ADVANCED: 250,
  CHALLENGE_EXPERT: 500,
  DAILY_STREAK_BONUS: 5, // Per day of streak
  WEEKLY_STREAK_BONUS: 50,
  MONTHLY_STREAK_BONUS: 200,
} as const;

// Level Thresholds
export const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  300, // Level 3
  600, // Level 4
  1000, // Level 5
  1500, // Level 6
  2100, // Level 7
  2800, // Level 8
  3600, // Level 9
  4500, // Level 10
  5500, // Level 11
  6600, // Level 12
  7800, // Level 13
  9100, // Level 14
  10500, // Level 15
  12000, // Level 16
  13600, // Level 17
  15300, // Level 18
  17100, // Level 19
  19000, // Level 20
] as const;

// Level Titles
export const LEVEL_TITLES = [
  "Rookie",
  "Beginner",
  "Novice",
  "Apprentice",
  "Regular",
  "Intermediate",
  "Skilled",
  "Advanced",
  "Expert",
  "Pro",
  "Elite",
  "Master",
  "Champion",
  "Legend",
  "Icon",
  "Mythic",
  "Transcendent",
  "Godlike",
  "Immortal",
  "GOAT",
] as const;

// Badge Criteria (JSON strings for database storage)
export const BADGE_CRITERIA = {
  // Visit-based badges
  FIRST_VISIT: JSON.stringify({ type: "visits", count: 1 }),
  REGULAR: JSON.stringify({ type: "visits", count: 10 }),
  DEDICATED: JSON.stringify({ type: "visits", count: 50 }),
  PARK_RAT: JSON.stringify({ type: "visits", count: 100 }),
  LEGEND: JSON.stringify({ type: "visits", count: 500 }),

  // Streak badges
  WEEK_WARRIOR: JSON.stringify({ type: "streak", days: 7 }),
  MONTH_MASTER: JSON.stringify({ type: "streak", days: 30 }),
  IRON_WILL: JSON.stringify({ type: "streak", days: 100 }),

  // Challenge badges
  CHALLENGER: JSON.stringify({ type: "challenges", count: 1 }),
  TRICK_MASTER: JSON.stringify({ type: "challenges", count: 5 }),
  UNSTOPPABLE: JSON.stringify({ type: "challenges", count: 20 }),

  // Event badges
  SOCIALITE: JSON.stringify({ type: "events", count: 5 }),
  COMMUNITY_PILLAR: JSON.stringify({ type: "events", count: 20 }),
  COMPETITION_WINNER: JSON.stringify({ type: "competition_win", count: 1 }),

  // Marketplace badges
  FIRST_SALE: JSON.stringify({ type: "sales", count: 1 }),
  TRUSTED_SELLER: JSON.stringify({ type: "sales", count: 10 }),

  // Special badges
  EARLY_ADOPTER: JSON.stringify({ type: "join_date", before: "2026-03-01" }),
  FOUNDING_MEMBER: JSON.stringify({ type: "join_date", before: "2026-02-01" }),
} as const;

// Event Categories with display info
export const EVENT_CATEGORIES = {
  COMPETITION: { label: "Competition", color: "#FF4444", icon: "trophy" },
  WORKSHOP: { label: "Workshop", color: "#44AAFF", icon: "graduation-cap" },
  OPEN_SESSION: { label: "Open Session", color: "#44FF44", icon: "users" },
  PRIVATE_RENTAL: { label: "Private Rental", color: "#AA44FF", icon: "lock" },
  COMMUNITY: { label: "Community", color: "#FFAA44", icon: "heart" },
  SPECIAL: { label: "Special Event", color: "#FFCC00", icon: "star" },
} as const;

// Marketplace Categories
export const LISTING_CATEGORIES = {
  SKATEBOARD: { label: "Skateboard", icon: "skateboard" },
  SCOOTER: { label: "Scooter", icon: "scooter" },
  BMX: { label: "BMX", icon: "bike" },
  PROTECTIVE_GEAR: { label: "Protective Gear", icon: "shield" },
  APPAREL: { label: "Apparel", icon: "shirt" },
  ACCESSORIES: { label: "Accessories", icon: "box" },
  OTHER: { label: "Other", icon: "more-horizontal" },
} as const;

// Condition Labels
export const CONDITION_LABELS = {
  NEW: "Brand New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
} as const;

// Park Operating Hours
export const OPERATING_HOURS = {
  monday: { open: "Closed", close: "Closed" },
  tuesday: { open: "15:00", close: "21:00" },
  wednesday: { open: "15:00", close: "21:00" },
  thursday: { open: "15:00", close: "21:00" },
  friday: { open: "15:00", close: "21:00" },
  saturday: { open: "12:00", close: "21:00" },
  sunday: { open: "12:00", close: "21:00" },
} as const;

// Park Info
export const PARK_INFO = {
  name: "Kaitif Skatepark",
  address: "Sir Garfield Sobers Sports Complex, Saint Michael, Barbados",
  phone: "+1 (246) 419-4190",
  email: "info@kaitifskatepark.com",
  founded: 2019,
  fundedBy: "Maria Holder Memorial Trust",
  description: "One of the best skateparks in the Caribbean",
  community: {
    totalSkaters: 300,
    maleSkaters: 200,
    femaleSkaters: 100,
    skateShops: 5,
  },
  social: {
    instagram: "https://www.instagram.com/kaitif.skatepark/",
    facebook: "https://www.facebook.com/kaitifskatepark/",
    youtube: "https://www.youtube.com/@KaitifSkatepark",
  },
} as const;

// Park Rules
export const PARK_RULES = [
  "Helmets are mandatory for all riders",
  "Safety gear (pads) strongly recommended",
  "Valid waiver required for entry",
  "Respect other skaters and wait your turn",
  "Board and helmet rentals available on-site",
  "No food or drinks on the ramps",
  "No glass containers in the park",
  "Parents must supervise children under 10",
  "Report any damaged equipment immediately",
  "Follow staff instructions at all times",
] as const;

// Waiver expiry (in days)
export const WAIVER_VALIDITY_DAYS = 365;

// Platform fees
export const MARKETPLACE_FEE_PERCENT = 5; // 5% fee on sales
export const STRIPE_CONNECT_FEE_PERCENT = 2.9; // Stripe's fee
export const STRIPE_CONNECT_FEE_FIXED = 30; // 30 cents

// File upload limits
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
