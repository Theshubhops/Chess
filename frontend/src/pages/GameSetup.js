import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Crown, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const GameSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const mode = location.state?.mode || 'offline';

  const [gameSettings, setGameSettings] = useState({
    timeControl: 'bullet',
    customTime: 5,
    customIncrement: 0,
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    timeOdds: false,
    player1Time: 5,
    player2Time: 5
  });

  const timeControls = [
    { id: 'bullet', name: '1+1 Bullet', time: 1, increment: 1, icon: '⚡' },
    { id: 'blitz', name: '3+2 Blitz', time: 3, increment: 2, icon: '🔥' },
    { id: 'rapid', name: '15+10 Rapid', time: 15, increment: 10, icon: '🎯' },
    { id: 'custom', name: 'Custom', time: 0, increment: 0, icon: '⚙️' }
  ];

  const startGame = () => {
    const settings = {
      mode,
      ...gameSettings,
      ...(gameSettings.timeControl !== 'custom' 
        ? timeControls.find(tc => tc.id === gameSettings.timeControl)
        : { time: gameSettings.customTime, increment: gameSettings.customIncrement })
    };
    navigate('/game', { state: settings });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          className="glass mb-8 hover-lift"
          variant="ghost"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-white" />
          <span className="text-white">Back to Home</span>
        </Button>

        {/* Main Setup Card */}
        <div className="max-w-4xl mx-auto glass p-10 rounded-3xl fade-in">
          <div className="flex items-center justify-center mb-8">
            <Crown className="w-10 h-10 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Game Setup</h1>
          </div>

          {/* Time Control Selection */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-white/80 mr-2" />
              <h2 className="text-xl font-semibold text-white">Select Time Control</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeControls.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => setGameSettings({ ...gameSettings, timeControl: tc.id })}
                  className={`p-6 rounded-2xl transition-all hover-scale ${
                    gameSettings.timeControl === tc.id
                      ? 'bg-white/20 border-2 border-white/40'
                      : 'glass border-2 border-transparent'
                  }`}
                >
                  <div className="text-4xl mb-2">{tc.icon}</div>
                  <div className="text-white font-semibold">{tc.name}</div>
                  {tc.time > 0 && (
                    <div className="text-white/70 text-sm mt-1">
                      {tc.time}m + {tc.increment}s
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time Control */}
          {gameSettings.timeControl === 'custom' && (
            <div className="glass-dark p-6 rounded-2xl mb-8 fade-in">
              <h3 className="text-lg font-semibold text-white mb-4">Custom Time Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Time (minutes)</label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={gameSettings.customTime}
                    onChange={(e) => setGameSettings({ ...gameSettings, customTime: parseInt(e.target.value) })}
                    className="glass text-white border-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Increment (seconds)</label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={gameSettings.customIncrement}
                    onChange={(e) => setGameSettings({ ...gameSettings, customIncrement: parseInt(e.target.value) })}
                    className="glass text-white border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Player Names */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Player Names</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">White Player</label>
                <Input
                  value={gameSettings.player1Name}
                  onChange={(e) => setGameSettings({ ...gameSettings, player1Name: e.target.value })}
                  className="glass text-white border-white/20"
                  placeholder="White Player"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm mb-2 block">Black Player</label>
                <Input
                  value={gameSettings.player2Name}
                  onChange={(e) => setGameSettings({ ...gameSettings, player2Name: e.target.value })}
                  className="glass text-white border-white/20"
                  placeholder="Black Player"
                />
              </div>
            </div>
          </div>

          {/* Time Odds Toggle */}
          <div className="glass-dark p-6 rounded-2xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Time Odds</h3>
              <button
                onClick={() => setGameSettings({ ...gameSettings, timeOdds: !gameSettings.timeOdds })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  gameSettings.timeOdds ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  gameSettings.timeOdds ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            {gameSettings.timeOdds && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">White Time (min)</label>
                  <Input
                    type="number"
                    min="1"
                    value={gameSettings.player1Time}
                    onChange={(e) => setGameSettings({ ...gameSettings, player1Time: parseInt(e.target.value) })}
                    className="glass text-white border-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Black Time (min)</label>
                  <Input
                    type="number"
                    min="1"
                    value={gameSettings.player2Time}
                    onChange={(e) => setGameSettings({ ...gameSettings, player2Time: parseInt(e.target.value) })}
                    className="glass text-white border-white/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Start Game Button */}
          <Button
            onClick={startGame}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white rounded-2xl transition-all hover-scale"
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
