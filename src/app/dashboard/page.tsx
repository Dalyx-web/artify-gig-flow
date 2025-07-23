import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { User, Calendar, Heart, MessageCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold">
                ¡Hola, {profile.full_name || profile.username}!
              </h1>
              <p className="text-muted-foreground">
                Cuenta: {profile.role === 'artista' ? 'Artista' : 'Cliente'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reservas</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mensajes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Perfil</p>
                <p className="text-sm text-primary">Completar</p>
              </div>
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {profile.role === 'artista' 
              ? '¡Bienvenido a tu espacio creativo!' 
              : '¡Descubre talento increíble!'
            }
          </h2>
          <p className="text-muted-foreground mb-6">
            {profile.role === 'artista'
              ? 'Completa tu perfil, sube tu portafolio y comienza a recibir solicitudes de clientes.'
              : 'Explora artistas, guarda tus favoritos y reserva el talento perfecto para tu evento.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {profile.role === 'artista' ? (
              <>
                <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Completar Perfil
                </button>
                <button className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                  Ver Mi Perfil Público
                </button>
              </>
            ) : (
              <>
                <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Explorar Artistas
                </button>
                <button className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                  Mis Favoritos
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <h4 className="font-medium mb-2">Configuración</h4>
              <p className="text-sm text-muted-foreground">
                Ajusta tu perfil y preferencias
              </p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <h4 className="font-medium mb-2">Ayuda</h4>
              <p className="text-sm text-muted-foreground">
                Encuentra respuestas a tus preguntas
              </p>
            </button>
            <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
              <h4 className="font-medium mb-2">Soporte</h4>
              <p className="text-sm text-muted-foreground">
                Contacta con nuestro equipo
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}