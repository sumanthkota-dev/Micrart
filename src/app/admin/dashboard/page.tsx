'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

import AdminLayout from '@/components/AdminLayout';
import MetricCard from '@/components/MetricCard';
import { File, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [totalArtworks, setTotalArtworks] = useState<number | null>(null);
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null);

  // Check session & fetch counts
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data.session?.user ?? null;
      if (!currentUser) router.replace('/admin/login');
      else {
        setUser(currentUser);
        setSessionChecked(true);
        await fetchCounts();
        setupRealtimeSubscriptions();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) router.replace('/admin/login');
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch counts from Supabase
  const fetchCounts = async () => {
    try {
      const { count: artworksCount } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true });

      const { count: blogsCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      setTotalArtworks(artworksCount ?? 0);
      setTotalBlogs(blogsCount ?? 0);
    } catch (err) {
      console.error('Failed to fetch counts', err);
      setTotalArtworks(0);
      setTotalBlogs(0);
    }
  };

  // Realtime subscriptions
  const setupRealtimeSubscriptions = () => {
    supabase
      .channel('realtime-artworks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artworks' }, () => fetchCounts())
      .subscribe();

    supabase
      .channel('realtime-blogs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => fetchCounts())
      .subscribe();
  };

  // Show loading spinner while checking session
  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
      >
        <MetricCard
          icon={<File className="w-6 h-6 text-indigo-600" />}
          title="Total Artworks"
          value={totalArtworks}
          loading={totalArtworks === null}
        />
        <MetricCard
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
          title="Total Blogs"
          value={totalBlogs}
          loading={totalBlogs === null}
        />
      </motion.div>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4"> Welcome, Admin! 🎨 </h2>
        <p className="text-gray-700">
          Manage artworks, blogs, and more from the sidebar.  </p>
        <p className="text-gray-700">
          On smaller screens, click the ☰ menu to access navigation.
        </p>
      </motion.div>
    </AdminLayout>
  );
}
