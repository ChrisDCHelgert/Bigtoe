import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Generator } from './screens/Generator';
import { Result } from './screens/Result';
import { Gallery } from './screens/Gallery';
import { Checkout } from './screens/Checkout';
import { Credits } from './screens/Credits';
import { Impressum } from './screens/legal/Impressum';
import { Datenschutz } from './screens/legal/Datenschutz';
import { AGB } from './screens/legal/AGB';
import { CookieSettings } from './screens/legal/CookieSettings';
import { Contact } from './screens/Contact';
import { CookieProvider } from './contexts/CookieContext';
import { UserProfile } from './types';
import { CookieConsent } from './components/CookieConsent';
import { AgeGate } from './components/AgeGate';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  // Global State (Mocked)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bigtoe_user');
    return saved ? JSON.parse(saved) : {
      name: 'Anonymous User',
      credits: 125,
      isPremium: false,
      plan: 'Free',
      freeTrialUsed: 0,
      freeTrialTotal: 3,
      settings: { language: 'de', trackingEnabled: true }
    };
  });

  // Persist user state whenever it changes
  React.useEffect(() => {
    localStorage.setItem('bigtoe_user', JSON.stringify(user));
  }, [user]);

  const [lastGeneratedImage, setLastGeneratedImage] = useState<{ url: string; metadata: any } | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  const handleConsumption = (amount: number, type: 'generate' | 'upscale') => {
    if (user.isPremium) return;

    if (type === 'generate') {
      if (user.freeTrialUsed < user.freeTrialTotal) {
        setUser(prev => ({ ...prev, freeTrialUsed: prev.freeTrialUsed + 1 }));
      } else {
        setUser(prev => ({ ...prev, credits: Math.max(0, prev.credits - amount) }));
      }
    } else if (type === 'upscale') {
      setUser(prev => ({ ...prev, credits: Math.max(0, prev.credits - amount) }));
    }
  };

  const handleGenerate = (url: string, metadata: any) => {
    setLastGeneratedImage({ url, metadata });
  };

  const handleSaveToGallery = (image: any) => {
    setGalleryImages(prev => [image, ...prev]);
  };

  const handleUpgrade = (planId: string) => {
    const creditsMap: Record<string, number> = {
      'basic': 100,
      'pro': 500,
      'premium': 1500
    };

    setUser(prev => ({
      ...prev,
      isPremium: true,
      plan: planId as any,
      credits: prev.credits + (creditsMap[planId] || 500)
    }));
  };

  const handleToggleFavorite = (id: string) => {
    setGalleryImages(prev => prev.map(img =>
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  };

  const handleDeleteImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleUpdateSettings = (settings: Partial<UserProfile['settings']>) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings!, ...settings }
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? All data will be lost.')) {
      setUser({
        name: 'Anonymous User',
        credits: 125,
        isPremium: false,
        plan: 'Free',
        freeTrialUsed: 0,
        freeTrialTotal: 3,
        settings: { language: 'de', trackingEnabled: true }
      });
      setGalleryImages([]);
      setLastGeneratedImage(null);
      alert('Account deleted.');
    }
  };

  return (
    <CookieProvider>
      <AgeGate />
      <CookieConsent />
      <Router>
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home user={user} />} />
            <Route
              path="/generator"
              element={
                <ErrorBoundary>
                  <Generator
                    user={user}
                    handleConsumption={handleConsumption}
                    onGenerate={handleGenerate}
                  />
                </ErrorBoundary>
              }
            />
            <Route
              path="/result"
              element={
                <Result
                  result={lastGeneratedImage}
                  onSave={handleSaveToGallery}
                  handleConsumption={handleConsumption}
                  user={user}
                />
              }
            />
            <Route
              path="/gallery"
              element={
                <Gallery
                  images={galleryImages}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteImage}
                />
              }
            />
            <Route path="/premium" element={<Checkout onUpgrade={handleUpgrade} />} />
            <Route path="/checkout" element={<Checkout onUpgrade={handleUpgrade} />} />
            <Route
              path="/profile"
              element={
                <Credits
                  user={user}
                  onUpdateSettings={handleUpdateSettings}
                  onDeleteAccount={handleDeleteAccount}
                />
              }
            />

            {/* Legal Pages */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </CookieProvider>
  );
};

export default App;
