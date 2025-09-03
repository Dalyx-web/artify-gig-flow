import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight, Star, Zap, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const premiumFeatures = [
  {
    icon: Crown,
    title: 'Priority Visibility',
    description: 'Get featured prominently in search results',
  },
  {
    icon: Zap,
    title: 'Exclusive Job Board',
    description: 'Access high-paying exclusive opportunities',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Detailed insights about your profile performance',
  },
  {
    icon: Shield,
    title: 'Premium Support',
    description: '24/7 priority customer support',
  },
];

export function ProCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl translate-x-48 translate-y-48" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-primary" />
            <span className="text-primary font-semibold text-lg">Premium Membership</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">
            Unlock Your{' '}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Full Potential
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of successful artists who've elevated their careers with ArtUne Pro. 
            Get exclusive features, premium visibility, and access to high-value opportunities.
          </p>
          
          {/* Special Offer Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary p-1 rounded-full mb-8">
            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-primary font-semibold text-sm">Limited Time: 50% Off First Month</span>
              <Star className="w-4 h-4 text-primary fill-current" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register">
              <Button 
                size="lg" 
                className="gradient-button text-white text-xl px-12 py-4 h-auto hover-lift shadow-glow animate-scale-in"
              >
                <Crown className="w-6 h-6 mr-3" />
                Start Pro Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <div className="text-muted-foreground text-sm">
              <div className="font-semibold">Free 14-day trial</div>
              <div>Cancel anytime • No commitments</div>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover-lift shadow-card bg-card/90 backdrop-blur border-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonial */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-card/80 backdrop-blur rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-muted-foreground mb-6 italic">
              "Since upgrading to ArtUne Pro, I've booked 3x more gigs and connected with premium clients 
              I never would have reached before. The exclusive job board alone pays for itself."
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold">Sarah Martinez</div>
              <div className="text-muted-foreground">Professional Photographer • Pro Member since 2023</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}