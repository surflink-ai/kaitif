-- Kaitif Role System Update Migration
-- Migrates from USER/STAFF/ADMIN to USER/ADMIN/SUPERADMIN
-- Adds RoleChangeLog, UserSession, and UserInvite tables

-- ============================================
-- STEP 1: CREATE NEW ENUM AND MIGRATE DATA
-- ============================================

-- Create new UserRole enum with updated values
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- Update users table: STAFF -> ADMIN, ADMIN -> SUPERADMIN
ALTER TABLE users 
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE users 
  ALTER COLUMN role TYPE "UserRole_new" 
  USING (
    CASE role::text
      WHEN 'USER' THEN 'USER'::"UserRole_new"
      WHEN 'STAFF' THEN 'ADMIN'::"UserRole_new"
      WHEN 'ADMIN' THEN 'SUPERADMIN'::"UserRole_new"
    END
  );

ALTER TABLE users 
  ALTER COLUMN role SET DEFAULT 'USER'::"UserRole_new";

-- Drop old enum and rename new one
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- ============================================
-- STEP 2: CREATE NEW TABLES
-- ============================================

-- InviteStatus enum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- Role Change Log table for audit trail
CREATE TABLE role_change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "oldRole" "UserRole" NOT NULL,
  "newRole" "UserRole" NOT NULL,
  "changedBy" TEXT NOT NULL,
  reason TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_changed_by FOREIGN KEY ("changedBy") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_role_change_logs_user ON role_change_logs("userId");
CREATE INDEX idx_role_change_logs_changed_by ON role_change_logs("changedBy");

-- User Sessions table for session management
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "deviceInfo" TEXT,
  "ipAddress" TEXT,
  location TEXT,
  "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isRevoked" BOOLEAN NOT NULL DEFAULT false,
  "revokedAt" TIMESTAMP(3),
  
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_sessions_user ON user_sessions("userId");
CREATE INDEX idx_user_sessions_token ON user_sessions("sessionToken");

-- User Invites table for admin invite system
CREATE TABLE user_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role "UserRole" NOT NULL DEFAULT 'USER',
  "invitedBy" TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status "InviteStatus" NOT NULL DEFAULT 'PENDING',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "acceptedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_inviter FOREIGN KEY ("invitedBy") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_invites_token ON user_invites(token);
CREATE INDEX idx_user_invites_email ON user_invites(email);
CREATE INDEX idx_user_invites_status ON user_invites(status);

-- ============================================
-- STEP 3: UPDATE RLS HELPER FUNCTIONS
-- ============================================

-- Drop old function
DROP FUNCTION IF EXISTS is_admin_or_staff();

