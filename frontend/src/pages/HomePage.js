import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users, Gamepad2, Clock, Palette, History, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      icon: Users,
      title: 'Online Game',
      description: 'Play with friends via link sharing',
      action: () => navigate('/online'),
      gradient: 'from-emerald-400 to-cyan-500'
    },
    {
      icon: Gamepad2,
      title: 'Pass & Play',
      description: 'Play offline with a friend',
      action: () => navigate('/setup', { state: { mode: 'offline' } }),
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      icon: Clock,
      title: 'Time Controls',
      description: 'Bullet, Blitz, Rapid & Custom',
      action: () => navigate('/setup'),
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      icon: Palette,
      title: 'Customize Themes',
      description: 'Personalize your chess experience',
      action: () => navigate('/themes'),
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      icon: History,
      title: 'Game History',
      description: 'View your past games',
      action: () => navigate('/history'),
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className={`text-center mb-16 ${mounted ? 'fade-in' : 'opacity-0'}`}>
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-16 h-16 text-yellow-400 mr-4" strokeWidth={1.5} />
            <h1 className="text-7xl font-bold text-white tracking-tight">
              Chess<span className="text-yellow-400">Masters</span>
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Experience the timeless game with modern elegance. Play, compete, and master your skills.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`glass group relative p-8 rounded-3xl transition-all hover-lift cursor-pointer ${mounted ? 'fade-in' : 'opacity-0'}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transitionProperty: 'transform, box-shadow, opacity'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              <div className="relative">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 font-light">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className={`glass max-w-4xl mx-auto p-8 rounded-3xl ${mounted ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-2xl font-semibold text-white">Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Complete Chess Rules</h4>
              <p className="text-white/70 text-sm">Castling, En Passant, Promotion & more</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Real-time Chat</h4>
              <p className="text-white/70 text-sm">Communicate during online games</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Local Storage</h4>
              <p className="text-white/70 text-sm">Your games & settings saved locally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
