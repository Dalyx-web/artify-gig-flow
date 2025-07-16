import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

const Artists = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Find Artists</h1>
        <p className="text-muted-foreground">Artists catalog coming soon...</p>
      </div>
    </div>
  );
};

export default Artists;