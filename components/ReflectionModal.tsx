import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, Download } from 'lucide-react';
import { ThoughtCard } from '../types';

interface ReflectionModalProps {
  thought: ThoughtCard | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ 
  thought, 
  onClose, 
  onDelete 
}) => {
  if (!thought) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
        />
        
        {/* Modal Card */}
        <motion.div 
          layoutId={thought.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Side */}
          <div className="md:w-1/2 aspect-square md:aspect-auto bg-stone-100 relative group">
            <img 
              src={thought.imageUrl} 
              alt={thought.meta.topic} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
               <p className="text-white text-xs opacity-80">{thought.meta.topic}</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col bg-white">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2 block">
                Reflection
              </span>
              <p className="text-xl font-serif text-stone-800 italic leading-relaxed">
                "{thought.reflection}"
              </p>
            </div>

            <div className="mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
              <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">
                Original Thought
              </span>
              <p className="text-stone-600 leading-relaxed text-sm">
                {thought.originalText}
              </p>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500 uppercase font-semibold">
                {thought.meta.category}
              </span>
              <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500 uppercase font-semibold">
                {thought.meta.emotion}
              </span>
              <span className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-500 uppercase font-semibold">
                {thought.meta.intensity} intensity
              </span>
            </div>

            <div className="flex-1" />

            {/* Footer Actions */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Calendar size={14} />
                {new Date(thought.createdAt).toLocaleDateString()}
              </div>
              
              <button
                onClick={() => onDelete(thought.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
