-- Add reference column to textbooks table
-- This migration adds a reference column to specify whether a textbook is for learners or teachers

ALTER TABLE textbooks 
ADD COLUMN reference VARCHAR(20) DEFAULT 'learner' NOT NULL;

-- Add a check constraint to ensure only valid values are allowed
ALTER TABLE textbooks 
ADD CONSTRAINT check_reference_type 
CHECK (reference IN ('learner', 'teacher'));

-- Update existing records to have 'learner' as default (this is already handled by the DEFAULT value)
-- No need for UPDATE statement since DEFAULT will handle existing records

-- Add an index for better query performance when filtering by reference type
CREATE INDEX idx_textbooks_reference ON textbooks(reference);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN textbooks.reference IS 'Specifies whether the textbook is intended for learners or teachers';
