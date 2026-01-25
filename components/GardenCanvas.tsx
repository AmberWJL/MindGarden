import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';
import { ThoughtCard } from '../types';
import { PlantSprite } from './PlantSprite';

interface GardenCanvasProps {
  thoughts: ThoughtCard[];
  onPlantClick: (thought: ThoughtCard) => void;
  onNewThoughtClick: () => void;
}

const ZoneLabel: React.FC<{ label: string; x: string; y: string; rotate?: number }> = ({ label, x, y, rotate = 0 }) => (
  <div 
    className="absolute pointer-events-none z-10 opacity-50"
    style={{ left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
  >
    <span className="font-serif italic text-stone-500 text-lg tracking-widest mix-blend-multiply">
      {label}
    </span>
  </div>
);

// Animated light particles
const Particle: React.FC<{ delay: number; x: string; y: string }> = ({ delay, x, y }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.4, 0], 
      y: -60, 
      scale: [0.5, 1, 0.5],
      x: [0, Math.random() * 30 - 15, 0]
    }}
    transition={{ 
      duration: 10, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    className="absolute w-3 h-3 rounded-full bg-white blur-[4px] mix-blend-overlay"
    style={{ left: x, top: y }}
  />
);

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ 
  thoughts, 
  onPlantClick,
  onNewThoughtClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Check if we already visited to avoid showing intro every time (optional, but good UX)
  // For this demo, we'll reset it on mount so you can see the effect
  const [showHero, setShowHero] = useState(true);

  // Handle scroll to dismiss hero
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showHero && e.deltaY > 0) {
        setShowHero(false);
      }
    };
    
    // Add listener to window to catch global scroll attempts
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showHero]);

  // Background SVG Map - Soft Organic Watercolor Style
  const BackgroundMap = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
      <defs>
        {/* Massive blur to create the watercolor bleed effect */}
        <filter id="softBleed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>
        <filter id="paperTexture" x="0%" y="0%" width="100%" height="100%">
           <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
           <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" in="noise" result="coloredNoise" />
        </filter>
      </defs>

      {/* Base Canvas Color */}
      <rect width="100" height="100" fill="#FDFCF8" />

      {/* 
        Organic Zones (Watercolor Pools)
      */}
      <g filter="url(#softBleed)" opacity="0.4">
        {/* To-Do Patch (Green/Teal) */}
        <ellipse cx="20" cy="30" rx="25" ry="20" fill="#A7F3D0" /> 
        {/* Idea Meadow (Amber/Gold) */}
        <ellipse cx="80" cy="25" rx="30" ry="25" fill="#FDE68A" />
        {/* Memory Blossoms (Indigo/Periwinkle) */}
        <ellipse cx="50" cy="20" rx="20" ry="15" fill="#C7D2FE" />
        {/* Feelings Grove (Rose/Pink) */}
        <ellipse cx="25" cy="65" rx="25" ry="25" fill="#FECDD3" />
        {/* Worry Shade (Slate/Grey) */}
        <ellipse cx="85" cy="60" rx="20" ry="25" fill="#E2E8F0" />
        {/* Goal Vines (Emerald/Cyan) */}
        <ellipse cx="50" cy="80" rx="30" ry="15" fill="#99F6E4" />
      </g>

      {/* Subtle Topographical Curves */}
      <g fill="none" stroke="#78716C" strokeWidth="0.15" opacity="0.15">
        <path d="M0 40 Q 30 20 60 40 T 100 30" />
        <path d="M0 60 Q 40 80 80 60 T 100 70" />
        <path d="M30 100 Q 50 60 70 100" />
        <circle cx="50" cy="50" r="40" strokeDasharray="10 20" opacity="0.5" />
      </g>
    </svg>
  );

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-paper">
      
      {/* 1. HERO SECTION (The Curtain) */}
      <AnimatePresence>
        {showHero && (
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-paper text-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl"
            >
              <h2 className="font-serif text-4xl md:text-6xl text-stone-700 leading-tight mb-8">
                "The mind is a garden,<br/>
                <span className="text-stone-400 italic">thoughts are the seeds.</span>"
              </h2>
              <p className="text-stone-500 font-sans tracking-wide text-sm md:text-base mb-12 uppercase">
                Plant a thought. See how it feels.
              </p>
            </motion.div>

            {/* Scroll Indicator - Now absolutely positioned at bottom */}
            <motion.button
              onClick={() => setShowHero(false)}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold tracking-widest uppercase">Scroll to Enter</span>
              <ChevronDown size={24} />
            </motion.button>

            {/* Subtle background element for Hero */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gradient-to-b from-stone-100 to-transparent rounded-full blur-3xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. GARDEN MAP (Revealed after scroll) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={!showHero ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
        drag={!showHero}
        dragConstraints={containerRef}
        dragElastic={0.1}
        className="absolute top-1/2 left-1/2 w-[160vw] h-[160vh] cursor-grab active:cursor-grabbing origin-center"
        style={{ 
          marginLeft: '-80vw', 
          marginTop: '-80vh',
          pointerEvents: showHero ? 'none' : 'auto'
        }}
      >
        {/* Central Light Source */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmin] h-[50vmin] bg-radial-gradient from-white via-amber-50/30 to-transparent blur-3xl pointer-events-none opacity-60" />

        {/* The SVG Map Layer */}
        <BackgroundMap />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
             <Particle key={i} delay={i * 1.5} x={`${50 + (Math.random() * 60 - 30)}%`} y={`${50 + (Math.random() * 60 - 30)}%`} />
          ))}
        </div>

        {/* Labels stylized as handwritten map notes */}
        <ZoneLabel label="Field of Duties" x="20%" y="30%" rotate={-5} />
        <ZoneLabel label="Garden of Memory" x="50%" y="15%" />
        <ZoneLabel label="Idea Horizons" x="80%" y="25%" rotate={5} />
        <ZoneLabel label="Deep Grove" x="25%" y="70%" rotate={3} />
        <ZoneLabel label="Quiet Shade" x="85%" y="60%" rotate={-3} />
        <ZoneLabel label="Ascending Vines" x="50%" y="85%" />

        {/* Plants */}
        {thoughts.map((thought) => (
          <PlantSprite 
            key={thought.id} 
            thought={thought} 
            onClick={onPlantClick} 
          />
        ))}

      </motion.div>

      {/* UI OVERLAY ELEMENTS (Only visible when garden is active) */}
      <AnimatePresence>
        {!showHero && (
          <>
            {/* Seed Spot - Floating Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewThoughtClick}
                className="group relative flex items-center justify-center w-20 h-20"
              >
                {/* Custom Organic Button Shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full blur-[10px] opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-stone-800 rounded-[2rem] shadow-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <Plus size={32} className="text-amber-50 relative z-10" />
                </div>
                
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1">
                  <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-serif text-stone-600 shadow-sm border border-stone-200 whitespace-nowrap tracking-wide">
                    Plant a thought
                  </span>
                </div>
              </motion.button>
            </motion.div>

            {/* Empty State */}
            {thoughts.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1.5 }}
                  className="text-center p-8 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/40 shadow-sm"
                >
                    <h3 className="font-serif text-3xl text-stone-600 mb-2">Your Garden Awaits</h3>
                    <p className="text-stone-500 font-serif italic">The soil is fresh and ready.<br/>Plant a thought to see what grows.</p>
                </motion.div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
