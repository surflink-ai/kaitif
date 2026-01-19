-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_members;

-- Note: RLS Policies should be enabled for security in a production environment.
-- For example:
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can read messages in their conversations" ON messages
--   FOR SELECT USING (
--     auth.uid() IN (
--       SELECT user_id FROM conversation_members WHERE conversation_id = messages.conversation_id
--     )
--   );

-- RPC Functions for Voting
CREATE OR REPLACE FUNCTION increment_suggestion_votes(suggestion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE event_suggestions
  SET "voteCount" = "voteCount" + 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_suggestion_votes(suggestion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE event_suggestions
  SET "voteCount" = "voteCount" - 1
  WHERE id = suggestion_id;
END;
$$ LANGUAGE plpgsql;
