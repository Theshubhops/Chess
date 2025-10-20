import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, RefreshCw, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Chessboard } from 'react-chessboard';
import { toast } from '../hooks/use-toast';

const ThemeCustomizer = () => {
  const navigate = useNavigate();
  const { theme, updateTheme, resetTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(theme);

  const presetThemes = [
    {
      name: 'Classic',
      boardLight: '#F0D9B5',
      boardDark: '#B58863',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2'
    },
    {
      name: 'Ocean',
      boardLight: '#E0F2F7',
      boardDark: '#4A90A4',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      primaryColor: '#4facfe',
      secondaryColor: '#00f2fe'
    },
    {
      name: 'Forest',
      boardLight: '#D7E8D4',
      boardDark: '#5C8D5A',
      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
      primaryColor: '#56ab2f',
      secondaryColor: '#a8e063'
    },
    {
      name: 'Sunset',
      boardLight: '#FFE5B4',
      boardDark: '#D2691E',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      primaryColor: '#fa709a',
      secondaryColor: '#fee140'
    },
    {
      name: 'Midnight',
      boardLight: '#6B7280',
      boardDark: '#374151',
      background: 'linear-gradient(135deg, #2d3561 0%, #c05c7e 100%)',
      primaryColor: '#2d3561',
      secondaryColor: '#c05c7e'
    },
    {
      name: 'Neon',
      boardLight: '#E0BBE4',
      boardDark: '#957DAD',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      primaryColor: '#f093fb',
      secondaryColor: '#f5576c'
    },
    {
      name: 'Emerald',
      boardLight: '#D1FAE5',
      boardDark: '#10B981',
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      primaryColor: '#10b981',
      secondaryColor: '#3b82f6'
    },
    {
      name: 'Fire',
      boardLight: '#FED7AA',
      boardDark: '#F97316',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      primaryColor: '#ff6b6b',
      secondaryColor: '#feca57'
    }
  ];

  const applyTheme = (newTheme) => {
    updateTheme(newTheme);
    setPreviewTheme(newTheme);
    toast({
      title: 'Theme Applied',
      description: 'Your custom theme has been saved!'
    });
  };

  const handleReset = () => {
    resetTheme();
    setPreviewTheme(theme);
    toast({
      title: 'Theme Reset',
      description: 'Theme restored to default'
    });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-500"
      style={{ background: previewTheme.background }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            className="glass hover-lift"
            variant="ghost"
          >
            <ArrowLeft className="w-5 h-5 mr-2 text-white" />
            <span className="text-white">Back</span>
          </Button>
          <div className="flex items-center glass px-6 py-3 rounded-2xl">
            <Palette className="w-6 h-6 text-pink-400 mr-2" />
            <span className="text-xl font-semibold text-white">Theme Customizer</span>
          </div>
          <Button
            onClick={handleReset}
            className="glass hover-lift"
            variant="ghost"
          >
            <RefreshCw className="w-5 h-5 mr-2 text-white" />
            <span className="text-white">Reset</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Preset Themes */}
            <div className="glass p-6 rounded-2xl fade-in">
              <h3 className="text-xl font-semibold text-white mb-4">Preset Themes</h3>
              <div className="grid grid-cols-2 gap-4">
                {presetThemes.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewTheme(preset)}
                    className={`glass-dark p-4 rounded-xl transition-all hover-scale ${
                      previewTheme.name === preset.name ? 'ring-2 ring-white/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold">{preset.name}</span>
                      {previewTheme.name === preset.name && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className="h-10 rounded-lg"
                        style={{ backgroundColor: preset.boardLight }}
                      ></div>
                      <div 
                        className="h-10 rounded-lg"
                        style={{ backgroundColor: preset.boardDark }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="glass p-6 rounded-2xl fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold text-white mb-4">Custom Board Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Light Squares</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={previewTheme.boardLight}
                      onChange={(e) => setPreviewTheme({ ...previewTheme, boardLight: e.target.value })}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <Input
                      value={previewTheme.boardLight}
                      onChange={(e) => setPreviewTheme({ ...previewTheme, boardLight: e.target.value })}
                      className="glass text-white border-white/20 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Dark Squares</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={previewTheme.boardDark}
                      onChange={(e) => setPreviewTheme({ ...previewTheme, boardDark: e.target.value })}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <Input
                      value={previewTheme.boardDark}
                      onChange={(e) => setPreviewTheme({ ...previewTheme, boardDark: e.target.value })}
                      className="glass text-white border-white/20 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Gradient */}
            <div className="glass p-6 rounded-2xl fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold text-white mb-4">Background Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Primary Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={previewTheme.primaryColor}
                      onChange={(e) => {
                        const newPrimary = e.target.value;
                        setPreviewTheme({
                          ...previewTheme,
                          primaryColor: newPrimary,
                          background: `linear-gradient(135deg, ${newPrimary} 0%, ${previewTheme.secondaryColor} 100%)`
                        });
                      }}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <Input
                      value={previewTheme.primaryColor}
                      onChange={(e) => {
                        const newPrimary = e.target.value;
                        setPreviewTheme({
                          ...previewTheme,
                          primaryColor: newPrimary,
                          background: `linear-gradient(135deg, ${newPrimary} 0%, ${previewTheme.secondaryColor} 100%)`
                        });
                      }}
                      className="glass text-white border-white/20 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Secondary Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={previewTheme.secondaryColor}
                      onChange={(e) => {
                        const newSecondary = e.target.value;
                        setPreviewTheme({
                          ...previewTheme,
                          secondaryColor: newSecondary,
                          background: `linear-gradient(135deg, ${previewTheme.primaryColor} 0%, ${newSecondary} 100%)`
                        });
                      }}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <Input
                      value={previewTheme.secondaryColor}
                      onChange={(e) => {
                        const newSecondary = e.target.value;
                        setPreviewTheme({
                          ...previewTheme,
                          secondaryColor: newSecondary,
                          background: `linear-gradient(135deg, ${previewTheme.primaryColor} 0%, ${newSecondary} 100%)`
                        });
                      }}
                      className="glass text-white border-white/20 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={() => applyTheme(previewTheme)}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white rounded-2xl transition-all hover-scale"
            >
              Apply Theme
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Preview</h3>
              <div className="flex justify-center">
                <Chessboard
                  position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                  customLightSquareStyle={{ backgroundColor: previewTheme.boardLight }}
                  customDarkSquareStyle={{ backgroundColor: previewTheme.boardDark }}
                  boardWidth={400}
                  customBoardStyle={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            </div>

            {/* Theme Info */}
            <div className="glass p-6 rounded-2xl fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-semibold text-white mb-4">Current Theme</h3>
              <div className="space-y-3">
                <div className="glass-dark p-3 rounded-lg">
                  <div className="text-white/60 text-sm mb-1">Light Squares</div>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded mr-3 border-2 border-white/20"
                      style={{ backgroundColor: previewTheme.boardLight }}
                    ></div>
                    <span className="text-white font-mono">{previewTheme.boardLight}</span>
                  </div>
                </div>
                <div className="glass-dark p-3 rounded-lg">
                  <div className="text-white/60 text-sm mb-1">Dark Squares</div>
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded mr-3 border-2 border-white/20"
                      style={{ backgroundColor: previewTheme.boardDark }}
                    ></div>
                    <span className="text-white font-mono">{previewTheme.boardDark}</span>
                  </div>
                </div>
                <div className="glass-dark p-3 rounded-lg">
                  <div className="text-white/60 text-sm mb-1">Background Gradient</div>
                  <div className="flex items-center">
                    <div 
                      className="w-full h-8 rounded border-2 border-white/20"
                      style={{ background: previewTheme.background }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
