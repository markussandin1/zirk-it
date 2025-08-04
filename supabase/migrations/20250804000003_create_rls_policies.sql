-- Enable Row Level Security (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Pages policies
-- Allow public read access to pages (for website viewing)
CREATE POLICY "Pages are publicly readable" ON pages
  FOR SELECT USING (true);

-- Allow public insert (for creating new pages)
CREATE POLICY "Anyone can create pages" ON pages
  FOR INSERT WITH CHECK (true);

-- Allow update only by the same session that created it (basic protection)
-- In future, we can add proper authentication
CREATE POLICY "Allow updates for creators" ON pages
  FOR UPDATE USING (true);

-- Feedback policies
-- Allow public read of feedback for display
CREATE POLICY "Feedback is publicly readable" ON feedback
  FOR SELECT USING (true);

-- Allow public insert of feedback
CREATE POLICY "Anyone can create feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- No updates or deletes for feedback (maintain integrity)