-- Create artist archetypes table
CREATE TABLE public.artist_archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT, -- Arabic translation
  description TEXT,
  description_ar TEXT,
  icon TEXT,
  color TEXT DEFAULT '#9B5DE5',
  parent_archetype_id UUID REFERENCES public.artist_archetypes(id),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_archetypes ENABLE ROW LEVEL SECURITY;

-- Anyone can view active archetypes
CREATE POLICY "Active archetypes are viewable by everyone"
  ON public.artist_archetypes
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify archetypes
CREATE POLICY "Admins can manage archetypes"
  ON public.artist_archetypes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Insert UAE-relevant artist archetypes
INSERT INTO public.artist_archetypes (name, name_ar, description, description_ar, icon, color, display_order) VALUES
  ('Musician', 'موسيقي', 'Live music performance at events, clubs, weddings', 'أداء موسيقي مباشر في الفعاليات والنوادي والأعراس', 'Music', '#9B5DE5', 1),
  ('Singer', 'مغني', 'Vocal performances for events and entertainment', 'الأداء الصوتي للفعاليات والترفيه', 'Mic2', '#E91E63', 2),
  ('DJ', 'دي جي', 'DJ sets for clubs, parties, and private events', 'مجموعات دي جي للنوادي والحفلات والفعاليات الخاصة', 'Disc3', '#00BCD4', 3),
  ('Visual Artist', 'فنان بصري', 'Artwork exhibitions, installations, commissions', 'معارض فنية وتركيبات وعمولات', 'Palette', '#FF9800', 4),
  ('Photographer', 'مصور', 'Event photography, portraits, commercial shoots', 'تصوير الفعاليات والبورتريهات والتصوير التجاري', 'Camera', '#4CAF50', 5),
  ('Videographer', 'مصور فيديو', 'Video production for events and commercial projects', 'إنتاج الفيديو للفعاليات والمشاريع التجارية', 'Video', '#3F51B5', 6),
  ('Performer', 'فنان أداء', 'Theater, dance, and live performances', 'المسرح والرقص والعروض الحية', 'Theater', '#E91E63', 7),
  ('Fashion Designer', 'مصمم أزياء', 'Clothing and costume design', 'تصميم الملابس والأزياء', 'Shirt', '#9C27B0', 8),
  ('Graphic Designer', 'مصمم جرافيك', 'Digital design, branding, illustration', 'التصميم الرقمي والعلامات التجارية والرسوم التوضيحية', 'PenTool', '#FF5722', 9),
  ('MC/Host', 'مقدم/مضيف', 'Event hosting and emceeing', 'استضافة الفعاليات والتقديم', 'Mic', '#00BCD4', 10),
  ('Calligrapher', 'خطاط', 'Arabic calligraphy and traditional art', 'الخط العربي والفن التقليدي', 'PenLine', '#795548', 11),
  ('Workshop Artist', 'فنان ورش العمل', 'Teaching art, music, and creative skills', 'تعليم الفن والموسيقى والمهارات الإبداعية', 'GraduationCap', '#607D8B', 12);

-- Create form fields table for dynamic onboarding
CREATE TABLE public.form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key TEXT NOT NULL UNIQUE,
  field_type TEXT NOT NULL, -- text, textarea, number, select, multiselect, date, file, location, currency
  label TEXT NOT NULL,
  label_ar TEXT,
  help_text TEXT,
  help_text_ar TEXT,
  placeholder TEXT,
  placeholder_ar TEXT,
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  field_options JSONB DEFAULT '[]', -- for select/multiselect
  weight_for_completeness INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  section TEXT NOT NULL, -- basic_info, artistic_profile, pricing, availability, technical, media
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

-- Anyone can view form fields
CREATE POLICY "Form fields are viewable by everyone"
  ON public.form_fields
  FOR SELECT
  USING (true);

-- Only admins can modify form fields
CREATE POLICY "Admins can manage form fields"
  ON public.form_fields
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Create archetype field visibility mapping
CREATE TABLE public.archetype_field_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archetype_id UUID NOT NULL REFERENCES public.artist_archetypes(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES public.form_fields(id) ON DELETE CASCADE,
  is_required_override BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(archetype_id, field_id)
);

-- Enable RLS
ALTER TABLE public.archetype_field_visibility ENABLE ROW LEVEL SECURITY;

-- Anyone can view visibility mappings
CREATE POLICY "Field visibility is viewable by everyone"
  ON public.archetype_field_visibility
  FOR SELECT
  USING (true);

-- Only admins can modify visibility
CREATE POLICY "Admins can manage field visibility"
  ON public.archetype_field_visibility
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Add archetype and locale fields to artist_profiles
ALTER TABLE public.artist_profiles
  ADD COLUMN IF NOT EXISTS archetype_id UUID REFERENCES public.artist_archetypes(id),
  ADD COLUMN IF NOT EXISTS profile_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Dubai';

-- Create pricing packages table
CREATE TABLE IF NOT EXISTS public.artist_pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  package_name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  duration_hours INTEGER,
  includes JSONB DEFAULT '[]',
  includes_ar JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_pricing_packages ENABLE ROW LEVEL SECURITY;

