'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Artwork {
  id: string;
  title: string;
  cover_image?: string;
  html_content: string;
  formattedDate?: string;
}

export default function ArtworkDetailClient({ artwork }: { artwork: Artwork }) {
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
        onClick={() => router.push('/')}
        className="flex items-center gap-2 mb-6 text-indigo-700 hover:text-indigo-900"
      >
        <ChevronLeft size={20} /> Back to Gallery
      </button>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-indigo-800 mb-4">
        {artwork.title}
      </h1>

      {/* Created Date */}
      {artwork.formattedDate && (
        <p className="text-gray-500 text-sm mb-6">Created on {artwork.formattedDate}</p>
      )}

      {/* Cover Image */}
      {artwork.cover_image && (
        <motion.img
          src={artwork.cover_image}
          alt={artwork.title}
          className="w-full rounded-lg shadow-md mb-8 object-cover aspect-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* HTML Content / Description */}
      {artwork.html_content && (
        <div
          className="prose prose-indigo max-w-none prose-headings:font-serif prose-headings:text-indigo-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-800 dark:prose-dark"
          dangerouslySetInnerHTML={{ __html: artwork.html_content }}
        />
      )}
    </motion.main>
  );
}
