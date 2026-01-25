import React from 'react';
import { motion } from 'framer-motion';
import { ThoughtCard, ThoughtCategory } from '../types';
import { Sparkles, Sprout, Flower2, TreeDeciduous, Leaf, Circle, Moon } from 'lucide-react';

interface PlantSpriteProps {
  thought: ThoughtCard;
  onClick: (thought: ThoughtCard) => void;
}

const getCategoryIcon = (category: ThoughtCategory) => {
  switch (category) {
    case 'idea': return <Sparkles size={20} className="text-amber-600/70" />;
    case 'todo': return <Sprout size={20} className="text-emerald-600/70" />;
    case 'worry': return <Moon size={20} className="text-slate-500/70" />;
    case 'feeling': return <Flower2 size={20} className="text-rose-500/70" />;
    case 'goal': return <TreeDeciduous size={20} className="text-teal-600/70" />;
    case 'memory': return <Flower2 size={20} className="text-indigo-500/70" />;
    default: return <Circle size={20} className="text-stone-400" />;
  }
};

const getBubbleGradient = (category: ThoughtCategory) => {
  // Watercolor gradients
  switch (category) {
    case 'idea': return 'from-amber-100/80 to-yellow-200/40 border-amber-200/50';
    case 'todo': return 'from-emerald-100/80 to-green-200/40 border-emerald-200/50';
    case 'worry': return 'from-slate-100/80 to-gray-200/40 border-slate-200/50';
    case 'feeling': return 'from-rose-100/80 to-pink-200/40 border-rose-200/50';
    case 'goal': return 'from-teal-100/80 to-cyan-200/40 border-teal-200/50';
    case 'memory': return 'from-indigo-100/80 to-blue-200/40 border-indigo-200/50';
    default: return 'from-stone-100/80 to-stone-200/40 border-stone-200/50';
  }
};

export const PlantSprite: React.FC<PlantSpriteProps> = ({ thought, onClick }) => {
  const timeAgo = (date: number) => {
    const minutes = Math.floor((Date.now() - date) / 60000);
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -4, 0], // Subtle breathing float
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 260, damping: 20 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
      }}
      style={{
        left: `${thought.position.x}%`,
        top: `${thought.position.y}%`,
      }}
      className="absolute cursor-pointer z-10 group"
      onClick={() => onClick(thought)}
    >
      {/* 
         Watercolor Bubble Shape 
         Using borderRadius with different values to create "organic blob" shape
      */}
      <div className={`
        relative w-16 h-16 flex items-center justify-center 
        bg-gradient-to-br ${getBubbleGradient(thought.meta.category)}
        backdrop-blur-[2px] border shadow-sm
        transition-all duration-300 group-hover:scale-110 group-hover:shadow-md
      `}
      style={{
        borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%' // Organic shape
      }}
      >
        {/* Shine reflection */}
        <div className="absolute top-3 left-3 w-3 h-2 bg-white/60 rounded-full blur-[1px] rotate-45" />
        
        {/* Icon */}
        <div className="relative z-10 opacity-80 mix-blend-multiply">
          {getCategoryIcon(thought.meta.category)}
        </div>
      </div>

      {/* Floating Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-1 pointer-events-none">
        <div className="bg-paper/90 backdrop-blur-sm border border-stone-100 px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center">
          <span className="font-serif text-stone-700 text-sm whitespace-nowrap leading-none mb-0.5">
            {thought.meta.topic}
          </span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">
            {timeAgo(thought.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
