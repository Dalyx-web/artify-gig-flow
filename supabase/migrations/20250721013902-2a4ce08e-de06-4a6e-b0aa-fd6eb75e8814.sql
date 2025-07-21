-- Create categories table for artistic categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- lucide-react icon name
  color TEXT DEFAULT '#6366f1', -- hex color for category
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table for artist skills/specialties
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create artist_profiles table for detailed artist information
CREATE TABLE public.artist_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artistic_name TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  location TEXT,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  response_time_hours INTEGER DEFAULT 24,
  portfolio_url TEXT,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create artist_skills junction table
CREATE TABLE public.artist_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(artist_profile_id, skill_id)
);

-- Create social_links table for artist social media
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'behance', 'soundcloud', 'spotify', 'facebook', 'twitter', 'website')),
  url TEXT NOT NULL,
  display_name TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(artist_profile_id, platform)
);

-- Create portfolio_items table for artist work showcase
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'embed')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing_packages table for artist service packages
CREATE TABLE public.pricing_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_hours INTEGER,
  includes TEXT[], -- array of included services
  is_featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for event reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.pricing_packages(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours INTEGER DEFAULT 2,
  location TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  special_requests TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat system
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'booking_request', 'system')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table for user saved artists
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_profile_id)
);

-- Create reviews table for artist ratings and feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_profile_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for skills (public read, admin write)
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Only admins can modify skills" ON public.skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for artist_profiles
CREATE POLICY "Artist profiles are viewable by everyone" ON public.artist_profiles FOR SELECT USING (true);
CREATE POLICY "Artists can manage their own profile" ON public.artist_profiles FOR ALL USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for artist_skills
CREATE POLICY "Artist skills are viewable by everyone" ON public.artist_skills FOR SELECT USING (true);
CREATE POLICY "Artists can manage their own skills" ON public.artist_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for social_links
CREATE POLICY "Social links are viewable by everyone" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Artists can manage their own social links" ON public.social_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for portfolio_items
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Artists can manage their own portfolio" ON public.portfolio_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for pricing_packages
CREATE POLICY "Pricing packages are viewable by everyone" ON public.pricing_packages FOR SELECT USING (true);
CREATE POLICY "Artists can manage their own packages" ON public.pricing_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (
  client_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);
