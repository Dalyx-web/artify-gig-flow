import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Headphones, Camera, Mic, Piano, Guitar, CircleDot, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'musicians',
    name: 'Musicians',
    description: 'Live bands, solo artists, and instrumentalists',
    icon: Music2,
    color: 'from-primary to-primary-glow',
    count: 150,
  },
  {
    id: 'djs',
    name: 'DJs',
    description: 'Event DJs, club DJs, and electronic music artists',
    icon: Headphones,
    color: 'from-secondary to-purple-500',
    count: 85,
  },
  {
    id: 'vocalists',
    name: 'Vocalists',
    description: 'Singers, opera performers, and vocal coaches',
    icon: Mic,
    color: 'from-pink-500 to-rose-500',
    count: 120,
  },
  {
    id: 'photographers',
    name: 'Photographers',
    description: 'Event photographers and videographers',
    icon: Camera,
    color: 'from-amber-500 to-orange-500',
    count: 95,
  },
  {
    id: 'pianists',
    name: 'Pianists',
    description: 'Classical, jazz, and contemporary piano players',
    icon: Piano,
    color: 'from-emerald-500 to-teal-500',
    count: 65,
  },
  {
    id: 'guitarists',
    name: 'Guitarists',
    description: 'Electric, acoustic, and classical guitar players',
    icon: Guitar,
    color: 'from-blue-500 to-indigo-500',
    count: 110,
  },
  {
    id: 'drummers',
    name: 'Drummers',
    description: 'Percussionists and rhythm section artists',
    icon: CircleDot,
    color: 'from-red-500 to-pink-500',
    count: 45,
  },
  {
    id: 'entertainers',
    name: 'Entertainers',
    description: 'MCs, hosts, and performance artists',
    icon: Gamepad2,
    color: 'from-purple-500 to-violet-500',
    count: 75,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Find Talent By{' '}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Category
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse community of talented professionals across multiple artistic disciplines
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={`/artists?category=${category.id}`}
                className="group"
              >
                <Card className="hover-lift shadow-card bg-card/80 backdrop-blur border-0 h-full animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Category Info */}
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="text-lg font-bold text-primary">
                        {category.count}+ artists
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Link to="/artists">
            <button className="text-primary hover:text-primary-glow font-semibold hover:underline">
              Browse all categories →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}