// Database types generated from Prisma schema
// This file provides TypeScript types for Supabase client

import type {
  User,
  Pass,
  PassScan,
  WaiverVersion,
  Waiver,
  Event,
  EventRSVP,
  EventAttendance,
  EventMedia,
  EventSuggestion,
  EventSuggestionVote,
  Challenge,
  ChallengeCompletion,
  Badge,
  UserBadge,
  Listing,
  Transaction,
  Review,
  Conversation,
  ConversationMember,
  Message,
  UserRole,
  PassType,
  PassStatus,
  EventCategory,
  RSVPStatus,
  ChallengeDifficulty,
  CompletionStatus,
  BadgeRarity,
  ListingCategory,
  ListingCondition,
  ListingStatus,
  TransactionStatus,
  ConversationType,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Pass,
  PassScan,
  WaiverVersion,
  Waiver,
  Event,
  EventRSVP,
  EventAttendance,
  EventMedia,
  EventSuggestion,
  EventSuggestionVote,
  Challenge,
  ChallengeCompletion,
  Badge,
  UserBadge,
  Listing,
  Transaction,
  Review,
  Conversation,
  ConversationMember,
  Message,
  UserRole,
  PassType,
  PassStatus,
  EventCategory,
  RSVPStatus,
  ChallengeDifficulty,
  CompletionStatus,
  BadgeRarity,
  ListingCategory,
  ListingCondition,
  ListingStatus,
  TransactionStatus,
  ConversationType,
};

// Supabase Database type definition
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
      };
      passes: {
        Row: Pass;
        Insert: Omit<Pass, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Pass, "id" | "createdAt" | "updatedAt">>;
      };
      pass_scans: {
        Row: PassScan;
        Insert: Omit<PassScan, "id">;
        Update: Partial<Omit<PassScan, "id">>;
      };
      waiver_versions: {
        Row: WaiverVersion;
        Insert: Omit<WaiverVersion, "id" | "createdAt">;
        Update: Partial<Omit<WaiverVersion, "id" | "createdAt">>;
      };
      waivers: {
        Row: Waiver;
        Insert: Omit<Waiver, "id" | "createdAt">;
        Update: Partial<Omit<Waiver, "id" | "createdAt">>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>;
      };
      event_rsvps: {
        Row: EventRSVP;
        Insert: Omit<EventRSVP, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<EventRSVP, "id" | "createdAt" | "updatedAt">>;
      };
      event_attendances: {
        Row: EventAttendance;
        Insert: Omit<EventAttendance, "id">;
        Update: Partial<Omit<EventAttendance, "id">>;
      };
      event_media: {
        Row: EventMedia;
        Insert: Omit<EventMedia, "id" | "createdAt">;
        Update: Partial<Omit<EventMedia, "id" | "createdAt">>;
      };
      event_suggestions: {
        Row: EventSuggestion;
        Insert: Omit<EventSuggestion, "id" | "createdAt">;
        Update: Partial<Omit<EventSuggestion, "id" | "createdAt">>;
      };
      event_suggestion_votes: {
        Row: EventSuggestionVote;
        Insert: Omit<EventSuggestionVote, "id" | "createdAt">;
        Update: Partial<Omit<EventSuggestionVote, "id" | "createdAt">>;
      };
      challenges: {
        Row: Challenge;
        Insert: Omit<Challenge, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Challenge, "id" | "createdAt" | "updatedAt">>;
      };
      challenge_completions: {
        Row: ChallengeCompletion;
        Insert: Omit<ChallengeCompletion, "id" | "createdAt">;
        Update: Partial<Omit<ChallengeCompletion, "id" | "createdAt">>;
      };
      badges: {
        Row: Badge;
        Insert: Omit<Badge, "id" | "createdAt">;
        Update: Partial<Omit<Badge, "id" | "createdAt">>;
      };
      user_badges: {
        Row: UserBadge;
        Insert: Omit<UserBadge, "id">;
        Update: Partial<Omit<UserBadge, "id">>;
      };
      listings: {
        Row: Listing;
        Insert: Omit<Listing, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Listing, "id" | "createdAt" | "updatedAt">>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "createdAt">;
        Update: Partial<Omit<Transaction, "id" | "createdAt">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "createdAt">;
        Update: Partial<Omit<Review, "id" | "createdAt">>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Conversation, "id" | "createdAt" | "updatedAt">>;
      };
      conversation_members: {
        Row: ConversationMember;
        Insert: Omit<ConversationMember, "id">;
        Update: Partial<Omit<ConversationMember, "id">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Message, "id" | "createdAt" | "updatedAt">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      UserRole: UserRole;
      PassType: PassType;
      PassStatus: PassStatus;
      EventCategory: EventCategory;
      RSVPStatus: RSVPStatus;
      ChallengeDifficulty: ChallengeDifficulty;
      CompletionStatus: CompletionStatus;
      BadgeRarity: BadgeRarity;
      ListingCategory: ListingCategory;
      ListingCondition: ListingCondition;
      ListingStatus: ListingStatus;
      TransactionStatus: TransactionStatus;
      ConversationType: ConversationType;
    };
  };
};

// Extended types with relations
export type UserWithRelations = User & {
  passes?: Pass[];
  waivers?: Waiver[];
  badges?: UserBadge[];
};

export type PassWithRelations = Pass & {
  user?: User;
  scans?: PassScan[];
};

export type EventWithRelations = Event & {
  rsvps?: EventRSVP[];
  attendances?: EventAttendance[];
  media?: EventMedia[];
};

export type ListingWithRelations = Listing & {
  seller?: User;
  transactions?: Transaction[];
};

export type ConversationWithRelations = Conversation & {
  members?: ConversationMember[];
  messages?: Message[];
};

export type MessageWithRelations = Message & {
  sender?: User;
  conversation?: Conversation;
  replyTo?: Message;
};
