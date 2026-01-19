import { z } from "zod";

// ============================================
// USER VALIDATORS
// ============================================

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateUserSchema = userProfileSchema.extend({
  role: z.enum(["USER", "STAFF", "ADMIN"]).optional(),
});

// ============================================
// PASS VALIDATORS
// ============================================

export const purchasePassSchema = z.object({
  type: z.enum(["DAY", "WEEK", "MONTH", "ANNUAL"]),
});

export const validatePassSchema = z.object({
  barcodeId: z.string().min(1),
});

// ============================================
// WAIVER VALIDATORS
// ============================================

export const signWaiverSchema = z.object({
  waiverVersionId: z.string().uuid(),
  signature: z.string().min(1), // Base64 encoded
  guardianName: z.string().min(2).max(100).optional(),
  guardianSignature: z.string().optional(),
});

// ============================================
// EVENT VALIDATORS
// ============================================

export const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  category: z.enum([
    "COMPETITION",
    "WORKSHOP",
    "OPEN_SESSION",
    "PRIVATE_RENTAL",
    "COMMUNITY",
    "SPECIAL",
  ]),
  imageUrl: z.string().url().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  capacity: z.number().int().positive().optional(),
  xpReward: z.number().int().min(0).max(1000).default(25),
});

export const updateEventSchema = createEventSchema.partial().extend({
  isPublished: z.boolean().optional(),
  hypeLevel: z.number().int().min(0).max(100).optional(),
});

export const eventRsvpSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(["GOING", "MAYBE", "WAITLIST", "CANCELLED"]),
  friendCount: z.number().int().min(0).max(10).default(0),
});

export const eventSuggestionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum([
    "COMPETITION",
    "WORKSHOP",
    "OPEN_SESSION",
    "PRIVATE_RENTAL",
    "COMMUNITY",
    "SPECIAL",
  ]),
});

export const eventMediaSchema = z.object({
  eventId: z.string().uuid(),
  url: z.string().url(),
  type: z.enum(["image", "video"]),
  caption: z.string().max(500).optional(),
});

// ============================================
// CHALLENGE VALIDATORS
// ============================================

export const createChallengeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  xpReward: z.number().int().min(10).max(1000),
  videoRequired: z.boolean().default(true),
  imageUrl: z.string().url().optional(),
});

export const updateChallengeSchema = createChallengeSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const submitChallengeSchema = z.object({
  challengeId: z.string().uuid(),
  videoUrl: z.string().url().optional(),
});

export const reviewChallengeSchema = z.object({
  completionId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

// ============================================
// MARKETPLACE VALIDATORS
// ============================================

export const createListingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  price: z.number().int().min(100).max(1000000), // $1 - $10,000 in cents
  category: z.enum([
    "SKATEBOARD",
    "SCOOTER",
    "BMX",
    "PROTECTIVE_GEAR",
    "APPAREL",
    "ACCESSORIES",
    "OTHER",
  ]),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  images: z.array(z.string().url()).min(1).max(10),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(["ACTIVE", "SOLD", "RESERVED", "REMOVED"]).optional(),
});

export const createReviewSchema = z.object({
  transactionId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// ============================================
// MESSAGE VALIDATORS
// ============================================

export const createConversationSchema = z.object({
  type: z.enum(["DM", "GROUP"]).default("DM"),
  name: z.string().max(100).optional(),
  memberIds: z.array(z.string().uuid()).min(1),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  replyToId: z.string().uuid().optional(),
});

export const createAnnouncementSchema = z.object({
  content: z.string().min(1).max(5000),
});

// ============================================
// ADMIN VALIDATORS
// ============================================

export const adminUserUpdateSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["USER", "STAFF", "ADMIN"]).optional(),
  xp: z.number().int().min(0).optional(),
  level: z.number().int().min(1).max(20).optional(),
});

export const adminRefundPassSchema = z.object({
  passId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

// ============================================
// FILTER/SEARCH VALIDATORS
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const eventFilterSchema = paginationSchema.extend({
  category: z
    .enum([
      "COMPETITION",
      "WORKSHOP",
      "OPEN_SESSION",
      "PRIVATE_RENTAL",
      "COMMUNITY",
      "SPECIAL",
    ])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const listingFilterSchema = paginationSchema.extend({
  category: z
    .enum([
      "SKATEBOARD",
      "SCOOTER",
      "BMX",
      "PROTECTIVE_GEAR",
      "APPAREL",
      "ACCESSORIES",
      "OTHER",
    ])
    .optional(),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  search: z.string().max(100).optional(),
});

export const challengeFilterSchema = paginationSchema.extend({
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  completed: z.boolean().optional(),
});

// Type exports
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PurchasePassInput = z.infer<typeof purchasePassSchema>;
export type ValidatePassInput = z.infer<typeof validatePassSchema>;
export type SignWaiverInput = z.infer<typeof signWaiverSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventRsvpInput = z.infer<typeof eventRsvpSchema>;
export type EventSuggestionInput = z.infer<typeof eventSuggestionSchema>;
export type EventMediaInput = z.infer<typeof eventMediaSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type SubmitChallengeInput = z.infer<typeof submitChallengeSchema>;
export type ReviewChallengeInput = z.infer<typeof reviewChallengeSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type AdminRefundPassInput = z.infer<typeof adminRefundPassSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type EventFilterInput = z.infer<typeof eventFilterSchema>;
export type ListingFilterInput = z.infer<typeof listingFilterSchema>;
export type ChallengeFilterInput = z.infer<typeof challengeFilterSchema>;