-- New function: Check if user is ADMIN or SUPERADMIN
CREATE OR REPLACE FUNCTION is_admin_or_above()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text 
    AND role IN ('ADMIN', 'SUPERADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- New function: Check if user is SUPERADMIN only
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text 
    AND role = 'SUPERADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on new functions
GRANT EXECUTE ON FUNCTION is_admin_or_above TO authenticated;
GRANT EXECUTE ON FUNCTION is_superadmin TO authenticated;

-- ============================================
-- STEP 4: UPDATE EXISTING RLS POLICIES
-- ============================================

-- Drop policies that reference is_admin_or_staff and recreate with is_admin_or_above

-- USERS TABLE
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;

CREATE POLICY "Admin can read all users" ON users
  FOR SELECT USING (is_admin_or_above());

CREATE POLICY "Admin can update users" ON users
  FOR UPDATE USING (is_admin_or_above());

-- Add specific policy for SUPERADMIN role changes
CREATE POLICY "Superadmin can update any user role" ON users
  FOR UPDATE USING (is_superadmin())
  WITH CHECK (is_superadmin());

-- PASSES TABLE
DROP POLICY IF EXISTS "Admin can read all passes" ON passes;
DROP POLICY IF EXISTS "Admin can update passes" ON passes;

CREATE POLICY "Admin can read all passes" ON passes
  FOR SELECT USING (is_admin_or_above());

CREATE POLICY "Admin can update passes" ON passes
  FOR UPDATE USING (is_admin_or_above());

-- PASS_SCANS TABLE
DROP POLICY IF EXISTS "Admin can read all scans" ON pass_scans;
DROP POLICY IF EXISTS "Admin can insert scans" ON pass_scans;

CREATE POLICY "Admin can read all scans" ON pass_scans
  FOR SELECT USING (is_admin_or_above());

CREATE POLICY "Admin can insert scans" ON pass_scans
  FOR INSERT WITH CHECK (is_admin_or_above());

-- WAIVER_VERSIONS TABLE
DROP POLICY IF EXISTS "Admin can manage waiver versions" ON waiver_versions;

CREATE POLICY "Admin can manage waiver versions" ON waiver_versions
  FOR ALL USING (is_admin_or_above());

-- WAIVERS TABLE
DROP POLICY IF EXISTS "Admin can read all waivers" ON waivers;

CREATE POLICY "Admin can read all waivers" ON waivers
  FOR SELECT USING (is_admin_or_above());

-- EVENTS TABLE
DROP POLICY IF EXISTS "Admin can read all events" ON events;
DROP POLICY IF EXISTS "Admin can manage events" ON events;

CREATE POLICY "Admin can read all events" ON events
  FOR SELECT USING (is_admin_or_above());

CREATE POLICY "Admin can manage events" ON events
  FOR ALL USING (is_admin_or_above());

-- EVENT_RSVPS TABLE
DROP POLICY IF EXISTS "Admin can read all RSVPs" ON event_rsvps;

CREATE POLICY "Admin can read all RSVPs" ON event_rsvps
  FOR SELECT USING (is_admin_or_above());

-- EVENT_ATTENDANCES TABLE
DROP POLICY IF EXISTS "Admin can manage attendances" ON event_attendances;

CREATE POLICY "Admin can manage attendances" ON event_attendances
  FOR ALL USING (is_admin_or_above());

-- EVENT_MEDIA TABLE
DROP POLICY IF EXISTS "Admin can manage media" ON event_media;

CREATE POLICY "Admin can manage media" ON event_media
  FOR ALL USING (is_admin_or_above());

-- CHALLENGES TABLE
DROP POLICY IF EXISTS "Admin can manage challenges" ON challenges;

CREATE POLICY "Admin can manage challenges" ON challenges
  FOR ALL USING (is_admin_or_above());

-- CHALLENGE_COMPLETIONS TABLE
DROP POLICY IF EXISTS "Admin can manage completions" ON challenge_completions;

CREATE POLICY "Admin can manage completions" ON challenge_completions
  FOR ALL USING (is_admin_or_above());

-- BADGES TABLE
DROP POLICY IF EXISTS "Admin can manage badges" ON badges;

CREATE POLICY "Admin can manage badges" ON badges
  FOR ALL USING (is_admin_or_above());

-- USER_BADGES TABLE
DROP POLICY IF EXISTS "Admin can award badges" ON user_badges;

CREATE POLICY "Admin can award badges" ON user_badges
  FOR INSERT WITH CHECK (is_admin_or_above());

-- LISTINGS TABLE
DROP POLICY IF EXISTS "Admin can manage listings" ON listings;

CREATE POLICY "Admin can manage listings" ON listings
  FOR ALL USING (is_admin_or_above());

-- TRANSACTIONS TABLE
DROP POLICY IF EXISTS "Admin can read transactions" ON transactions;

CREATE POLICY "Admin can read transactions" ON transactions
  FOR SELECT USING (is_admin_or_above());

-- LISTING_REPORTS TABLE
DROP POLICY IF EXISTS "Admin can manage reports" ON listing_reports;

CREATE POLICY "Admin can manage reports" ON listing_reports
  FOR ALL USING (is_admin_or_above());

-- CONVERSATIONS TABLE
DROP POLICY IF EXISTS "Admin can manage conversations" ON conversations;

CREATE POLICY "Admin can manage conversations" ON conversations
  FOR ALL USING (is_admin_or_above());

-- MESSAGES TABLE - Admin announcements
DROP POLICY IF EXISTS "Admin can send announcements" ON messages;

CREATE POLICY "Admin can send announcements" ON messages
  FOR INSERT WITH CHECK (
    is_admin_or_above() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages."conversationId"
      AND conversations."isAnnouncement" = true
    )
  );

-- PUSH_SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Admin can read push subscriptions" ON push_subscriptions;

CREATE POLICY "Admin can read push subscriptions" ON push_subscriptions
  FOR SELECT USING (is_admin_or_above());

-- ============================================
-- STEP 5: RLS FOR NEW TABLES
-- ============================================

-- ROLE_CHANGE_LOGS TABLE
ALTER TABLE role_change_logs ENABLE ROW LEVEL SECURITY;

-- Only SUPERADMIN can read role change logs
CREATE POLICY "Superadmin can read role change logs" ON role_change_logs
  FOR SELECT USING (is_superadmin());

-- Only SUPERADMIN can insert role change logs
CREATE POLICY "Superadmin can insert role change logs" ON role_change_logs
  FOR INSERT WITH CHECK (is_superadmin());

-- USER_SESSIONS TABLE
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions" ON user_sessions
  FOR SELECT USING ("userId" = auth.uid()::text);

-- Users can update their own sessions (for revoking)
CREATE POLICY "Users can update own sessions" ON user_sessions
  FOR UPDATE USING ("userId" = auth.uid()::text);

-- System can insert sessions
CREATE POLICY "System can insert sessions" ON user_sessions
  FOR INSERT WITH CHECK (true);

-- Admin can read all sessions
CREATE POLICY "Admin can read all sessions" ON user_sessions
  FOR SELECT USING (is_admin_or_above());

-- USER_INVITES TABLE
ALTER TABLE user_invites ENABLE ROW LEVEL SECURITY;

-- Admin can create invites (ADMIN can invite USER, SUPERADMIN can invite USER or ADMIN)
CREATE POLICY "Admin can create invites" ON user_invites
  FOR INSERT WITH CHECK (
    is_admin_or_above() AND
    (
      -- ADMIN can only invite USER role
      (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN')
        AND user_invites.role = 'USER'
      )
      OR
      -- SUPERADMIN can invite USER or ADMIN
      is_superadmin()
    )
  );

-- Admin can read all invites
CREATE POLICY "Admin can read invites" ON user_invites
  FOR SELECT USING (is_admin_or_above());

-- Admin can update invites (cancel, etc.)
CREATE POLICY "Admin can update invites" ON user_invites
  FOR UPDATE USING (is_admin_or_above());

-- Anyone can read invite by token (for accepting)
CREATE POLICY "Anyone can read invite by token" ON user_invites
  FOR SELECT USING (true);

-- ============================================
-- STEP 6: GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
