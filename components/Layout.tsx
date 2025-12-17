import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user?: UserProfile;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();

  // Don't show nav on onboarding or checkout for immersion
  const hideNav = ['/', '/checkout', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-brand-bg text-gray-100 flex flex-col">
      {/* Header - Desktop Navigation */}
      {!hideNav && user && <Header user={user} />}

      {/* Main Content Area - Responsive Container */}
      <main className="pb-20 md:pb-8 flex-1">
        {children}
      </main>

      {/* Footer - Always visible except on special pages */}
      {!hideNav && <Footer />}

      {/* Bottom Navigation - Mobile Only */}
      {!hideNav && <BottomNav />}
    </div>
  );
};
