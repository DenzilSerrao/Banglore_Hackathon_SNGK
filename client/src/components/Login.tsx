import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // renamed from username for clarity
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      // Optionally store data.token and user data.
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/rules');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed.');
      console.error(err);
    }
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    // Clear form fields when switching modes 
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">
          {isAdmin ? 'Faculty Login' : 'Student Login'}
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isAdmin ? 'Faculty Email' : 'Student Email'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={isAdmin ? 'Enter faculty email' : 'Enter student email'}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={toggleAdminMode}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                isAdmin 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdmin ? 'Switch to Student Mode' : 'Switch to Faculty Mode'}
            </button>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};