-- Artists can manage their own packages
CREATE POLICY "Artists can manage their own pricing packages"
  ON public.artist_pricing_packages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_pricing_packages.artist_profile_id
        AND artist_profiles.user_id = auth.uid()
    )
  );

-- Anyone can view published packages
CREATE POLICY "Published packages are viewable by everyone"
  ON public.artist_pricing_packages
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_pricing_packages.artist_profile_id
        AND artist_profiles.featured = true
    )
  );

-- Create availability slots table
CREATE TABLE public.artist_availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday (UAE weekend Fri/Sat)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'Asia/Dubai',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

-- Enable RLS
ALTER TABLE public.artist_availability_slots ENABLE ROW LEVEL SECURITY;

-- Artists can manage their own availability
CREATE POLICY "Artists can manage their own availability"
  ON public.artist_availability_slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_availability_slots.artist_profile_id
        AND artist_profiles.user_id = auth.uid()
    )
  );

-- Anyone can view availability
CREATE POLICY "Availability is viewable by everyone"
  ON public.artist_availability_slots
  FOR SELECT
  USING (
    is_available = true
    AND EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_availability_slots.artist_profile_id
    )
  );

-- Create technical rider table
CREATE TABLE public.artist_technical_rider (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_profile_id UUID NOT NULL UNIQUE REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  stage_requirements TEXT,
  sound_requirements TEXT,
  lighting_requirements TEXT,
  equipment_provided JSONB DEFAULT '[]',
  equipment_needed JSONB DEFAULT '[]',
  setup_time_minutes INTEGER,
  breakdown_time_minutes INTEGER,
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_technical_rider ENABLE ROW LEVEL SECURITY;

-- Artists can manage their own technical rider
CREATE POLICY "Artists can manage their own technical rider"
  ON public.artist_technical_rider
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_technical_rider.artist_profile_id
        AND artist_profiles.user_id = auth.uid()
    )
  );

-- Anyone can view technical riders
CREATE POLICY "Technical riders are viewable by everyone"
  ON public.artist_technical_rider
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_technical_rider.artist_profile_id
    )
  );

-- Create tags table for structured filtering
CREATE TABLE public.artist_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name TEXT NOT NULL UNIQUE,
  tag_name_ar TEXT,
  category TEXT, -- genre, style, skill, service, language
  is_approved BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved tags
CREATE POLICY "Approved tags are viewable by everyone"
  ON public.artist_tags
  FOR SELECT
  USING (is_approved = true);

-- Authenticated users can create tags (pending approval)
CREATE POLICY "Users can create pending tags"
  ON public.artist_tags
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can manage all tags
CREATE POLICY "Admins can manage tags"
  ON public.artist_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- Create artist-tags mapping
CREATE TABLE public.artist_profile_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.artist_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(artist_profile_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.artist_profile_tags ENABLE ROW LEVEL SECURITY;

-- Artists can manage their own tags
CREATE POLICY "Artists can manage their own tags"
  ON public.artist_profile_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles
      WHERE artist_profiles.id = artist_profile_tags.artist_profile_id
        AND artist_profiles.user_id = auth.uid()
    )
  );

-- Anyone can view profile tags
CREATE POLICY "Profile tags are viewable by everyone"
  ON public.artist_profile_tags
  FOR SELECT
  USING (true);

-- Create function to calculate profile completeness score
CREATE OR REPLACE FUNCTION public.calculate_profile_score(profile_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score INTEGER := 0;
  profile RECORD;
BEGIN
  SELECT * INTO profile FROM artist_profiles WHERE id = profile_id;
  
  IF profile IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Basic info (30 points max)
  IF profile.artistic_name IS NOT NULL AND profile.artistic_name != '' THEN score := score + 10; END IF;
  IF profile.bio IS NOT NULL AND length(profile.bio) >= 50 THEN score := score + 10; END IF;
  IF profile.location IS NOT NULL AND profile.location != '' THEN score := score + 10; END IF;
  
  -- Portfolio items (20 points max)
  IF EXISTS (SELECT 1 FROM portfolio_items WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 20;
  END IF;
  
  -- Pricing packages (15 points max)
  IF EXISTS (SELECT 1 FROM artist_pricing_packages WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 15;
  END IF;
  
  -- Skills (10 points max)
  IF EXISTS (SELECT 1 FROM artist_skills WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 10;
  END IF;
  
  -- Availability (10 points max)
  IF EXISTS (SELECT 1 FROM artist_availability_slots WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 10;
  END IF;
  
  -- Social links (10 points max)
  IF EXISTS (SELECT 1 FROM social_links WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 10;
  END IF;
  
  -- Tags (5 points max)
  IF EXISTS (SELECT 1 FROM artist_profile_tags WHERE artist_profile_id = profile_id LIMIT 1) THEN
    score := score + 5;
  END IF;
  
  RETURN score;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_artist_archetypes_updated_at
  BEFORE UPDATE ON public.artist_archetypes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_fields_updated_at
  BEFORE UPDATE ON public.form_fields
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_pricing_packages_updated_at
  BEFORE UPDATE ON public.artist_pricing_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_availability_slots_updated_at
  BEFORE UPDATE ON public.artist_availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_technical_rider_updated_at
  BEFORE UPDATE ON public.artist_technical_rider
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();