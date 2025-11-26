"use client";

import React, { useState, useEffect } from 'react';
import { Painting, ViewMode, AICritiqueResponse } from './types';
import { DrawingCanvas } from './components/DrawingCanvas';
import { Gallery } from './components/Gallery';
import { DoodleButton, DoodleInput, Modal } from './components/UI';
import { analyzeDoodle } from './services/geminiService';
import { Palette, GalleryVerticalEnd } from 'lucide-react';

const STORAGE_KEY = 'doodle_museum_artworks';

// Dummy initial data
const INITIAL_PAINTINGS: Painting[] = [
  {
    id: '1',
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // 1x1 pixel placeholder logic handled in component usually, but keeping valid string
    title: 'The Invisible Dot',
    artist: 'Minimalist Mike',
    votes: 5,
    timestamp: Date.now(),
    critique: "A bold statement on the futility of existence, or perhaps just a speck of dirt on the lens."
  }
];

export default function App() {
  const [view, setView] = useState<ViewMode>('HOME');
  const [paintings, setPaintings] = useState<Painting[]>([]);
  
  // State for the "Save" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const [artistName, setArtistName] = useState('');
  const [artTitle, setArtTitle] = useState('');
  const [artCritique, setArtCritique] = useState('');
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPaintings(JSON.parse(stored));
    } else {
        // Load initial dummy if empty
        setPaintings(INITIAL_PAINTINGS); 
    }
  }, []);

  const savePaintingToStorage = (newPainting: Painting) => {
    const updated = [newPainting, ...paintings];
    setPaintings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSaveRequest = (dataUrl: string) => {
    setCurrentImageData(dataUrl);
    setArtTitle('');
    setArtCritique('');
    setIsModalOpen(true);
  };

  const handleAIAnalyze = async (dataUrl: string) => {
    setIsAnalyzing(true);
    const result: AICritiqueResponse = await analyzeDoodle(dataUrl);
    setArtTitle(result.title);
    setArtCritique(result.critique);
    setCurrentImageData(dataUrl); // Ensure we have the data if they clicked AI first
    setIsModalOpen(true); // Open the modal so they can confirm/edit
    setIsAnalyzing(false);
  };

  const confirmSave = () => {
    if (!currentImageData || !artistName || !artTitle) {
      alert("Please provide both a name and a title!");
      return;
    }

    const newPainting: Painting = {
      id: Date.now().toString(),
      dataUrl: currentImageData,
      title: artTitle,
      artist: artistName,
      critique: artCritique || undefined,
      votes: 0,
      timestamp: Date.now()
    };

    savePaintingToStorage(newPainting);
    setIsModalOpen(false);
    setView('GALLERY');
  };

  const handleVote = (id: string) => {
    const updated = paintings.map(p => 
      p.id === id ? { ...p, votes: p.votes + 1 } : p
    );
    // Sort by votes (descending) whenever a vote happens
    updated.sort((a, b) => b.votes - a.votes);
    
    setPaintings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // --- Views ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-8 animate-fade-in p-4">
      <h1 className="font-doodle text-5xl md:text-7xl mb-4 relative inline-block">
        Doodle Museum
        <span className="absolute -top-6 -right-6 text-4xl rotate-12">✏️</span>
      </h1>
      <p className="font-hand text-xl md:text-2xl max-w-lg text-stone-600">
        Welcome to the most prestigious gallery of scribbles on the internet. 
        Paint a masterpiece, get roasted by our AI critic, and hang it on the wall.
      </p>
      
      <div className="flex gap-6 mt-8">
        <DoodleButton onClick={() => setView('PAINT')} className="text-xl px-8 py-4">
          Start Painting
        </DoodleButton>
        <DoodleButton variant="secondary" onClick={() => setView('GALLERY')} className="text-xl px-8 py-4">
          Visit Gallery
        </DoodleButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper bg-paper-pattern text-pencil font-sans selection:bg-yellow-200">
      
      {/* Header / Nav */}
      <nav className="p-4 flex justify-between items-center border-b-2 border-black/10 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div 
          className="font-doodle text-xl font-bold cursor-pointer flex items-center gap-2"
          onClick={() => setView('HOME')}
        >
          <span>🏛️</span> Doodle Museum
        </div>
        <div className="flex gap-4">
            {view !== 'PAINT' && (
                 <button onClick={() => setView('PAINT')} className="flex items-center gap-2 font-hand hover:underline">
                    <Palette size={18} /> Paint
                 </button>
            )}
            {view !== 'GALLERY' && (
                 <button onClick={() => setView('GALLERY')} className="flex items-center gap-2 font-hand hover:underline">
                    <GalleryVerticalEnd size={18} /> Gallery
                 </button>
            )}
        </div>
      </nav>

      <main className="container mx-auto py-8">
        {view === 'HOME' && renderHome()}
        
        {view === 'PAINT' && (
          <div className="flex flex-col items-center">
            <h2 className="font-doodle text-3xl mb-6">Studio</h2>
            <DrawingCanvas 
              onSave={handleSaveRequest} 
              onAnalyzeRequest={handleAIAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {view === 'GALLERY' && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-10">
                <h2 className="font-doodle text-3xl mb-2">Grand Exhibition</h2>
                <p className="font-hand text-stone-500">Vote for your favorites!</p>
            </div>
            <Gallery 
              paintings={paintings} 
              onVote={handleVote} 
              onAddClick={() => setView('PAINT')}
            />
          </div>
        )}
      </main>

      {/* Save / Meta Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="font-doodle text-2xl text-center">Frame Your Art</h3>
          
          {currentImageData && (
            <div className="border-2 border-stone-200 p-2 bg-white self-center shadow-sm rotate-1">
              <img src={currentImageData} alt="Preview" className="w-32 h-32" />
            </div>
          )}

          <div className="space-y-3">
             <div>
                <label className="font-hand text-sm font-bold block mb-1">Title of Work</label>
                <DoodleInput 
                    value={artTitle} 
                    onChange={(e) => setArtTitle(e.target.value)} 
                    placeholder="e.g. The Angry Line"
                />
             </div>
             
             <div>
                <label className="font-hand text-sm font-bold block mb-1">Artist Name</label>
                <DoodleInput 
                    value={artistName} 
                    onChange={(e) => setArtistName(e.target.value)} 
                    placeholder="e.g. Picasso Jr."
                />
             </div>

             {artCritique && (
                <div className="bg-stone-100 p-3 rounded text-sm font-serif italic border-l-4 border-stone-400">
                    <span className="font-bold not-italic text-xs block text-stone-500 mb-1">Museum Curator's Note:</span>
                    "{artCritique}"
                </div>
             )}
          </div>

          <DoodleButton onClick={confirmSave} className="w-full mt-4 justify-center">
            Hang in Museum
          </DoodleButton>
        </div>
      </Modal>

    </div>
  );
}