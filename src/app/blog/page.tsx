'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image_url?: string;
  tags?: string[];
  slug: string;         
  created_at: string;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .ilike('title', `%${searchTerm}%`)
      .eq('published', true)         // only published blogs
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching blogs:', error);
    else setBlogs(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F6] text-[#2E2A27] px-6 py-12 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Craft & Reflections
            </h1>
            <p className="text-gray-600 mt-3 font-light">
              Carvings, inspirations, and creative journeys
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-white border border-[#e7e2de] rounded-full px-5 py-3 text-sm shadow-sm focus:ring-2 focus:ring-[#E2D8F7] focus:border-transparent transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-t-transparent border-[#D1C4E9] rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-600">No blog posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white border border-[#e7e2de] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out hover:-translate-y-1"
                >
                  {/* Cover Image 16:9 */}
                  {blog.cover_image_url && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <img
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6 md:p-7 flex flex-col justify-start">
                    <h2 className="text-2xl font-serif font-semibold text-[#2E2A27] mb-3 tracking-tight group-hover:text-[#8b6f91] transition-colors duration-300">
                      {blog.title}
                    </h2>

                    <div
                      className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags?.length ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full bg-[#F8D7E3]/60 text-[#5A4A4A] border border-[#F8D7E3]/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Footer: Date + Read More */}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xs text-gray-500 italic">
                        {blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </p>

                      <Link
                        href={`/blog/${blog.slug}`} // <-- USE slug here
                        className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2E2A27] border border-[#d7d1cd] rounded-full overflow-hidden transition-all duration-500 hover:text-white group-hover:bg-gradient-to-r from-[#D1E7E3] to-[#E2D8F7] hover:shadow-md"
                      >
                        <span className="relative z-10">Read More</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
