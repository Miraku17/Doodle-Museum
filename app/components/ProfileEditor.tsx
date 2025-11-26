import React, { useState, useRef, useEffect } from 'react';
import { DoodleButton, DoodleInput } from './UI';
import { DrawingCanvas } from './DrawingCanvas';
import { User } from 'lucide-react';

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

interface ProfileEditorProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
  onCancel: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave, initialProfile, onCancel }) => {
  const [name, setName] = useState(initialProfile?.name || 'Anonymous Artist');
  const [isDrawingAvatar, setIsDrawingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatarUrl || null);
  
  const handleAvatarSave = (dataUrl: string) => {
    setAvatarUrl(dataUrl);
    setIsDrawingAvatar(false);
  };

  const handleSaveProfile = () => {
    onSave({ name, avatarUrl });
  };

  if (isDrawingAvatar) {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <h3 className="font-doodle text-2xl mb-4">Draw Your Avatar</h3>
        <div className="border-4 border-black p-2 bg-white shadow-lg mb-4">
             {/* We reuse drawing canvas but customized for avatar size/simplicity if needed, 
                 for now reusing the component but we might want to restrict size via CSS or props if DrawingCanvas supports it */}
             <DrawingCanvas 
                onSave={handleAvatarSave}
                // We don't need AI analysis for avatar creation usually
                onAnalyzeRequest={() => {}} 
                isAnalyzing={false}
                canvasWidth={300}
                canvasHeight={300}
             />
        </div>
        <DoodleButton variant="secondary" onClick={() => setIsDrawingAvatar(false)}>
          Cancel Drawing
        </DoodleButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-sm">
      <h2 className="font-doodle text-3xl text-center">Edit Profile</h2>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 border-4 border-black rounded-full overflow-hidden bg-stone-100 flex items-center justify-center group">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={64} className="text-stone-400" />
          )}
          <button 
            onClick={() => setIsDrawingAvatar(true)}
            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-hand font-bold"
          >
            Draw New
          </button>
        </div>
        <p className="font-hand text-sm text-stone-500">Click image to redraw avatar</p>
      </div>

      <div>
        <label className="font-hand text-sm font-bold block mb-1">Artist Name</label>
        <DoodleInput 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your artist name"
          className="text-center"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <DoodleButton variant="secondary" onClick={onCancel} className="flex-1 justify-center">
          Cancel
        </DoodleButton>
        <DoodleButton onClick={handleSaveProfile} className="flex-1 justify-center">
          Save Profile
        </DoodleButton>
      </div>
    </div>
  );
};
