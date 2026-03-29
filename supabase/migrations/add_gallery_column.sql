-- Add gallery column to hospitals table
-- Gallery stores array of image URLs for hospital gallery display

ALTER TABLE hospitals
ADD COLUMN gallery TEXT[] DEFAULT '{}';

-- Create index for better query performance
CREATE INDEX idx_hospitals_gallery ON hospitals USING GIN(gallery);

-- Add comment to document the column
COMMENT ON COLUMN hospitals.gallery IS 'Array of image URLs for hospital gallery display. First image serves as fallback for main image if needed.';
