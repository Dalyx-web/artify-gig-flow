import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Ban, 
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface InfractionData {
  id: string;
  user_id: string;
  message_content: string;
  infraction_type: string;
  severity: string;
  blocked_at: string;
  reviewed_by: string | null;
  review_status: string | null;
  profiles: {
    full_name: string | null;
    email: string;
    user_type: string;
  } | null;
}

interface UserStrike {
  user_id: string;
  strike_count: number;
  last_strike_at: string;
  suspension_until: string | null;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Stats {
  totalInfractions: number;
  totalUsers: number;
  activeConversations: number;
  suspendedUsers: number;
  infractionsByType: Record<string, number>;
  infractionsByDay: Array<{ date: string; count: number }>;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [infractions, setInfractions] = useState<InfractionData[]>([]);
  const [strikes, setStrikes] = useState<UserStrike[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalInfractions: 0,
    totalUsers: 0,
    activeConversations: 0,
    suspendedUsers: 0,
    infractionsByType: {},
    infractionsByDay: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.profile?.user_type === 'admin') {
      fetchData();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchData = async () => {
    try {
      // Fetch infractions with user profiles
      const { data: infractionsData, error: infractionsError } = await supabase
        .from('message_infractions')
        .select(`
          id,
          user_id,
          message_content,
          infraction_type,
          severity,
          blocked_at,
          reviewed_by,
          review_status,
          profiles!user_id (
            full_name,
            email,
            user_type
          )
        `)
        .order('blocked_at', { ascending: false })
        .limit(50);

      if (infractionsError) throw infractionsError;

      // Fetch user strikes with profiles
      const { data: strikesData, error: strikesError } = await supabase
        .from('user_strikes')
        .select(`
          user_id,
          strike_count,
          last_strike_at,
          suspension_until,
          profiles!user_id (
            full_name,
            email
          )
        `)
        .order('last_strike_at', { ascending: false });

      if (strikesError) throw strikesError;

      // Fetch basic stats
      const { data: usersCount } = await supabase
        .from('profiles')
        .select('user_id', { count: 'exact' });

      const { data: messagesCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact' });

      // Transform and filter data to match our interfaces
      const processedInfractions = (infractionsData || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        message_content: item.message_content,
        infraction_type: item.infraction_type,
        severity: item.severity,
        blocked_at: item.blocked_at,
        reviewed_by: item.reviewed_by,
        review_status: item.review_status,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as InfractionData[];

      const processedStrikes = (strikesData || []).map(item => ({
        user_id: item.user_id,
        strike_count: item.strike_count,
        last_strike_at: item.last_strike_at,
        suspension_until: item.suspension_until,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as UserStrike[];

      // Calculate stats
      const suspendedUsersCount = processedStrikes.filter(
        strike => strike.suspension_until && new Date(strike.suspension_until) > new Date()
      ).length;

      const infractionsByType = processedInfractions.reduce((acc, infraction) => {
        acc[infraction.infraction_type] = (acc[infraction.infraction_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setInfractions(processedInfractions);
      setStrikes(processedStrikes);
      setStats({
        totalInfractions: processedInfractions.length,
        totalUsers: usersCount?.length || 0,
        activeConversations: Math.floor((messagesCount?.length || 0) / 10), // Aproximación
        suspendedUsers: suspendedUsersCount,
        infractionsByType,
        infractionsByDay: [] // TODO: Implementar en siguientes iteraciones
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del panel de administración",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewInfraction = async (infractionId: string, status: 'confirmed' | 'false_positive') => {
    try {
      const { error } = await supabase
        .from('message_infractions')
        .update({
          review_status: status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', infractionId);

      if (error) throw error;

      toast({
        title: "Revisión completada",
        description: `Infracción marcada como ${status === 'confirmed' ? 'confirmada' : 'falso positivo'}`,
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error reviewing infraction:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la revisión",
        variant: "destructive"
      });
    }
  };

  const handleRemoveSuspension = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_strikes')
        .update({ suspension_until: null })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Suspensión eliminada",
        description: "El usuario ya puede usar la mensajería nuevamente",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error removing suspension:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la suspensión",
        variant: "destructive"
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      warning: 'secondary',
      severe: 'destructive',
      critical: 'destructive'
    };
    return (
      <Badge variant={variants[severity as keyof typeof variants] as any}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getInfractionTypeBadge = (type: string) => {
    const colors = {
      email: 'bg-blue-100 text-blue-800',
      phone: 'bg-green-100 text-green-800',
      social: 'bg-purple-100 text-purple-800',
      payment: 'bg-red-100 text-red-800',
      external_link: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Panel de Moderación</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Infracciones</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInfractions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Suspendidos</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones Activas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeConversations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Infractions by Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Infracciones por Tipo</CardTitle>
            <CardDescription>Distribución de tipos de infracciones detectadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.infractionsByType).map(([type, count]) => (
                <div key={type} className="text-center">
                  {getInfractionTypeBadge(type)}
                  <div className="text-2xl font-bold mt-2">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="infractions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="infractions">Infracciones Recientes</TabsTrigger>
            <TabsTrigger value="strikes">Usuarios con Strikes</TabsTrigger>
          </TabsList>

          <TabsContent value="infractions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Infracciones Recientes</CardTitle>
                <CardDescription>Últimas 50 infracciones detectadas por el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {infractions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>¡No hay infracciones recientes!</p>
                    <p className="text-sm">El sistema de moderación está funcionando bien.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {infractions.map((infraction) => (
                      <div key={infraction.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{infraction.profiles?.full_name}</span>
                              <Badge variant="outline">{infraction.profiles?.user_type}</Badge>
                              {getInfractionTypeBadge(infraction.infraction_type)}
                              {getSeverityBadge(infraction.severity)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(infraction.blocked_at), {
                                addSuffix: true,
                                locale: es
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!infraction.review_status && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewInfraction(infraction.id, 'false_positive')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Falso Positivo
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewInfraction(infraction.id, 'confirmed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirmar
                                </Button>
                              </>
                            )}
                            {infraction.review_status && (
                              <Badge variant={infraction.review_status === 'confirmed' ? 'destructive' : 'secondary'}>
                                {infraction.review_status === 'confirmed' ? 'Confirmada' : 'Falso Positivo'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Alert>
                          <AlertDescription>
                            <strong>Mensaje bloqueado:</strong> "{infraction.message_content}"
                          </AlertDescription>
                        </Alert>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strikes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios con Strikes</CardTitle>
                <CardDescription>Usuarios que han recibido advertencias por infracciones</CardDescription>
              </CardHeader>
              <CardContent>
                {strikes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>¡No hay usuarios con strikes!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {strikes.map((strike) => {
                      const isSuspended = strike.suspension_until && new Date(strike.suspension_until) > new Date();
                      return (
                        <div key={strike.user_id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{strike.profiles?.full_name}</span>
                                <Badge variant="outline">{strike.profiles?.email}</Badge>
                                <Badge variant={strike.strike_count >= 3 ? 'destructive' : 'secondary'}>
                                  {strike.strike_count} Strike{strike.strike_count !== 1 ? 's' : ''}
                                </Badge>
                                {isSuspended && (
                                  <Badge variant="destructive">
                                    <Ban className="w-3 h-3 mr-1" />
                                    Suspendido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Último strike: {formatDistanceToNow(new Date(strike.last_strike_at), {
                                  addSuffix: true,
                                  locale: es
                                })}
                              </p>
                              {isSuspended && (
                                <p className="text-sm text-red-600">
                                  Suspendido hasta: {new Date(strike.suspension_until!).toLocaleString('es-ES')}
                                </p>
                              )}
                            </div>
                            {isSuspended && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveSuspension(strike.user_id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Levantar Suspensión
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;