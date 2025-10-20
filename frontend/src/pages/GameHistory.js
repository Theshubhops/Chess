import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trash2, Eye, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';

const GameHistory = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    const savedGames = JSON.parse(localStorage.getItem('chessGames') || '[]');
    setGames(savedGames.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteGame = (gameId) => {
    const updatedGames = games.filter(g => g.id !== gameId);
    setGames(updatedGames);
    localStorage.setItem('chessGames', JSON.stringify(updatedGames));
  };

  const clearAllGames = () => {
    setGames([]);
    localStorage.removeItem('chessGames');
  };

  const viewGameDetails = (game) => {
    setSelectedGame(game);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultColor = (result) => {
    if (result.includes('White wins')) return 'text-blue-400';
    if (result.includes('Black wins')) return 'text-gray-400';
    return 'text-yellow-400';
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
            <Clock className="w-6 h-6 text-amber-400 mr-2" />
            <span className="text-xl font-semibold text-white">Game History</span>
          </div>
          {games.length > 0 && (
            <Button
              onClick={clearAllGames}
              className="glass hover-lift text-red-400"
              variant="ghost"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              <span>Clear All</span>
            </Button>
          )}
        </div>

        {/* Games List */}
        <div className="max-w-6xl mx-auto">
          {games.length === 0 ? (
            <div className="glass p-20 rounded-3xl text-center fade-in">
              <Clock className="w-24 h-24 text-white/30 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">No Games Yet</h3>
              <p className="text-white/70 text-lg mb-8">Start playing to see your game history here</p>
              <Button
                onClick={() => navigate('/setup')}
                className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-2xl"
              >
                Start a Game
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="glass p-6 rounded-2xl transition-all hover-lift fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => viewGameDetails(game)}
                >
                  {/* Game Result */}
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold ${getResultColor(game.result)}`}>
                      {game.result}
                    </h3>
                  </div>

                  {/* Game Info */}
                  <div className="space-y-3">
                    <div className="flex items-center text-white/80">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(game.date)}</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{game.moves} moves</span>
                    </div>
                    {game.settings && (
                      <div className="glass-dark px-3 py-2 rounded-lg">
                        <span className="text-white/60 text-xs">Mode: </span>
                        <span className="text-white text-sm font-semibold">
                          {game.settings.mode === 'offline' ? 'Pass & Play' : 'Online'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewGameDetails(game);
                      }}
                      className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame(game.id);
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Game Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="glass border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Game Details</DialogTitle>
          </DialogHeader>
          {selectedGame && (
            <div className="space-y-4">
              {/* Result */}
              <div className="glass-dark p-4 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Result</div>
                <div className={`text-2xl font-bold ${getResultColor(selectedGame.result)}`}>
                  {selectedGame.result}
                </div>
              </div>

              {/* Game Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-dark p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-1">Date</div>
                  <div className="text-white font-semibold">{formatDate(selectedGame.date)}</div>
                </div>
                <div className="glass-dark p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-1">Total Moves</div>
                  <div className="text-white font-semibold">{selectedGame.moves}</div>
                </div>
              </div>

              {/* Players */}
              {selectedGame.settings && (
                <div className="glass-dark p-4 rounded-xl">
                  <div className="text-white/60 text-sm mb-2">Players</div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                      <span className="text-white">{selectedGame.settings.player1Name || 'White'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-900 border border-white/20 mr-2"></div>
                      <span className="text-white">{selectedGame.settings.player2Name || 'Black'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PGN */}
              <div className="glass-dark p-4 rounded-xl">
                <div className="text-white/60 text-sm mb-2">PGN (Portable Game Notation)</div>
                <ScrollArea className="h-32">
                  <pre className="text-white/90 text-xs font-mono whitespace-pre-wrap">
                    {selectedGame.pgn}
                  </pre>
                </ScrollArea>
              </div>

              <Button
                onClick={() => setShowDetails(false)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameHistory;
