"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Painting, ViewMode, AICritiqueResponse } from '../types';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { Gallery } from '../components/Gallery';
import { DoodleButton, DoodleInput, Modal } from '../components/UI';
import { HeroDoodles } from '../components/HeroDoodles';
import { analyzeDoodle } from '../services/geminiService';
import { Palette, GalleryVerticalEnd, LogOut, User } from 'lucide-react';

const STORAGE_KEY = 'doodle_museum_artworks';
const USER_PROFILE_KEY = 'doodle_museum_user_profile';

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

export default function UserHome() {
  const router = useRouter();
  const [view, setView] = useState<ViewMode | 'DASHBOARD'>('DASHBOARD');
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({ name: 'Artist', avatarUrl: null });
  
  // State for the "Save" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artCritique, setArtCritique] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false); // New state for save loading

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from local storage and fetch from API
  useEffect(() => {
    const storedPaintings = localStorage.getItem(STORAGE_KEY);
    if (storedPaintings) {
      setPaintings(JSON.parse(storedPaintings));
    } else {
        setPaintings([]); 
    }

    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setCurrentUser(profile);
    }

    // Fetch latest profile from server
    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/get-profile');
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setCurrentUser(prev => ({ ...prev, ...data.profile }));
                    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ ...JSON.parse(storedProfile || '{}'), ...data.profile }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };
    fetchProfile();
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
    setUserDescription('');
    setIsModalOpen(true);
  };

  const handleAIAnalyze = async (dataUrl: string) => {
    setIsAnalyzing(true);
    const result: AICritiqueResponse = await analyzeDoodle(dataUrl);
    setArtTitle(result.title);
    setArtCritique(result.critique);
    setCurrentImageData(dataUrl);
    setIsModalOpen(true);
    setIsAnalyzing(false);
  };

  const confirmSave = async () => {
    if (!currentImageData || !artTitle) {
      alert("Please provide both a title and image data!");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', artTitle);
    formData.append('description', userDescription);
    formData.append('critique', artCritique || '');
    formData.append('file', currentImageData); // currentImageData is base64 string

    try {
      const response = await fetch('/api/save-doodle', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Failed to save art: ${data.error}`);
        console.error('API Save Error:', data.error);
        return;
      }

      // Success: update local state with the new public URL
      const newPainting: Painting = {
        id: Date.now().toString(), // Use client-side ID for immediate display
        dataUrl: data.image_url, // Use the public URL from Supabase
        title: artTitle,
        artist: currentUser.name,
        description: userDescription,
        critique: artCritique || undefined,
        votes: 0,
        timestamp: Date.now()
      };

      savePaintingToStorage(newPainting); // This updates local state and localStorage
      
      setIsModalOpen(false);
      setView('GALLERY');
    } catch (error) {
      alert("An unexpected error occurred while saving your art.");
      console.error("Client-side save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVote = (id: string) => {
    const updated = paintings.map(p => 
      p.id === id ? { ...p, votes: p.votes + 1 } : p
    );
    updated.sort((a, b) => b.votes - a.votes);
    setPaintings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Logout API error:', errorData.error);
        alert('Logout failed. Please try again.');
        return;
      }
      // Clear local storage items that are user-specific
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem(STORAGE_KEY); // Assuming this is also user-specific in a real app

      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An unexpected error occurred during logout.');
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setView('DASHBOARD');
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-fade-in p-4 relative w-full">
      <HeroDoodles /> 
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        
        {/* Hero Section - Spans 2 columns */}
        <div className="md:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-center items-start text-left rounded-sm">
            <h1 className="font-doodle text-4xl md:text-5xl mb-4 leading-tight">
            🖌️ Welcome back, {currentUser.name}!<br/>Ready to make art?
            </h1>
            <p className="font-hand text-xl text-stone-500 mb-8">
                Grab your pencil and let your imagination run wild.
            </p>
            <DoodleButton onClick={() => setView('PAINT')} className="text-xl px-8 py-4 w-full md:w-auto">
            👉 Start Painting
            </DoodleButton>
        </div>

        {/* Daily Challenge - Spans 1 column */}
        <div className="bg-yellow-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-between rounded-sm">
            <div>
                <h2 className="font-doodle text-2xl mb-4">🔥 Daily Challenge</h2>
                <div className="bg-white border-2 border-black p-4 rotate-2 mb-4 shadow-sm">
                    <p className="font-hand text-lg font-bold text-center text-stone-500">
                    Coming Soon! Check back later for creative prompts.
                    </p>
                </div>
            </div>
            <DoodleButton variant="secondary" disabled className="w-full justify-center mt-2 opacity-50 cursor-not-allowed">
            Coming Soon
            </DoodleButton>
        </div>

        {/* Trending Wall - Spans 3 columns */}
        <div className="md:col-span-3 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-doodle text-3xl">📈 Trending Wall</h2>
                <button disabled className="font-hand font-bold opacity-50 cursor-not-allowed">View All →</button>
            </div>
            
            <div className="text-center py-10 border-2 border-dashed border-stone-300 rounded">
                <p className="font-hand text-xl font-bold text-stone-500">Coming Soon! ✨</p>
            </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper bg-paper-pattern text-pencil font-sans selection:bg-yellow-200">
      
      {/* Header / Nav */}
      <nav className="p-4 flex justify-between items-center border-b-2 border-black/10 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div 
          className="font-doodle text-xl font-bold cursor-pointer flex items-center gap-2"
          onClick={() => setView('DASHBOARD')}
        >
          <span>🏛️</span> Doodle Museum <span className="text-xs font-sans font-normal bg-black text-white px-2 py-0.5 rounded-full">Member</span>
        </div>
        <div className="flex gap-4 items-center">
            <button onClick={() => router.push('/profile')} className="flex items-center gap-2 font-hand hover:underline font-bold">
                {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-black bg-white object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full border border-black bg-stone-200 flex items-center justify-center">
                        <User size={16} />
                    </div>
                )}
                {currentUser.name}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 font-hand hover:text-red-600 transition-colors ml-2">
                <LogOut size={18} /> 
            </button>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        {view === 'DASHBOARD' && renderDashboard()}

        {view === 'PAINT' && (
          <div className="flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6 px-4 max-w-4xl">
                <button onClick={() => setView('DASHBOARD')} className="font-hand underline hover:text-stone-600">← Back to Dashboard</button>
                <h2 className="font-doodle text-3xl">Studio</h2>
                <div className="w-20"></div> {/* Spacer */}
             </div>
            <DrawingCanvas 
              onSave={handleSaveRequest} 
              onAnalyzeRequest={handleAIAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {view === 'GALLERY' && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6 px-4 max-w-6xl">
                <button onClick={() => setView('DASHBOARD')} className="font-hand underline hover:text-stone-600">← Back to Dashboard</button>
                <div className="text-center">
                    <h2 className="font-doodle text-3xl mb-2">Grand Exhibition</h2>
                    <p className="font-hand text-stone-500">Vote for your favorites!</p>
                </div>
                <button onClick={() => setView('PAINT')} className="font-hand font-bold hover:underline">+ Add Yours</button>
            </div>
            <Gallery 
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
                <label className="font-hand text-sm font-bold block mb-1">Description (Optional)</label>
                <textarea 
                    value={userDescription} 
                    onChange={(e) => setUserDescription(e.target.value)} 
                    placeholder="Tell us about your masterpiece..."
                    className="font-hand text-xl border-b-2 border-black bg-transparent focus:outline-none focus:border-stone-500 px-2 py-1 placeholder-stone-400 w-full resize-none h-20"
                />
             </div>

             {artCritique && (
                <div className="bg-stone-100 p-3 rounded text-sm font-serif italic border-l-4 border-stone-400">
                    <span className="font-bold not-italic text-xs block text-stone-500 mb-1">Museum Curator's Note:</span>
                    "{artCritique}"
                </div>
             )}
          </div>

          <DoodleButton onClick={confirmSave} disabled={isSaving} className="w-full mt-4 justify-center disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Hang in Museum'}
          </DoodleButton>
        </div>
      </Modal>

    </div>
  );
}
