import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Clock, RotateCcw, Home, Flag, Crown, Timer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from '../hooks/use-toast';

const ChessGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const settings = location.state || {};

  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  // Timer states
  const [whiteTime, setWhiteTime] = useState((settings.timeOdds ? settings.player1Time : settings.time || 5) * 60);
  const [blackTime, setBlackTime] = useState((settings.timeOdds ? settings.player2Time : settings.time || 5) * 60);
  const [timerActive, setTimerActive] = useState(true);

  // Timer effect
  useEffect(() => {
    if (!timerActive || gameOver) return;

    const interval = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            handleGameEnd('Black wins on time!');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            handleGameEnd('White wins on time!');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, timerActive, gameOver]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const makeMove = (sourceSquare, targetSquare, piece) => {
    try {
      const gameCopy = new Chess(game.fen());
      
      // Check if it's a pawn promotion
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece?.[1]?.toLowerCase() || 'q'
      });

      if (move === null) return false;

      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory([...moveHistory, move.san]);
      setCurrentTurn(gameCopy.turn());

      // Add increment
      const increment = settings.increment || 0;
      if (move.color === 'w') {
        setWhiteTime(prev => prev + increment);
      } else {
        setBlackTime(prev => prev + increment);
      }

      // Check game status
      checkGameStatus(gameCopy);
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkGameStatus = (currentGame) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'Black' : 'White';
      handleGameEnd(`Checkmate! ${winner} wins!`);
    } else if (currentGame.isDraw()) {
      handleGameEnd('Game drawn!');
    } else if (currentGame.isStalemate()) {
      handleGameEnd('Stalemate! Game drawn.');
    } else if (currentGame.isThreefoldRepetition()) {
      handleGameEnd('Draw by threefold repetition.');
    } else if (currentGame.isInsufficientMaterial()) {
      handleGameEnd('Draw by insufficient material.');
    }
  };

  const handleGameEnd = (result) => {
    setGameOver(true);
    setGameResult(result);
    setTimerActive(false);
    
    // Save game to local storage
    const savedGames = JSON.parse(localStorage.getItem('chessGames') || '[]');
    savedGames.push({
      id: Date.now(),
      date: new Date().toISOString(),
      result,
      moves: moveHistory.length,
      pgn: game.pgn(),
      settings
    });
    localStorage.setItem('chessGames', JSON.stringify(savedGames));
    
    toast({
      title: 'Game Over',
      description: result
    });
  };

  const handleReset = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setCurrentTurn('w');
    setGameOver(false);
    setGameResult(null);
    setWhiteTime((settings.timeOdds ? settings.player1Time : settings.time || 5) * 60);
    setBlackTime((settings.timeOdds ? settings.player2Time : settings.time || 5) * 60);
    setTimerActive(true);
  };

  const handleResign = () => {
    const winner = currentTurn === 'w' ? 'Black' : 'White';
    handleGameEnd(`${winner} wins by resignation!`);
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
            <Home className="w-5 h-5 mr-2 text-white" />
            <span className="text-white">Home</span>
          </Button>
          <div className="flex items-center glass px-6 py-3 rounded-2xl">
            <Crown className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-xl font-semibold text-white">Live Game</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Player Info & Timer */}
          <div className="space-y-6">
            {/* Black Player */}
            <div className={`glass p-6 rounded-2xl transition-all ${
              currentTurn === 'b' && !gameOver ? 'ring-2 ring-white/50' : ''
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-900 mr-3 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{settings.player2Name || 'Black'}</div>
                    <div className="text-white/60 text-sm">Black Pieces</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gray-900/50 rounded-xl p-4">
                <Timer className="w-5 h-5 text-white/70 mr-2" />
                <span className={`text-3xl font-bold ${
                  blackTime < 30 ? 'text-red-400' : 'text-white'
                }`}>
                  {formatTime(blackTime)}
                </span>
              </div>
            </div>

            {/* White Player */}
            <div className={`glass p-6 rounded-2xl transition-all ${
              currentTurn === 'w' && !gameOver ? 'ring-2 ring-white/50' : ''
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white mr-3 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{settings.player1Name || 'White'}</div>
                    <div className="text-white/60 text-sm">White Pieces</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-white/90 rounded-xl p-4">
                <Timer className="w-5 h-5 text-gray-700 mr-2" />
                <span className={`text-3xl font-bold ${
                  whiteTime < 30 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatTime(whiteTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="flex items-center justify-center">
            <div className="glass p-4 rounded-3xl hover-lift" style={{ maxWidth: '600px', width: '100%' }}>
              <Chessboard
                position={gamePosition}
                onPieceDrop={(sourceSquare, targetSquare, piece) => makeMove(sourceSquare, targetSquare, piece)}
                customBoardStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
                customLightSquareStyle={{ backgroundColor: theme.boardLight }}
                customDarkSquareStyle={{ backgroundColor: theme.boardDark }}
                boardWidth={Math.min(window.innerWidth * 0.8, 600)}
              />
            </div>
          </div>

          {/* Right Panel - Controls & Moves */}
          <div className="space-y-6">
            {/* Controls */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Game Controls</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
                <Button
                  onClick={handleResign}
                  disabled={gameOver}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Resign
                </Button>
              </div>
            </div>

            {/* Move History */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Move History</h3>
              <div className="max-h-96 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-white/60 text-center py-4">No moves yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {moveHistory.map((move, index) => (
                      <div
                        key={index}
                        className="glass-dark px-3 py-2 rounded-lg text-white text-sm"
                      >
                        <span className="text-white/60 mr-2">{Math.floor(index / 2) + 1}.</span>
                        {move}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Dialog */}
      <Dialog open={gameOver} onOpenChange={setGameOver}>
        <DialogContent className="glass border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Game Over!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-xl text-white mb-6">{gameResult}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleReset}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              >
                Play Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChessGame;
