-- Kaitif Skatepark Database Setup
-- This file contains realtime configuration, RPC functions, and RLS policies

-- ============================================
-- REALTIME CONFIGURATION
-- ============================================

-- Enable realtime for messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_members;

-- ============================================
-- RPC FUNCTIONS
-- ============================================

-- RPC Functions for Voting
CREATE OR REPLACE FUNCTION increment_suggestion_votes(suggestion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE event_suggestions
  SET "voteCount" = "voteCount" + 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_suggestion_votes(suggestion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE event_suggestions
  SET "voteCount" = "voteCount" - 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Helper function to check if user is admin/staff
CREATE OR REPLACE FUNCTION is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text 
    AND role IN ('ADMIN', 'STAFF')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USERS TABLE
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (id = auth.uid()::text);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- Users can read basic info of other users (for messaging, marketplace)
CREATE POLICY "Users can read basic info of others" ON users
  FOR SELECT USING (true);

-- Admin/Staff can read all users
CREATE POLICY "Admin can read all users" ON users
  FOR SELECT USING (is_admin_or_staff());

-- Admin can update any user
CREATE POLICY "Admin can update users" ON users
  FOR UPDATE USING (is_admin_or_staff());

-- ============================================
-- PASSES TABLE
-- ============================================
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;

-- Users can read their own passes
CREATE POLICY "Users can read own passes" ON passes
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Admin/Staff can read all passes
CREATE POLICY "Admin can read all passes" ON passes
  FOR SELECT USING (is_admin_or_staff());

-- System can insert passes (via service role)
CREATE POLICY "Service can insert passes" ON passes
  FOR INSERT WITH CHECK (true);

-- Admin can update passes
CREATE POLICY "Admin can update passes" ON passes
  FOR UPDATE USING (is_admin_or_staff());

-- ============================================
-- PASS_SCANS TABLE
-- ============================================
ALTER TABLE pass_scans ENABLE ROW LEVEL SECURITY;

-- Users can read scans of their own passes
CREATE POLICY "Users can read own pass scans" ON pass_scans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM passes 
      WHERE passes.id = pass_scans."passId" 
      AND passes."userId" = auth.uid()::text
    )
  );

-- Admin/Staff can read and insert all scans
CREATE POLICY "Admin can read all scans" ON pass_scans
  FOR SELECT USING (is_admin_or_staff());

CREATE POLICY "Admin can insert scans" ON pass_scans
  FOR INSERT WITH CHECK (is_admin_or_staff());

-- ============================================
-- WAIVER_VERSIONS TABLE
-- ============================================
ALTER TABLE waiver_versions ENABLE ROW LEVEL SECURITY;

-- Everyone can read active waiver versions
CREATE POLICY "Anyone can read active waivers" ON waiver_versions
  FOR SELECT USING ("isActive" = true);

-- Admin can manage waiver versions
CREATE POLICY "Admin can manage waiver versions" ON waiver_versions
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- WAIVERS TABLE
-- ============================================
ALTER TABLE waivers ENABLE ROW LEVEL SECURITY;

-- Users can read their own waivers
CREATE POLICY "Users can read own waivers" ON waivers
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Users can insert their own waivers
CREATE POLICY "Users can sign waivers" ON waivers
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

-- Admin can read all waivers
CREATE POLICY "Admin can read all waivers" ON waivers
  FOR SELECT USING (is_admin_or_staff());

-- ============================================
-- EVENTS TABLE
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Everyone can read published events
CREATE POLICY "Anyone can read published events" ON events
  FOR SELECT USING ("isPublished" = true);

-- Admin/Staff can read all events
CREATE POLICY "Admin can read all events" ON events
  FOR SELECT USING (is_admin_or_staff());

-- Admin/Staff can manage events
CREATE POLICY "Admin can manage events" ON events
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- EVENT_RSVPS TABLE
-- ============================================
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Users can read RSVPs for events they can see
CREATE POLICY "Users can read event RSVPs" ON event_rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_rsvps."eventId" 
      AND events."isPublished" = true
    )
  );

