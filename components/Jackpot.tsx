import React, { useState, useEffect } from 'react';
import { ArtistStyle } from '../types';
import { ARTIST_STYLES } from '../constants';
import { Palette, Play } from 'lucide-react';

interface JackpotProps {
  currentStyle: ArtistStyle;
  onSelectStyle: (style: ArtistStyle) => void;
  isDark: boolean;
}

export const Jackpot: React.FC<JackpotProps> = ({ currentStyle, onSelectStyle, isDark }) => {
  const [spinning, setSpinning] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(currentStyle);

  useEffect(() => {
    setDisplayStyle(currentStyle);
  }, [currentStyle]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    let count = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomStyle = ARTIST_STYLES[Math.floor(Math.random() * ARTIST_STYLES.length)];
      setDisplayStyle(randomStyle);
      count++;
      if (count >= maxSpins) {
        clearInterval(interval);
        onSelectStyle(randomStyle);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'border-white/20 bg-black/40' : 'border-black/10 bg-white/40'} backdrop-blur-lg transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-bold uppercase tracking-widest ${currentStyle.accentColor}`}>Style Jackpot</h3>
        <Palette className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-800'}`} />
      </div>
      
      <div className="relative overflow-hidden h-24 rounded-lg mb-4 bg-gradient-to-r from-transparent via-white/10 to-transparent border border-white/20 flex items-center justify-center">
        <div className="text-center">
             <span className={`text-2xl font-bold block ${displayStyle.fontFamily} ${isDark ? 'text-white' : 'text-gray-900'}`}>
               {displayStyle.name}
             </span>
             <span className="text-xs opacity-70 block mt-1">{displayStyle.era}</span>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all
          ${spinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          ${isDark ? 'bg-white text-black' : 'bg-black text-white'}
        `}
      >
        <Play className="w-4 h-4" />
        {spinning ? 'Mixing Palette...' : 'Inspire Me'}
      </button>

      <div className="mt-4 grid grid-cols-5 gap-1">
          {ARTIST_STYLES.slice(0, 10).map(s => (
              <button 
                key={s.id} 
                onClick={() => onSelectStyle(s)}
                className={`w-full h-6 rounded-sm transition-transform hover:scale-110 ${s.bgGradient}`}
                title={s.name}
              />
          ))}
      </div>
    </div>
  );
};