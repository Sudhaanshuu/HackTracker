import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo('');

    try {
      // Debug: Check environment variables
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Debug: Try direct Supabase auth
      setDebugInfo('Attempting login...');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(`Authentication failed: ${authError.message}`);
        setDebugInfo(`Error: ${authError.message}`);
        return;
      }

      if (data.user) {
        setDebugInfo('Login successful! Checking user data...');
        console.log('Login successful:', data.user);
        
        // Check if user exists in public.users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('User data error:', userError);
          setDebugInfo(`User data error: ${userError.message}`);
        } else {
          console.log('User data:', userData);
          setDebugInfo('User found in database!');
        }
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred');
      setDebugInfo(`Catch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setDebugInfo('Testing Supabase connection...');
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        setDebugInfo(`Connection error: ${error.message}`);
      } else {
        setDebugInfo('Supabase connection successful!');
      }
    } catch (error: any) {
      setDebugInfo(`Connection failed: ${error.message}`);
    }
  };

  const checkAuthUsers = async () => {
    try {
      setDebugInfo('Checking auth.users table...');
      const { data, error } = await supabase.rpc('check_auth_users');
      if (error) {
        // If the function doesn't exist, try a direct query
        const { data: authData, error: authError } = await supabase
          .from('auth.users')
          .select('email, email_confirmed_at')
          .in('email', ['admin@hacktracker.com', 'sarah.green@hacktracker.com', 'alice.chen@hacktracker.com']);
        
        if (authError) {
          setDebugInfo(`Cannot access auth.users: ${authError.message}. You need to create users via Supabase Dashboard.`);
        } else {
          setDebugInfo(`Auth users found: ${JSON.stringify(authData)}`);
        }
      } else {
        setDebugInfo(`Auth check result: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      setDebugInfo(`Auth check failed: ${error.message}. Users must be created via Supabase Dashboard > Authentication > Users`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
            <i className="fas fa-trophy text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">HackTracker</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Debug Tools */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Debug Tools:</p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={testConnection}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200"
              >
                Test Connection
              </button>
              <button
                onClick={checkAuthUsers}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold hover:bg-purple-200"
              >
                Check Auth Users
              </button>
            </div>
            
            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              <strong>If login fails:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Go to Supabase Dashboard → Authentication → Users</li>
                <li>Click "Add User" and create:</li>
                <li>Email: admin@hacktracker.com, Password: admin123</li>
                <li>✅ Check "Auto Confirm User"</li>
                <li>Repeat for other users with their respective emails</li>
              </ol>
            </div>
          </div>

          {/* Demo Login Credentials */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span className="font-semibold">Admin:</span>
                <span>admin@hacktracker.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Mentor:</span>
                <span>sarah.green@hacktracker.com / mentor123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Team:</span>
                <span>alice.chen@hacktracker.com / team123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;