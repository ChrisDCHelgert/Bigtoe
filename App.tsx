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
import { UserProfile } from './types';

const App: React.FC = () => {
  // Global State (Mocked)
  const [user, setUser] = useState<UserProfile>({
    name: 'Anonymous User',
    credits: 125,
    isPremium: false,
    plan: 'Free',
    freeTrialUsed: 0,
    freeTrialTotal: 3,
    settings: { language: 'de', trackingEnabled: true }
  });

  const [lastGeneratedImage, setLastGeneratedImage] = useState<{ url: string; metadata: any } | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  const handleConsumption = (amount: number, type: 'generate' | 'upscale') => {
    // Premium Logic: Unlimited? Use no credits? 
    // Assuming Premium means no deductions for now, or we can deduct for tracking. 
    // Let's assume unlimited for now as per "Unlimitiert generieren".
    if (user.isPremium) return;

    if (type === 'generate') {
      if (user.freeTrialUsed < user.freeTrialTotal) {
        setUser(prev => ({ ...prev, freeTrialUsed: prev.freeTrialUsed + 1 }));
      } else {
        setUser(prev => ({ ...prev, credits: Math.max(0, prev.credits - amount) }));
      }
    } else if (type === 'upscale') {
      // Upscale always costs credits (or maybe free depending on interpretation, sticking to 5 as per prompt)
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
    // Find plan details (mocking import usage or using simpler logic if import tricky in single edit)
    // Better to fetch from constants, but for now strict logic:
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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home user={user} />} />
          <Route
            path="/generator"
            element={
              <Generator
                user={user}
                handleConsumption={handleConsumption}
                onGenerate={handleGenerate}
              />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
