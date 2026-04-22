import React, { useState, useEffect } from 'react';
import { TRACKS } from '../constants';
import { audioEngine } from '../services/audioEngine';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      audioEngine.play(currentTrackIndex);
    } else {
      audioEngine.pause();
    }
    return () => audioEngine.pause();
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-black border-2 border-glitch-magenta p-6 shadow-glitch-magenta w-full mx-auto flex flex-col items-center gap-6 relative">
      <div className="absolute -top-3 right-4 bg-black px-2 text-glitch-cyan font-bold">AUDIO_STREAM</div>
      
      <div className="text-center w-full">
        <div className="text-glitch-gray text-sm mb-2">STATUS: {isPlaying ? <span className="text-glitch-cyan flicker">ACTIVE</span> : <span className="text-glitch-magenta">IDLE</span>}</div>
        <div className="text-white font-bold text-2xl truncate border-b-2 border-glitch-gray pb-2">
          {currentTrack.title}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={handlePrev}
          className="text-glitch-cyan hover:text-white hover:bg-glitch-cyan p-2 border-2 border-transparent hover:border-glitch-cyan transition-colors"
          aria-label="Previous Track"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>

        <button 
          onClick={handlePlayPause}
          className="bg-black text-glitch-magenta border-2 border-glitch-magenta p-4 hover:bg-glitch-magenta hover:text-black transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="ml-1">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <button 
          onClick={handleNext}
          className="text-glitch-cyan hover:text-white hover:bg-glitch-cyan p-2 border-2 border-transparent hover:border-glitch-cyan transition-colors"
          aria-label="Next Track"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>
      </div>
      
      {/* Visualizer dummy bars */}
      <div className="flex gap-2 h-12 items-end w-full justify-center border-t-2 border-glitch-gray pt-4">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 bg-glitch-cyan ${isPlaying ? 'flicker' : ''}`}
            style={{ 
              height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '10%',
              animationDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
