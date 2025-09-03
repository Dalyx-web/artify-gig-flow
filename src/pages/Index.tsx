import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturedArtists } from '@/components/landing/FeaturedArtists';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ProCTASection } from '@/components/landing/ProCTASection';
import { LoginSection } from '@/components/landing/LoginSection';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedArtists />
      <FeaturesSection />
      <ProCTASection />
      {!user && <LoginSection />}
      <Footer />
    </div>
  );
};

export default Index;
