import React, { useState } from 'react';
import { Modal, DoodleInput, DoodleButton } from './UI';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onSignupClick: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
      } else {
        console.log('Login successful:', data);
        onLoginSuccess(email); // onLoginSuccess currently just takes email
        setEmail('');
        setPassword('');
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
    setPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h3 className="font-doodle text-2xl text-center">Welcome Back!</h3>
        
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

        <DoodleButton onClick={handleLogin} disabled={loading} className="w-full mt-2 justify-center disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log In'}
        </DoodleButton>

        <div className="text-center font-hand text-sm mt-2">
          Don't have an account?{' '}
          <button 
            onClick={onSignupClick}
            className="underline font-bold hover:text-blue-600"
          >
            Sign up
          </button>
        </div>
      </div>
    </Modal>
  );
};
