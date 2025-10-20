import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Copy, Users, Send, ArrowLeft, Wifi, WifiOff, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';

const OnlineGame = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [connected, setConnected] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState('w');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    const newPeer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    newPeer.on('open', (id) => {
      setPeerId(id);
      toast({
        title: 'Connected',
        description: 'Your game ID is ready to share!'
      });
    });

    newPeer.on('connection', (connection) => {
      setConn(connection);
      setConnected(true);
      setPlayerColor('w'); // Host plays white
      setupConnection(connection);
      toast({
        title: 'Player Connected',
        description: 'Your opponent has joined!'
      });
    });

    newPeer.on('error', (error) => {
      console.error('Peer error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to establish connection'
      });
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const setupConnection = (connection) => {
    connection.on('data', (data) => {
      if (data.type === 'move') {
        handleOpponentMove(data.move);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, { text: data.text, isOwn: false }]);
      }
    });

    connection.on('close', () => {
      setConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Your opponent has left the game'
      });
    });
  };

  const connectToPeer = () => {
    if (!remotePeerId.trim()) {
      toast({
        title: 'Invalid ID',
        description: 'Please enter a valid game ID'
      });
      return;
    }

    const connection = peer.connect(remotePeerId);
    connection.on('open', () => {
      setConn(connection);
      setConnected(true);
      setPlayerColor('b'); // Guest plays black
      setupConnection(connection);
      toast({
        title: 'Connected',
        description: 'Successfully connected to the game!'
      });
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    toast({
      title: 'Copied!',
      description: 'Game ID copied to clipboard'
    });
  };

  const makeMove = (sourceSquare, targetSquare, piece) => {
    const gameCopy = new Chess(game.fen());
    
    // Check if it's the player's turn
    if (gameCopy.turn() !== playerColor) return false;

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece?.[1]?.toLowerCase() || 'q'
      });

      if (move === null) return false;

      setGame(gameCopy);
      setGamePosition(gameCopy.fen());

      // Send move to opponent
      if (conn && connected) {
        conn.send({ type: 'move', move: { from: sourceSquare, to: targetSquare, promotion: piece?.[1]?.toLowerCase() || 'q' } });
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleOpponentMove = (move) => {
    const gameCopy = new Chess(game.fen());
    gameCopy.move(move);
    setGame(gameCopy);
    setGamePosition(gameCopy.fen());
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !conn) return;

    const message = { text: messageInput, isOwn: true };
    setMessages(prev => [...prev, message]);
    conn.send({ type: 'message', text: messageInput });
    setMessageInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            {connected ? (
              <Wifi className="w-6 h-6 text-green-400 mr-2" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-400 mr-2" />
            )}
            <span className="text-lg font-semibold text-white">
              {connected ? 'Connected' : 'Waiting for connection'}
            </span>
          </div>
        </div>

        {!connected ? (
          <div className="max-w-2xl mx-auto glass p-10 rounded-3xl fade-in">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2">Online Game</h1>
              <p className="text-white/70">Share your game ID or connect to a friend</p>
            </div>

            {/* Your Game ID */}
            <div className="glass-dark p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Your Game ID</h3>
              <div className="flex gap-3">
                <Input
                  value={peerId}
                  readOnly
                  className="glass text-white border-white/20 font-mono"
                  placeholder="Generating..."
                />
                <Button
                  onClick={copyToClipboard}
                  disabled={!peerId}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-2">Share this ID with your friend to start playing</p>
            </div>

            {/* Connect to Friend */}
            <div className="glass-dark p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-3">Connect to Friend</h3>
              <div className="flex gap-3">
                <Input
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="glass text-white border-white/20 font-mono"
                  placeholder="Enter friend's game ID"
                  onKeyPress={(e) => e.key === 'Enter' && connectToPeer()}
                />
                <Button
                  onClick={connectToPeer}
                  disabled={!remotePeerId.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                >
                  Connect
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Chess Board */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="glass p-4 rounded-3xl hover-lift" style={{ maxWidth: '600px', width: '100%' }}>
                <Chessboard
                  position={gamePosition}
                  onPieceDrop={(sourceSquare, targetSquare, piece) => makeMove(sourceSquare, targetSquare, piece)}
                  boardOrientation={playerColor === 'w' ? 'white' : 'black'}
                  customBoardStyle={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                  customLightSquareStyle={{ backgroundColor: theme.boardLight }}
                  customDarkSquareStyle={{ backgroundColor: theme.boardDark }}
                  boardWidth={Math.min(window.innerWidth * 0.8, 600)}
                />
                <div className="text-center mt-4">
                  <span className="glass-dark px-4 py-2 rounded-full text-white font-semibold">
                    You are playing as {playerColor === 'w' ? 'White' : 'Black'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="glass p-6 rounded-2xl flex flex-col" style={{ height: '600px' }}>
              <div className="flex items-center mb-4">
                <MessageCircle className="w-5 h-5 text-cyan-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Chat</h3>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No messages yet. Say hello!</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-xs ${
                          msg.isOwn
                            ? 'bg-cyan-500 text-white'
                            : 'glass-dark text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="glass text-white border-white/20"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineGame;
