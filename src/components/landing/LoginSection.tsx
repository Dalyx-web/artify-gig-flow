import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Palette, Sparkles } from 'lucide-react';

export function LoginSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to transform your creative journey?
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join ArtUne Today
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with thousands of artists and clients creating amazing projects together
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="hover-scale shadow-elegant border-0 bg-card/80 backdrop-blur transition-all duration-300 hover:shadow-glow group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm an Artist</CardTitle>
              <p className="text-muted-foreground">
                Showcase your talent, build your portfolio, and connect with clients worldwide
              </p>
            </CardHeader>
            <CardContent>
              <Link to="/register?role=artist">
                <Button className="w-full gradient-button text-white h-12 transition-all duration-300 hover:scale-105">
                  Start Your Artist Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                • Create your portfolio • Set your rates • Get discovered
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale shadow-elegant border-0 bg-card/80 backdrop-blur transition-all duration-300 hover:shadow-glow group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">I'm a Client</CardTitle>
              <p className="text-muted-foreground">
                Find talented artists, manage projects, and bring your creative vision to life
              </p>
            </CardHeader>
            <CardContent>
              <Link to="/register?role=client">
                <Button variant="outline" className="w-full h-12 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-105">
                  Find Perfect Artists
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                • Browse portfolios • Post projects • Secure payments
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 animate-fade-in">
          <div className="bg-card/50 backdrop-blur rounded-lg p-6 border border-border/50">
            <p className="text-muted-foreground mb-3">
              Already part of the ArtUne community?
            </p>
            <Link to="/login">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 font-medium">
                Sign in to your account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}