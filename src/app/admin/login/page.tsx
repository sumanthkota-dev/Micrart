'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.replace('/admin/dashboard');
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.replace('/admin/dashboard');
    }
  };

  const emailError =
    touched.email && !/\S+@\S+\.\S+/.test(email)
      ? 'Please enter a valid email address.'
      : null;
  const passwordError =
    touched.password && password.length < 6
      ? 'Password must be at least 6 characters.'
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-white/40"
        >
          <div className="text-center mb-8">
            <Image
              src="/images/logo.jpg"
              alt="Admin Portal Logo"
              width={64}
              height={64}
              className="mx-auto mb-3 rounded-full ring-2 ring-indigo-100 shadow-sm"
            />
            <h1 className="text-3xl font-semibold text-gray-800">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back to your control center
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 placeholder-gray-400 transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                emailError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              required
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-gray-800 placeholder-gray-400 transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </span>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
