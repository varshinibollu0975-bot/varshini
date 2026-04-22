import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [hexStream, setHexStream] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      let stream = '';
      for(let i = 0; i < 12; i++) {
        stream += Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0') + ' ';
      }
      setHexStream(stream);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono screen-tear">
      
      {/* Harsh background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] pointer-events-none"></div>
      
      {/* Cryptic Hex Stream Background */}
      <div className="absolute top-4 left-4 text-glitch-gray opacity-30 text-xs w-64 break-words pointer-events-none select-none">
        {hexStream}
      </div>
      <div className="absolute bottom-4 right-4 text-glitch-gray opacity-30 text-xs w-64 break-words pointer-events-none select-none text-right">
        {hexStream.split('').reverse().join('')}
      </div>

      <header className="mb-12 text-center z-10">
        <h1 className="text-7xl font-black tracking-tighter glitch-text" data-text="SYS.SNAKE">
          SYS.SNAKE
        </h1>
        <p className="text-glitch-magenta mt-2 text-xl tracking-[0.5em] flicker">v1.0.0 // ONLINE</p>
      </header>

      <main className="flex flex-col lg:flex-row items-start justify-center gap-16 z-10 w-full max-w-6xl">
        <div className="flex-1 flex justify-center lg:justify-end w-full">
          <SnakeGame />
        </div>
        
        <div className="flex-1 flex flex-col justify-start w-full max-w-md gap-8">
          <MusicPlayer />
          
          <div className="p-4 border-2 border-glitch-cyan bg-glitch-dark text-lg text-glitch-cyan shadow-glitch-cyan relative">
            <div className="absolute -top-3 left-4 bg-black px-2 text-glitch-magenta font-bold">DIAGNOSTICS_OUTPUT</div>
            <ul className="space-y-2 mt-2">
              <li>> INIT_AUDIO_ENGINE... <span className="text-white">OK</span></li>
              <li>> LOAD_PROCEDURAL_TRACKS... <span className="text-white">OK</span></li>
              <li>> CALIBRATE_GRID_MATRIX... <span className="text-white">OK</span></li>
              <li className="text-glitch-magenta animate-pulse">> AWAITING_USER_INPUT_</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
