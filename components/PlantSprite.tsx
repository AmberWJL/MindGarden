import React from 'react';
import { motion } from 'framer-motion';
import { ThoughtCard } from '../types';

interface PlantSpriteProps {
  thought: ThoughtCard;
  onClick: (thought: ThoughtCard) => void;
}

export const PlantSprite: React.FC<PlantSpriteProps> = ({ thought, onClick }) => {
  
  // Calculate size based on growth stage
  const getSize = () => {
    switch(thought.growthStage) {
      case 'seed': return 'w-20 h-20';
      case 'sprout': return 'w-28 h-28';
      case 'bloom': return 'w-36 h-36';
      case 'fruit': return 'w-44 h-44';
      default: return 'w-28 h-28';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -4, 0], 
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 260, damping: 20 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
      }}
      style={{
        left: `${thought.position.x}%`,
        top: `${thought.position.y}%`,
      }}
      className="absolute cursor-pointer z-10 group flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      onClick={() => onClick(thought)}
    >
      <div className={`
        relative ${getSize()} flex items-center justify-center 
        transition-transform duration-300 group-hover:scale-110
      `}>
        {/* 
            Applied mix-blend-multiply to make the white background transparent against the map.
            Removed drop-shadow to avoid shadowing the white bounding box.
        */}
        <img 
          src={thought.imageUrl} 
          alt={thought.meta.topic}
          className="w-full h-full object-contain mix-blend-multiply opacity-95 group-hover:opacity-100 transition-opacity"
        />
        
        {/* Optional grounding shadow for depth without the box shadow */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-2 bg-stone-900/10 blur-sm rounded-[100%] -z-10 pointer-events-none" />
      </div>

      {/* Floating Label */}
      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 pointer-events-none z-20">
        <div className="bg-white/90 backdrop-blur-md border border-stone-100 px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center">
          <span className="font-serif text-stone-700 text-sm whitespace-nowrap leading-none mb-0.5">
            {thought.meta.topic}
          </span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">
            {thought.meta.plantSpecies} • {thought.growthStage}
          </span>
        </div>
      </div>
    </motion.div>
  );
};