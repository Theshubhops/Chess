import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameSetup from './pages/GameSetup';
import ChessGame from './pages/ChessGame';
import OnlineGame from './pages/OnlineGame';
import ThemeCustomizer from './pages/ThemeCustomizer';
import GameHistory from './pages/GameHistory';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/game" element={<ChessGame />} />
          <Route path="/online" element={<OnlineGame />} />
          <Route path="/themes" element={<ThemeCustomizer />} />
          <Route path="/history" element={<GameHistory />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
