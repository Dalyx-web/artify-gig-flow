import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationResult {
  isBlocked: boolean;
  infractions: {
    type: 'email' | 'phone' | 'social' | 'payment' | 'external_link';
    pattern: string;
    confidence: number;
    context: string;
  }[];
  severity: 'warning' | 'severe' | 'critical';
  suggestedMessage?: string;
}

interface DetectionPattern {
  type: 'email' | 'phone' | 'social' | 'payment' | 'external_link';
  patterns: RegExp[];
  severity: 'warning' | 'severe' | 'critical';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, userId, conversationId } = await req.json();

    if (!content || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: content, userId' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Moderating message from user ${userId}: "${content.substring(0, 50)}..."`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if user is currently suspended
    const { data: userStrike } = await supabase
      .from('user_strikes')
      .select('suspension_until')
      .eq('user_id', userId)
      .maybeSingle();

    if (userStrike?.suspension_until && new Date(userStrike.suspension_until) > new Date()) {
      console.log(`User ${userId} is currently suspended until ${userStrike.suspension_until}`);
      return new Response(
        JSON.stringify({
          isBlocked: true,
          infractions: [{ type: 'suspension', pattern: 'user_suspended', confidence: 1.0, context: 'suspended' }],
          severity: 'critical',
          suggestedMessage: 'Tu cuenta está temporalmente suspendida. Revisa las políticas de la plataforma.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Patrones de detección definidos
    const detectionPatterns: DetectionPattern[] = [
      {
        type: 'email',
        patterns: [
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
          /\b[A-Za-z0-9._%+-]+\s*\[\s*at\s*\]\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/gi,
          /\b[A-Za-z0-9._%+-]+\s*\(\s*arroba\s*\)\s*[A-Za-z0-9.-]+/gi,
          /\b[A-Za-z0-9._%+-]+\s*\[\s*arroba\s*\]\s*[A-Za-z0-9.-]+/gi,
          /correo[\s:]*(electr[oó]nico)?[\s:]*[A-Za-z0-9._%+-]+/gi
        ],
        severity: 'severe'
      },
      {
        type: 'phone',
        patterns: [
          /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g,
          /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g,
          /(whatsapp|wsp|wp|celular|m[óo]vil|tel[eé]fono|tel|phone)[\s:]*\+?[\d\s-()]{7,}/gi,
          /(mi\s+)?(n[uú]mero|tel[eé]fono|celular|wsp)[\s:]+\+?[\d\s-()]{7,}/gi,
          /ll[aá]mame[\s:]*(al[\s:]*)?[\d\s-()]{7,}/gi
        ],
        severity: 'severe'
      },
      {
        type: 'social',
        patterns: [
          /(instagram|insta|ig)[\s:]*@?[\w.]+/gi,
          /(twitter|x\.com)[\s:]*@?[\w.]+/gi,
          /(facebook|fb)[\s:]*(fb\.com\/)?[\w.]+/gi,
          /(telegram|tg)[\s:]*@?[\w.]+/gi,
          /(discord)[\s:]*[\w.#]+/gi,
          /(tiktok|tt)[\s:]*@?[\w.]+/gi,
          /(linkedin)[\s:]*(linkedin\.com\/)?[\w.]+/gi,
          /s[ií]gueme[\s:]*(en[\s:]*)?@?[\w.]+/gi,
          /b[uú]scame[\s:]*(en[\s:]*)?@?[\w.]+/gi
        ],
        severity: 'warning'
      },
      {
        type: 'payment',
        patterns: [
          /(paypal|pp)[\s:]*[\w@.]+/gi,
          /(bizum|transferencia|cuenta\s+bancaria|iban)/gi,
          /(stripe|mercadopago|western\s*union)/gi,
          /(venmo|cashapp|zelle|revolut)/gi,
          /(pago[\s:]*(por[\s:]*)?)(fuera|externo|directo)/gi,
          /te[\s:]*(paso|env[ií]o)[\s:]*(mi[\s:]*)?.*?(paypal|bizum|cuenta)/gi,
          /hazme[\s:]*(un[\s:]*)?.*?(bizum|transferencia)/gi
        ],
        severity: 'critical'
      },
      {
        type: 'external_link',
        patterns: [
          /https?:\/\/(?!.*?(google\.com\/drive|dropbox\.com|behance\.net|artstation\.com|github\.io))[^\s]+/gi,
          /www\.(?!.*?(google\.com\/drive|dropbox\.com|behance\.net|artstation\.com|github\.io))[^\s]+/gi,
          /(link|enlace)[\s:]*(externo|fuera)/gi
        ],
        severity: 'warning'
      }
    ];

    const result: ModerationResult = {
      isBlocked: false,
      infractions: [],
      severity: 'warning'
    };

    // Analizar el contenido con cada patrón
    for (const patternGroup of detectionPatterns) {
      for (const pattern of patternGroup.patterns) {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`Detected ${patternGroup.type} pattern: ${matches[0]}`);
          
          result.infractions.push({
            type: patternGroup.type,
            pattern: matches[0],
            confidence: 0.9,
            context: content.substring(Math.max(0, content.indexOf(matches[0]) - 20), content.indexOf(matches[0]) + matches[0].length + 20)
          });

          // Actualizar severidad si es mayor
          if (patternGroup.severity === 'critical' || 
              (patternGroup.severity === 'severe' && result.severity !== 'critical')) {
            result.severity = patternGroup.severity;
          }
        }
      }
    }

    result.isBlocked = result.infractions.length > 0;

    // Si se detectaron infracciones, registrarlas y actualizar strikes
    if (result.isBlocked) {
      console.log(`Blocking message with ${result.infractions.length} infractions`);

      // Registrar cada infracción
      for (const infraction of result.infractions) {
        await supabase
          .from('message_infractions')
          .insert({
            user_id: userId,
            conversation_id: conversationId || null,
            message_content: content,
            infraction_type: infraction.type,
            detected_patterns: [infraction],
            severity: result.severity
          });
      }

      // Incrementar strikes si es una infracción severa o crítica
      if (result.severity === 'severe' || result.severity === 'critical') {
        await supabase.rpc('increment_user_strikes', { target_user_id: userId });
        console.log(`Incremented strikes for user ${userId}`);
      }
    }

    console.log(`Moderation result: ${result.isBlocked ? 'BLOCKED' : 'ALLOWED'}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in moderate-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});