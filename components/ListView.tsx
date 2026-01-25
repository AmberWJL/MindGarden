import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-serif text-stone-800 font-medium">My Garden</h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Plants
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                filter === cat ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredThoughts.map((thought) => (
          <motion.div
            key={thought.id}
            layoutId={`list-${thought.id}`}
            onClick={() => onThoughtClick(thought)}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer group flex flex-col h-full"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
              <img 
                src={thought.imageUrl} 
                alt={thought.meta.topic}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-stone-600">
                {thought.meta.category}
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-serif font-medium text-stone-800 text-lg mb-1 leading-tight">
                {thought.meta.topic}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">
                {thought.originalText}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-stone-50 text-xs text-stone-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(thought.createdAt).toLocaleDateString()}
                </div>
                <span className="capitalize">{thought.meta.intensity} intensity</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredThoughts.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          No thoughts found in this section.
        </div>
      )}
    </div>
  );
};
