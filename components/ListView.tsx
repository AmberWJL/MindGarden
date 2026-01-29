import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { ThoughtCard, ThoughtCategory } from '../types';

interface ListViewProps {
  thoughts: ThoughtCard[];
  onThoughtClick: (thought: ThoughtCard) => void;
}

const CATEGORIES: ThoughtCategory[] = ['idea', 'todo', 'worry', 'feeling', 'goal', 'memory'];

export const ListView: React.FC<ListViewProps> = ({ thoughts, onThoughtClick }) => {
  const [filter, setFilter] = useState<ThoughtCategory | 'all'>('all');

  const filteredThoughts = thoughts.filter(t => 
    filter === 'all' ? true : t.meta.category === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-serif text-stone-800 font-medium">My Collection</h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === 'all' ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === cat ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredThoughts.map((thought) => (
          <motion.div
            key={thought.id}
            layoutId={`list-${thought.id}`}
            onClick={() => onThoughtClick(thought)}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer group flex flex-col hover:shadow-md transition-all duration-300"
          >
            {/* Minimalist Image Container */}
            <div className="aspect-square bg-white relative p-4 flex items-center justify-center border-b border-stone-50">
              <img 
                src={thought.imageUrl} 
                alt={thought.meta.topic}
                loading="lazy"
                className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-500 border border-stone-100">
                {thought.meta.category}
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-serif font-medium text-stone-800 text-sm mb-1 truncate leading-tight">
                {thought.meta.topic}
              </h3>
              
              <div className="flex items-center justify-between mt-2">
                 <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <Calendar size={10} />
                    {new Date(thought.createdAt).toLocaleDateString()}
                 </div>
                 <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${
                    thought.growthStage === 'seed' ? 'bg-stone-100 text-stone-600' :
                    thought.growthStage === 'sprout' ? 'bg-emerald-50 text-emerald-600' :
                    thought.growthStage === 'bloom' ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                 }`}>
                    {thought.growthStage}
                 </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredThoughts.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block p-4 rounded-full bg-stone-50 mb-4">
             <Calendar className="text-stone-300" size={32} />
          </div>
          <p className="text-stone-400 text-sm">No plants found in this section.</p>
        </div>
      )}
    </div>
  );
};