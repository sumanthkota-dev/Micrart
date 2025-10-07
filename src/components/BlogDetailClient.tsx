'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogEndCTA from '@/components/BlogEndCTA';

interface Blog {
  id: string;
  title: string;
  cover_image?: string;
  author?: string;
  formattedDate: string;
  tags?: string[];
  html_content: string;
}

export default function BlogDetailClient({ blog }: { blog: Blog }) {
  const router = useRouter();

  return (
    <motion.main
      className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push('/blog')}
        className="flex items-center gap-2 mb-6 text-indigo-700 hover:text-indigo-900 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Blogs
      </button>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-indigo-800 mb-4">
        {blog.title}
      </h1>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-gray-500 text-sm">
        {blog.author && <span>By {blog.author}</span>}
        <span>• {blog.formattedDate}</span>
        {blog.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs hover:bg-indigo-100 transition"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Cover Image */}
      {blog.cover_image && (
        <motion.img
          src={blog.cover_image}
          alt={blog.title}
          className="w-full rounded-lg shadow-md mb-8 object-cover aspect-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* HTML Content */}
      <div
        className="prose prose-indigo max-w-none prose-headings:font-serif prose-headings:text-indigo-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-800 dark:prose-dark"
        dangerouslySetInnerHTML={{ __html: blog.html_content }}
      />

      {/* ✨ Elegant CTA Section */}
      <BlogEndCTA />
    </motion.main>
  );
}