CREATE POLICY "Clients can create bookings" ON public.bookings FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (
  client_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- Create policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (user_id = auth.uid());

-- Create policies for reviews
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own reviews" ON public.reviews FOR SELECT USING (
  reviewer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.artist_profiles WHERE id = artist_profile_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
  reviewer_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND client_id = auth.uid())
);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (reviewer_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_packages_updated_at
  BEFORE UPDATE ON public.pricing_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_artist_profiles_user_id ON public.artist_profiles(user_id);
CREATE INDEX idx_artist_profiles_availability ON public.artist_profiles(availability_status);
CREATE INDEX idx_artist_profiles_rating ON public.artist_profiles(rating DESC);
CREATE INDEX idx_artist_profiles_location ON public.artist_profiles(location);
CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_bookings_artist_profile_id ON public.bookings(artist_profile_id);
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_messages_sender_recipient ON public.messages(sender_id, recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_favorites_user_artist ON public.favorites(user_id, artist_profile_id);
CREATE INDEX idx_reviews_artist_profile_id ON public.reviews(artist_profile_id);

-- Insert initial categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Musicians', 'Live music performances and bands', 'Music', '#8B5CF6'),
('DJs', 'Electronic music and event DJs', 'Disc3', '#06B6D4'),
('Dancers', 'Dance performances and choreography', 'UserCheck', '#F59E0B'),
('Singers', 'Vocal performances and entertainment', 'Mic', '#EF4444'),
('Visual Artists', 'Live painting and visual arts', 'Paintbrush2', '#10B981'),
('Performers', 'Stand-up comedy and entertainment', 'Theater', '#EC4899'),
('Photography', 'Event photography and videography', 'Camera', '#6366F1'),
('Other', 'Miscellaneous artistic services', 'Sparkles', '#64748B');

-- Insert initial skills for each category
INSERT INTO public.skills (name, category_id, description) VALUES
-- Musicians
('Guitar', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Acoustic and electric guitar performance'),
('Piano', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Piano and keyboard performance'),
('Drums', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Drum kit and percussion'),
('Bass', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Bass guitar performance'),
('Violin', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Classical and contemporary violin'),
('Jazz', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Jazz music performance'),
('Classical', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Classical music performance'),
('Rock', (SELECT id FROM public.categories WHERE name = 'Musicians'), 'Rock music performance'),

-- DJs
('House Music', (SELECT id FROM public.categories WHERE name = 'DJs'), 'House and electronic dance music'),
('Hip Hop', (SELECT id FROM public.categories WHERE name = 'DJs'), 'Hip hop and rap music mixing'),
('Pop', (SELECT id FROM public.categories WHERE name = 'DJs'), 'Popular music and top 40'),
('Electronic', (SELECT id FROM public.categories WHERE name = 'DJs'), 'Electronic and techno music'),
('Wedding DJ', (SELECT id FROM public.categories WHERE name = 'DJs'), 'Wedding and event music'),

-- Dancers
('Ballet', (SELECT id FROM public.categories WHERE name = 'Dancers'), 'Classical ballet performance'),
('Contemporary', (SELECT id FROM public.categories WHERE name = 'Dancers'), 'Modern contemporary dance'),
('Hip Hop Dance', (SELECT id FROM public.categories WHERE name = 'Dancers'), 'Street and hip hop dance'),
('Ballroom', (SELECT id FROM public.categories WHERE name = 'Dancers'), 'Ballroom and partner dancing'),
('Flamenco', (SELECT id FROM public.categories WHERE name = 'Dancers'), 'Traditional flamenco dance'),

-- Singers
('Pop Vocals', (SELECT id FROM public.categories WHERE name = 'Singers'), 'Popular music vocals'),
('Jazz Vocals', (SELECT id FROM public.categories WHERE name = 'Singers'), 'Jazz and swing vocals'),
('Opera', (SELECT id FROM public.categories WHERE name = 'Singers'), 'Classical opera performance'),
('R&B', (SELECT id FROM public.categories WHERE name = 'Singers'), 'R&B and soul vocals'),
('Country', (SELECT id FROM public.categories WHERE name = 'Singers'), 'Country music vocals'),

-- Visual Artists
('Live Painting', (SELECT id FROM public.categories WHERE name = 'Visual Artists'), 'Live event painting'),
('Caricature', (SELECT id FROM public.categories WHERE name = 'Visual Artists'), 'Portrait caricatures'),
('Body Painting', (SELECT id FROM public.categories WHERE name = 'Visual Artists'), 'Artistic body painting'),
('Digital Art', (SELECT id FROM public.categories WHERE name = 'Visual Artists'), 'Digital artwork creation'),

-- Performers
('Stand-up Comedy', (SELECT id FROM public.categories WHERE name = 'Performers'), 'Comedy performances'),
('Magic Shows', (SELECT id FROM public.categories WHERE name = 'Performers'), 'Magic and illusion shows'),
('Mime', (SELECT id FROM public.categories WHERE name = 'Performers'), 'Mime and physical comedy'),
('Poetry', (SELECT id FROM public.categories WHERE name = 'Performers'), 'Spoken word and poetry'),

-- Photography
('Event Photography', (SELECT id FROM public.categories WHERE name = 'Photography'), 'Event and party photography'),
('Wedding Photography', (SELECT id FROM public.categories WHERE name = 'Photography'), 'Wedding photography'),
('Portrait Photography', (SELECT id FROM public.categories WHERE name = 'Photography'), 'Portrait and headshot photography'),
('Videography', (SELECT id FROM public.categories WHERE name = 'Photography'), 'Video recording and editing');