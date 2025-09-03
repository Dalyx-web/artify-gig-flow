import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/60 to-background/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headlines */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight font-display">
              WE POWER A{' '}
              <span className="block text-transparent bg-gradient-to-r from-primary-glow to-primary bg-clip-text">
                TALENT WORLD
              </span>
              WHERE
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight font-display">
              <span className="text-transparent bg-gradient-to-r from-primary-glow to-secondary bg-clip-text">
                OPPORTUNITIES
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-2">
                ARE MADE
              </span>
            </h2>
          </div>

          {/* Subheadings */}
          <div className="space-y-3 text-white/90">
            <p className="text-xl md:text-2xl font-semibold">
              A world that puts talent in control.
            </p>
            <p className="text-xl md:text-2xl font-semibold">
              A platform that connects talent with talent seekers.
            </p>
            <p className="text-xl md:text-2xl font-semibold">
              A world of talent Made by you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for musicians, DJs, photographers..."
                className="pl-12 pr-4 h-14 text-lg bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 gradient-button text-white"
              >
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/artists">
              <Button size="lg" className="gradient-button text-white text-lg px-8 hover-lift animate-slide-up">
                <Music className="w-5 h-5 mr-2" />
                Find Artists
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary hover-lift animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                Join as Artist
              </Button>
            </Link>
          </div>

          {/* Go Pro CTA Banner */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 via-secondary/80 to-primary/90 p-1">
              <div className="bg-black/20 rounded-xl backdrop-blur-sm p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                    Limited Time Offer
                  </span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-white/90 mb-4 max-w-md mx-auto">
                  Get exclusive access to the Job Board, advanced analytics, and priority visibility
                </p>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 hover-lift shadow-glow"
                  >
                    Go Pro Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16">
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm md:text-base">Artists</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl md:text-4xl font-bold text-white">1,200+</div>
              <div className="text-white/80 text-sm md:text-base">Bookings</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm md:text-base">Cities</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
              <div className="text-white/80 text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient overlay for extra visual interest */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-30" />
    </section>
  );
}