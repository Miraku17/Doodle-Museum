import React, { useState } from 'react';
import { Modal, DoodleInput, DoodleButton } from './UI';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (email: string, artistName: string) => void;
  onLoginClick: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSignupSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [artistName, setArtistName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(''); // Clear previous errors

    if (!email || !artistName || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, artistName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
      } else {
        console.log('Signup successful:', data);
        onSignupSuccess(email, artistName);
        // Reset form fields
        setEmail('');
        setArtistName('');
        setPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setEmail('');
    setArtistName('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h3 className="font-doodle text-2xl text-center">Join the Museum</h3>
        
        {error && <p className="text-red-500 text-center font-hand">{error}</p>}

        <div>
          <label className="font-hand text-sm font-bold block mb-1">Email</label>
          <DoodleInput 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="font-hand text-sm font-bold block mb-1">Artist Name</label>
          <DoodleInput 
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Your stage name"
          />
        </div>

        <div>
          <label className="font-hand text-sm font-bold block mb-1">Password</label>
          <div className="relative">
            <DoodleInput 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-hand underline opacity-60 hover:opacity-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="font-hand text-sm font-bold block mb-1">Confirm Password</label>
          <div className="relative">
            <DoodleInput 
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-hand underline opacity-60 hover:opacity-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <DoodleButton onClick={handleSignup} disabled={loading} className="w-full mt-4 justify-center disabled:opacity-50">
          {loading ? 'Signing up...' : 'Sign Up'}
        </DoodleButton>

        <div className="text-center font-hand text-sm mt-2">
          Already have an account?{' '}
          <button 
            onClick={onLoginClick}
            className="underline font-bold hover:text-blue-600"
          >
            Log in
          </button>
        </div>
      </div>
    </Modal>
  );
};
