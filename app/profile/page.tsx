"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Painting, ViewMode } from '../types';
import { DoodleButton, DoodleInput, Modal } from '../components/UI';
import { HeroDoodles } from '../components/HeroDoodles';
import { ProfileEditor } from '../components/ProfileEditor';
import { Palette, LogOut, User, Edit, ArrowLeft, Trophy, Star, Flame, Medal, Target } from 'lucide-react';

const STORAGE_KEY = 'doodle_museum_artworks';
const USER_PROFILE_KEY = 'doodle_museum_user_profile';

interface UserProfile {
  name: string;
  avatarUrl: string | null;
  bio?: string;
  joinedDate?: number;
}

interface Badge {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  unlocked: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>({ 
    name: 'Artist', 
    avatarUrl: null,
    bio: 'Just a doodle enthusiast.',
    joinedDate: Date.now()
  });
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load Profile
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      setCurrentUser(JSON.parse(storedProfile));
    }

    // Load Paintings
    const storedPaintings = localStorage.getItem(STORAGE_KEY);
    if (storedPaintings) {
      setPaintings(JSON.parse(storedPaintings));
    }
  }, []);

  const handleSaveProfile = (profile: { name: string; avatarUrl: string | null }) => {
    const updatedProfile = { ...currentUser, ...profile };
    setCurrentUser(updatedProfile);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  // Filter paintings for current user (assuming simple name match for this demo)
  const userPaintings = paintings.filter(p => p.artist === currentUser.name);

  // Calculated Stats
  const totalVotes = userPaintings.reduce((acc, curr) => acc + curr.votes, 0);
  const avgVotes = userPaintings.length > 0 ? Math.round(totalVotes / userPaintings.length) : 0;

  // Badges Logic (Simulated)
  const badges: Badge[] = [
    { 
        id: 'first_doodle', 
        icon: <Palette size={24} />, 
        name: 'First Doodle', 
        description: 'Uploaded your first painting',
        unlocked: userPaintings.length > 0 
    },
    { 
        id: 'trending', 
        icon: <Flame size={24} />, 
        name: 'Trending Artist', 
        description: 'One artwork reached 10 votes',
        unlocked: userPaintings.some(p => p.votes >= 10)
    },
    { 
        id: 'gallery_builder', 
        icon: <Trophy size={24} />, 
        name: 'Gallery Builder', 
        description: 'Uploaded 5 artworks',
        unlocked: userPaintings.length >= 5
    },
    { 
        id: 'star', 
        icon: <Star size={24} />, 
        name: 'Super Star', 
        description: 'Received 50 total votes',
        unlocked: totalVotes >= 50
    }
  ];

  if (isEditing) {
    return (
      <div className="min-h-screen bg-paper bg-paper-pattern flex flex-col items-center justify-center p-4">
         <ProfileEditor 
            initialProfile={currentUser}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
         />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper bg-paper-pattern text-pencil font-sans selection:bg-yellow-200 pb-10">
       
       {/* Nav */}
       <nav className="p-4 flex justify-between items-center border-b-2 border-black/10 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <button 
            onClick={() => router.push('/home')}
            className="font-hand text-xl font-bold cursor-pointer flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={20} /> Back to Museum
        </button>
        <DoodleButton variant="danger" onClick={() => router.push('/')} className="px-4 py-1 text-sm">
           <LogOut size={16} className="inline mr-1" /> Logout
        </DoodleButton>
      </nav>

      <main className="container mx-auto p-4 max-w-4xl flex flex-col gap-8">
        
        {/* 1. Basic Profile Info */}
        <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mt-8 rounded-sm flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
                {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-black object-cover bg-stone-100" />
                ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-stone-200 flex items-center justify-center text-stone-400">
                        <User size={64} />
                    </div>
                )}
                <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 bg-yellow-300 p-2 border-2 border-black rounded-full hover:bg-yellow-400 transition-colors shadow-sm"
                    title="Edit Profile"
                >
                    <Edit size={16} />
                </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <h1 className="font-doodle text-4xl mb-2">{currentUser.name}</h1>
                <p className="font-hand text-stone-500 mb-4">
                    Member since {new Date(currentUser.joinedDate || Date.now()).toLocaleDateString()}
                </p>
                <div className="bg-stone-50 border-2 border-black/10 p-3 rounded-lg inline-block md:block w-full">
                    <p className="font-hand text-lg italic">"{currentUser.bio || "Ready to create something amazing!"}"</p>
                </div>
            </div>
        </div>

        {/* 4. Stats Section (Moved up for better layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Artworks', value: userPaintings.length, color: 'bg-blue-100' },
                { label: 'Total Votes', value: totalVotes, color: 'bg-red-100' },
                { label: 'Avg Votes', value: avgVotes, color: 'bg-green-100' },
                { label: 'Rank', value: '#42', color: 'bg-yellow-100' }, // Dummy rank
            ].map((stat, i) => (
                <div key={i} className={`${stat.color} border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-${(i % 2 === 0 ? 1 : -1)} transform transition-transform hover:scale-105`}>
                    <p className="font-hand text-stone-600 text-sm font-bold uppercase">{stat.label}</p>
                    <p className="font-doodle text-3xl">{stat.value}</p>
                </div>
            ))}
        </div>

        {/* 3. Achievements / Badges */}
        <div className="bg-white/50 border-2 border-dashed border-black p-6 rounded-sm">
            <h2 className="font-doodle text-2xl mb-6 flex items-center gap-2">
                <Medal className="text-yellow-500" /> Sticker Book (Achievements)
            </h2>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badges.map(badge => (
                    <div 
                        key={badge.id} 
                        className={`w-24 h-24 flex flex-col items-center justify-center p-2 border-2 rounded-full text-center transition-all ${badge.unlocked ? 'bg-white border-black shadow-md opacity-100' : 'bg-stone-200 border-stone-400 opacity-50 grayscale'}`}
                        title={badge.description}
                    >
                        <div className="mb-1">{badge.icon}</div>
                        <p className="font-hand text-[10px] font-bold leading-tight">{badge.name}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. Your Paintings Section */}
        <div>
            <h2 className="font-doodle text-3xl mb-6 flex items-center gap-2">
                <Palette /> Your Masterpieces
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Create New Placeholder */}
                <button 
                    onClick={() => router.push('/home?action=paint')} // Assuming we can handle param or just link
                    className="aspect-square border-4 border-dashed border-stone-300 flex flex-col items-center justify-center gap-2 hover:bg-stone-50 hover:border-stone-400 transition-colors group bg-white"
                >
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Palette className="text-stone-400" />
                    </div>
                    <span className="font-hand font-bold text-stone-400">Create New</span>
                </button>

                {userPaintings.map(painting => (
                    <div key={painting.id} className="relative border-4 border-black bg-white p-2 shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="aspect-square overflow-hidden mb-2 border border-stone-100">
                            <img src={painting.dataUrl} alt={painting.title} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-hand font-bold text-sm truncate">{painting.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                             <span className="text-[10px] font-sans text-stone-400">{new Date(painting.timestamp).toLocaleDateString()}</span>
                             <span className="bg-yellow-200 px-1.5 rounded text-xs font-bold font-hand">{painting.votes} ❤️</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}
