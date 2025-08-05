-- Crear tablas para el sistema de moderación de mensajes

-- Tabla para registrar infracciones detectadas
CREATE TABLE public.message_infractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL,
  message_content TEXT NOT NULL,
  infraction_type TEXT NOT NULL CHECK (infraction_type IN ('email', 'phone', 'social', 'payment', 'external_link')),
  detected_patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'severe', 'critical')),
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES profiles(user_id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_status TEXT CHECK (review_status IN ('pending', 'confirmed', 'false_positive'))
);

-- Tabla para el sistema de strikes por usuario
CREATE TABLE public.user_strikes (
  user_id UUID PRIMARY KEY REFERENCES profiles(user_id) ON DELETE CASCADE,
  strike_count INTEGER NOT NULL DEFAULT 0,
  last_strike_at TIMESTAMP WITH TIME ZONE,
  suspension_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para dominios en lista blanca (opcional para enlaces permitidos)
CREATE TABLE public.whitelisted_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  created_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejorar performance
CREATE INDEX idx_message_infractions_user_id ON public.message_infractions(user_id);
CREATE INDEX idx_message_infractions_created_at ON public.message_infractions(blocked_at);
CREATE INDEX idx_user_strikes_suspension ON public.user_strikes(suspension_until) WHERE suspension_until IS NOT NULL;

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.message_infractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelisted_domains ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para message_infractions
CREATE POLICY "Users can view their own infractions"
ON public.message_infractions
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all infractions"
ON public.message_infractions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- Políticas RLS para user_strikes
CREATE POLICY "Users can view their own strikes"
ON public.user_strikes
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all strikes"
ON public.user_strikes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- Políticas RLS para whitelisted_domains
CREATE POLICY "Whitelisted domains are viewable by everyone"
ON public.whitelisted_domains
FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify whitelisted domains"
ON public.whitelisted_domains
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.user_type = 'admin'
  )
);

-- Función para incrementar strikes automáticamente
CREATE OR REPLACE FUNCTION public.increment_user_strikes(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_strikes (user_id, strike_count, last_strike_at)
  VALUES (target_user_id, 1, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    strike_count = user_strikes.strike_count + 1,
    last_strike_at = now(),
    updated_at = now(),
    -- Suspender temporalmente después de 3 strikes
    suspension_until = CASE 
      WHEN user_strikes.strike_count + 1 >= 3 
      THEN now() + INTERVAL '24 hours'
      ELSE user_strikes.suspension_until
    END;
END;
$$;

-- Trigger para actualizar updated_at en user_strikes
CREATE TRIGGER update_user_strikes_updated_at
BEFORE UPDATE ON public.user_strikes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar algunos dominios en lista blanca por defecto
INSERT INTO public.whitelisted_domains (domain, category, description) VALUES
('drive.google.com', 'storage', 'Google Drive para compartir archivos'),
('dropbox.com', 'storage', 'Dropbox para compartir archivos'),
('behance.net', 'portfolio', 'Portfolio de diseño Behance'),
('artstation.com', 'portfolio', 'Portfolio de arte ArtStation'),
('github.io', 'portfolio', 'GitHub Pages para portfolios');