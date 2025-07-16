import React from 'react';
import { Shield, Clock, CreditCard, Star, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'All payments are processed securely through Stripe with escrow protection for both parties.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Quick Quote feature allows instant bookings when artists have pre-configured their availability.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: CreditCard,
    title: 'Flexible Contracts',
    description: 'Choose from one-time bookings, recurring freelance work, or full-time employment contracts.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Star,
    title: 'Verified Artists',
    description: 'All artist profiles are manually reviewed and verified before being published on the platform.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Global Community',
    description: 'Connect with talented artists from around the world across multiple creative disciplines.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Zap,
    title: 'Premium Benefits',
    description: 'Upgrade to Premium for enhanced visibility, job board access, and advanced analytics.',
    color: 'from-primary to-primary-glow',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Why Choose{' '}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              ArtUne?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've built the platform with both artists and clients in mind, 
            providing powerful tools and features that make booking talent simple, secure, and efficient.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover-lift shadow-card bg-card/90 backdrop-blur border-0 h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 font-display">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-display">
              99.9%
            </div>
            <div className="text-muted-foreground text-sm">
              Platform Uptime
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2 font-display">
              &lt;24h
            </div>
            <div className="text-muted-foreground text-sm">
              Average Response Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-success mb-2 font-display">
              4.9★
            </div>
            <div className="text-muted-foreground text-sm">
              Average Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-warning mb-2 font-display">
              50+
            </div>
            <div className="text-muted-foreground text-sm">
              Countries Served
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}