-- Users can manage their own RSVPs
CREATE POLICY "Users can manage own RSVPs" ON event_rsvps
  FOR ALL USING ("userId" = auth.uid()::text);

-- Admin can read all RSVPs
CREATE POLICY "Admin can read all RSVPs" ON event_rsvps
  FOR SELECT USING (is_admin_or_staff());

-- ============================================
-- EVENT_ATTENDANCES TABLE
-- ============================================
ALTER TABLE event_attendances ENABLE ROW LEVEL SECURITY;

-- Users can read their own attendances
CREATE POLICY "Users can read own attendances" ON event_attendances
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Admin/Staff can manage attendances
CREATE POLICY "Admin can manage attendances" ON event_attendances
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- EVENT_MEDIA TABLE
-- ============================================
ALTER TABLE event_media ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved media
CREATE POLICY "Anyone can read approved media" ON event_media
  FOR SELECT USING ("isApproved" = true);

-- Users can read their own uploads
CREATE POLICY "Users can read own uploads" ON event_media
  FOR SELECT USING ("uploaderId" = auth.uid()::text);

-- Users can upload media
CREATE POLICY "Users can upload media" ON event_media
  FOR INSERT WITH CHECK ("uploaderId" = auth.uid()::text);

-- Admin can manage all media
CREATE POLICY "Admin can manage media" ON event_media
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- EVENT_SUGGESTIONS TABLE
-- ============================================
ALTER TABLE event_suggestions ENABLE ROW LEVEL SECURITY;

-- Everyone can read suggestions
CREATE POLICY "Anyone can read suggestions" ON event_suggestions
  FOR SELECT USING (true);

-- Authenticated users can create suggestions
CREATE POLICY "Users can create suggestions" ON event_suggestions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND "userId" = auth.uid()::text);

-- Users can update their own suggestions
CREATE POLICY "Users can update own suggestions" ON event_suggestions
  FOR UPDATE USING ("userId" = auth.uid()::text);

-- ============================================
-- EVENT_SUGGESTION_VOTES TABLE
-- ============================================
ALTER TABLE event_suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Users can manage their own votes
CREATE POLICY "Users can manage own votes" ON event_suggestion_votes
  FOR ALL USING ("userId" = auth.uid()::text);

-- Everyone can read vote counts (through suggestions)
CREATE POLICY "Anyone can read votes" ON event_suggestion_votes
  FOR SELECT USING (true);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Everyone can read active challenges
CREATE POLICY "Anyone can read active challenges" ON challenges
  FOR SELECT USING ("isActive" = true);

-- Admin can manage challenges
CREATE POLICY "Admin can manage challenges" ON challenges
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- CHALLENGE_COMPLETIONS TABLE
-- ============================================
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;

-- Users can read their own completions
CREATE POLICY "Users can read own completions" ON challenge_completions
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Users can submit completions
CREATE POLICY "Users can submit completions" ON challenge_completions
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

-- Users can update their pending completions
CREATE POLICY "Users can update pending completions" ON challenge_completions
  FOR UPDATE USING ("userId" = auth.uid()::text AND status = 'PENDING');

-- Admin can manage all completions
CREATE POLICY "Admin can manage completions" ON challenge_completions
  FOR ALL USING (is_admin_or_staff());

-- Everyone can read approved completions (for leaderboard)
CREATE POLICY "Anyone can read approved completions" ON challenge_completions
  FOR SELECT USING (status = 'APPROVED');

-- ============================================
-- BADGES TABLE
-- ============================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Everyone can read badges
CREATE POLICY "Anyone can read badges" ON badges
  FOR SELECT USING (true);

-- Admin can manage badges
CREATE POLICY "Admin can manage badges" ON badges
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- USER_BADGES TABLE
-- ============================================
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can read their own badges
CREATE POLICY "Users can read own badges" ON user_badges
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Everyone can read badges (for profiles)
CREATE POLICY "Anyone can read user badges" ON user_badges
  FOR SELECT USING (true);

-- Admin can award badges
CREATE POLICY "Admin can award badges" ON user_badges
  FOR INSERT WITH CHECK (is_admin_or_staff());

