-- Arreglar advertencias de seguridad - Search Path para funciones

-- Actualizar la función existente para seguridad
CREATE OR REPLACE FUNCTION public.increment_user_strikes(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Actualizar la función handle_new_user para seguridad
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, user_type)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client')
  );
  RETURN NEW;
END;
$$;

-- Actualizar la función update_updated_at_column para seguridad
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;