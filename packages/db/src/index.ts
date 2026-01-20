// Kaitif Database Package
// Exports all database-related functionality

// Client exports
export {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createServiceRoleClient,
  type SupabaseClient,
  type ServerSupabaseClient,
  type ServiceRoleSupabaseClient,
} from "./client";

// Type exports
export * from "./types";

// Validator exports
export * from "./validators";

// Constants exports
export * from "./constants";

// Permissions exports
export * from "./permissions";

// Query exports
export * as userQueries from "./queries/users";
export * as passQueries from "./queries/passes";
export * as waiverQueries from "./queries/waivers";
export * as eventQueries from "./queries/events";
export * as challengeQueries from "./queries/challenges";
export * as marketplaceQueries from "./queries/marketplace";
export * as messageQueries from "./queries/messages";
export * as analyticsQueries from "./queries/analytics";
export * as badgeAutomation from "./queries/badge-automation";
export * as feedQueries from "./queries/feed";

// Re-export individual query functions for convenience
export {
  getUserById,
  getUserByEmail,
  getUserWithRelations,
  upsertUser,
  updateUserProfile,
  addUserXP,
  updateUserStreak,
  getLeaderboard,
  calculateLevel,
  getXPForNextLevel,
  getAllUsers,
} from "./queries/users";

export {
  getPassById,
  getPassByBarcode,
  getUserPasses,
  getUserActivePass,
  createPass,
  updatePassStatus,
  scanPass,
  getPassScans,
  getTodayCheckIns,
  getExpiringPasses,
  getAllPasses,
} from "./queries/passes";

export {
  getActiveWaiverVersion,
  getWaiverVersionById,
  createWaiverVersion,
  getUserValidWaiver,
  hasValidWaiver,
  signWaiver,
  getUserWaivers,
  getExpiringWaivers,
  getWaiverStats,
  getAllWaiversAdmin,
} from "./queries/waivers";

export {
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  cancelRsvp,
  getUserRsvp,
  checkInToEvent,
  getEventRsvps,
  addEventMedia,
  approveEventMedia,
  createEventSuggestion,
  voteOnSuggestion,
  getTopSuggestions,
  getAllEventsAdmin,
  toggleEventPublished,
} from "./queries/events";

export {
  getChallenges,
  getChallengeById,
  getActiveChallenges,
  createChallenge,
  updateChallenge,
  submitChallengeCompletion,
  reviewChallengeCompletion,
  getUserChallengeCompletions,
  getPendingCompletions,
  getChallengeLeaderboard,
  getXPLeaderboard,
  getAllBadges,
  getUserBadges,
  awardBadge,
  createBadge,
  getAllChallengesAdmin,
  toggleChallengeActive,
} from "./queries/challenges";

export {
  getListingById,
  getListings,
  createListing,
  updateListing,
  deleteListing,
  createTransaction,
  completeTransaction,
  cancelTransaction,
  getUserTransactions,
  createReview,
  getUserReviews,
  getUserRating,
  getFeaturedListings,
  removeListingAdmin,
  getListingReports,
  updateReportStatus,
  getMarketplaceStats,
} from "./queries/marketplace";

export {
  getConversationById,
  getUserConversations,
  createConversation,
  sendMessage,
  getMessages,
  markAsRead,
  createAnnouncement,
  getAnnouncements,
  addMemberToConversation,
  removeMemberFromConversation,
  getTotalUnreadCount,
} from "./queries/messages";

export {
  getDashboardStats,
  getRevenueByPeriod,
  getAttendanceByPeriod,
  getRecentActivity,
  getRevenueAnalytics,
  getPassDistribution,
  getHourlyTraffic,
  getUserGrowth,
} from "./queries/analytics";

export {
  checkAndAwardBadges,
  checkBadgesForAction,
  awardSpecificBadge,
  checkEarlyAdopterBadges,
} from "./queries/badge-automation";

export {
  getFeedPosts,
  createFeedPost,
  deleteFeedPost,
  toggleLike,
  getPostComments,
  createComment,
  deleteComment,
  getActivityFeed,
} from "./queries/feed";
