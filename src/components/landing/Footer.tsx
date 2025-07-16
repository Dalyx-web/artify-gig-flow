import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-button rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ArtUne
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A platform that connects talent with talent seekers. 
              Making opportunities accessible for artists worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* For Artists */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">For Artists</h4>
            <div className="space-y-2 text-sm">
              <Link to="/register?role=artist" className="block text-muted-foreground hover:text-primary transition-colors">
                Join as Artist
              </Link>
              <Link to="/artists" className="block text-muted-foreground hover:text-primary transition-colors">
                Browse Artists
              </Link>
              <Link to="/job-board" className="block text-muted-foreground hover:text-primary transition-colors">
                Job Board
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Premium Benefits
              </a>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">For Clients</h4>
            <div className="space-y-2 text-sm">
              <Link to="/register?role=client" className="block text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
              <Link to="/artists" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Artists
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hello@artune.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Miami, FL<br />United States</span>
              </div>
            </div>
            <div className="space-y-2 text-sm pt-4 border-t border-border">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 ArtUne. All rights reserved. Made with ❤️ for the artist community.
          </p>
        </div>
      </div>
    </footer>
  );
}