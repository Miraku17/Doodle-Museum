import React from 'react';
import { Painting } from '../types';
import { Heart, Plus } from 'lucide-react';

interface GalleryProps {
  paintings: Painting[];
  onVote: (id: string) => void;
  onAddClick: () => void;
}

const Frame: React.FC<{ painting: Painting; onVote: (id: string) => void }> = ({ painting, onVote }) => {
  return (
    <div className="flex flex-col items-center group">
      {/* The Frame */}
      <div className="relative p-4 bg-white border-[6px] border-double border-stone-800 shadow-xl transition-transform duration-300 hover:scale-105 hover:rotate-1">
        {/* The Art */}
        <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden border border-stone-200">
          <img src={painting.dataUrl} alt={painting.title} className="w-full h-full object-contain" />
        </div>
        
        {/* Plaque */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-amber-100 border border-amber-800 p-1 text-center shadow-md z-10">
          <h3 className="font-doodle text-xs md:text-sm font-bold truncate">{painting.title}</h3>
          <p className="font-hand text-xs text-stone-600 truncate">by {painting.artist}</p>
        </div>
      </div>

      {/* Interaction Area (appears below frame) */}
      <div className="mt-8 text-center w-full max-w-[160px]">
        <div className="flex justify-center items-center gap-2 mb-1">
          <button 
            onClick={() => onVote(painting.id)}
            className="text-red-400 hover:text-red-600 transition-colors active:scale-90"
          >
            <Heart className={painting.votes > 0 ? "fill-current" : ""} size={16} />
          </button>
          <span className="font-hand text-sm">{painting.votes} votes</span>
        </div>
        {painting.critique && (
          <p className="font-hand text-[10px] italic text-stone-500 leading-tight">
            "{painting.critique}"
          </p>
        )}
      </div>
    </div>
  );
};

const EmptyFrame: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div onClick={onClick} className="flex flex-col items-center cursor-pointer group">
      <div className="w-40 h-40 md:w-48 md:h-48 border-4 border-dashed border-stone-300 bg-transparent flex flex-col items-center justify-center transition-all duration-300 group-hover:border-stone-500 group-hover:bg-stone-50">
        <Plus size={32} className="text-stone-300 group-hover:text-stone-500 mb-2" />
        <span className="font-doodle text-xs text-stone-400 group-hover:text-stone-600">Add Your Art</span>
      </div>
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ paintings, onVote, onAddClick }) => {
  // We want to show paintings, plus a bunch of empty slots to make it look like a big museum wall
  const emptySlotsCount = Math.max(0, 11 - paintings.length); // Ensure at least a grid of 12 roughly
  const emptySlots = Array(emptySlotsCount).fill(null);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 pb-20">
        
        {/* Render actual paintings */}
        {paintings.map((painting) => (
          <Frame key={painting.id} painting={painting} onVote={onVote} />
        ))}

        {/* The "Add New" button as the first empty slot */}
        <EmptyFrame onClick={onAddClick} />

        {/* Render decorative empty placeholders */}
        {emptySlots.slice(0, 5).map((_, i) => (
           <div key={`empty-${i}`} className="opacity-30 pointer-events-none flex flex-col items-center">
             <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-stone-200 bg-stone-50" />
           </div>
        ))}
      </div>
    </div>
  );
};