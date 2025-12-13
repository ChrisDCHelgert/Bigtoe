import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sparkles, Image as ImageIcon, User, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show nav on onboarding or checkout for immersion
  const hideNav = ['/', '/checkout', '/onboarding'].includes(location.pathname);

  const navItems = [
    { path: '/home', icon: <Home size={24} />, label: 'Home' },
    { path: '/generator', icon: <Sparkles size={24} />, label: 'Erstellen', highlight: true },
    { path: '/gallery', icon: <ImageIcon size={24} />, label: 'Galerie' },
    { path: '/profile', icon: <User size={24} />, label: 'Profil' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 flex justify-center">
      {/* Mobile container constraint */}
      <div className="w-full max-w-md bg-brand-dark min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24">
          {children}
        </main>

        {!hideNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-brand-dark/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 pb-8 z-50">
            <div className="flex justify-between items-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                      isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {item.highlight ? (
                      <div className={`p-3 rounded-full -mt-8 shadow-lg shadow-purple-900/50 transition-transform ${isActive ? 'bg-brand-primary text-white scale-110' : 'bg-brand-card border border-white/10 text-gray-400'}`}>
                         <Sparkles size={24} />
                      </div>
                    ) : (
                      item.icon
                    )}
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