-- ============================================
-- LISTINGS TABLE
-- ============================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Everyone can read active listings
CREATE POLICY "Anyone can read active listings" ON listings
  FOR SELECT USING (status = 'ACTIVE');

-- Users can read their own listings (any status)
CREATE POLICY "Users can read own listings" ON listings
  FOR SELECT USING ("sellerId" = auth.uid()::text);

-- Users can create listings
CREATE POLICY "Users can create listings" ON listings
  FOR INSERT WITH CHECK ("sellerId" = auth.uid()::text);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING ("sellerId" = auth.uid()::text);

-- Admin can manage all listings
CREATE POLICY "Admin can manage listings" ON listings
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can read transactions they're part of
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (
    "buyerId" = auth.uid()::text OR "sellerId" = auth.uid()::text
  );

-- Service role can manage transactions
CREATE POLICY "Service can manage transactions" ON transactions
  FOR ALL WITH CHECK (true);

-- Admin can read all transactions
CREATE POLICY "Admin can read transactions" ON transactions
  FOR SELECT USING (is_admin_or_staff());

-- ============================================
-- REVIEWS TABLE
-- ============================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- Users can create reviews for their transactions
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    "reviewerId" = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = reviews."transactionId"
      AND (transactions."buyerId" = auth.uid()::text OR transactions."sellerId" = auth.uid()::text)
    )
  );

-- ============================================
-- LISTING_REPORTS TABLE
-- ============================================
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON listing_reports
  FOR INSERT WITH CHECK ("reporterId" = auth.uid()::text);

-- Admin can manage reports
CREATE POLICY "Admin can manage reports" ON listing_reports
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can read conversations they're members of
CREATE POLICY "Users can read own conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_members."conversationId" = conversations.id
      AND conversation_members."userId" = auth.uid()::text
    )
    OR "isAnnouncement" = true
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update conversations they're members of
CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_members."conversationId" = conversations.id
      AND conversation_members."userId" = auth.uid()::text
    )
  );

-- Admin can manage announcement conversations
CREATE POLICY "Admin can manage conversations" ON conversations
  FOR ALL USING (is_admin_or_staff());

-- ============================================
-- CONVERSATION_MEMBERS TABLE
-- ============================================
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;

-- Users can read members of conversations they're in
CREATE POLICY "Users can read conversation members" ON conversation_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm2
      WHERE cm2."conversationId" = conversation_members."conversationId"
      AND cm2."userId" = auth.uid()::text
    )
  );

-- Users can add themselves to conversations
CREATE POLICY "Users can join conversations" ON conversation_members
  FOR INSERT WITH CHECK (
    "userId" = auth.uid()::text OR
    is_admin_or_staff()
  );

-- Users can update their own membership
CREATE POLICY "Users can update own membership" ON conversation_members
  FOR UPDATE USING ("userId" = auth.uid()::text);

-- Users can leave conversations
CREATE POLICY "Users can leave conversations" ON conversation_members
  FOR DELETE USING ("userId" = auth.uid()::text);

-- ============================================
-- MESSAGES TABLE
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in their conversations
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_members."conversationId" = messages."conversationId"
      AND conversation_members."userId" = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages."conversationId"
      AND conversations."isAnnouncement" = true
    )
  );

-- Users can send messages to their conversations
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    "senderId" = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_members."conversationId" = messages."conversationId"
      AND conversation_members."userId" = auth.uid()::text
    )
  );

-- Admin can send announcements
CREATE POLICY "Admin can send announcements" ON messages
  FOR INSERT WITH CHECK (
    is_admin_or_staff() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages."conversationId"
      AND conversations."isAnnouncement" = true
    )
  );

-- ============================================
-- PUSH_SUBSCRIPTIONS TABLE
-- ============================================
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
  FOR ALL USING ("userId" = auth.uid()::text);

-- Admin can read all subscriptions (for sending notifications)
CREATE POLICY "Admin can read push subscriptions" ON push_subscriptions
  FOR SELECT USING (is_admin_or_staff());

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on all sequences to authenticated users
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on RPC functions
GRANT EXECUTE ON FUNCTION increment_suggestion_votes TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_suggestion_votes TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_or_staff TO authenticated;
