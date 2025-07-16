import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

const ArtistProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Artist Profile</h1>
        <p className="text-muted-foreground">Artist profile for ID: {id}</p>
      </div>
    </div>
  );
};

export default ArtistProfile;