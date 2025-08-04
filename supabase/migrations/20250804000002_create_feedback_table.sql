-- Create feedback table for user ratings and comments
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for page lookups
CREATE INDEX idx_feedback_page_id ON feedback(page_id);

-- Create index for ratings analysis
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- Create index for recent feedback
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);