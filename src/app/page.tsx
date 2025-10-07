'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Artwork {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

interface Review {
  id: number;
  user_name: string;
  comment: string;
  rating?: number;
  created_at?: string;
}

const MAX_STARS = 5;

const Star: React.FC<{ fillPercentage: number }> = ({ fillPercentage }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`grad-${fillPercentage}`}>
        <stop offset={`${fillPercentage}%`} stopColor="#FBBF24" />
        <stop offset={`${fillPercentage}%`} stopColor="#E5E7EB" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15,9 22,9 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9 9,9"
      fill={`url(#grad-${fillPercentage})`}
      stroke="#FBBF24"
      strokeWidth="1"
    />
  </svg>
);

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch Artworks
  const fetchArtworks = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase.from('artworks').select('*');
      if (error) throw error;
      setArtworks(data || []);
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to fetch artworks. Please try again later.');
    } finally {
      setLoadingArtworks(false);
    }
  }, []);

  // Fetch Reviews
  const fetchReviews = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error(err.message);
      setError('Failed to fetch reviews. Please try again later.');
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
    fetchReviews();
  }, [fetchArtworks, fetchReviews]);

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      if (reviews.length > 0) {
        setCurrentReviewIndex((i) => (i + 1) % reviews.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [reviews]);

  // Carousel Controls
  const nextReview = () =>
    setCurrentReviewIndex((i) => (i + 1) % reviews.length);
  const prevReview = () =>
    setCurrentReviewIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Banner */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 text-center">
        <motion.h1
          className="text-5xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Micrart Gallery
        </motion.h1>
        <p className="mt-4 text-lg opacity-90">
          Precision in Every Piece
        </p>
      </section>

      <main className="flex-1 px-6 py-12 max-w-[1300px] mx-auto w-full">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

       <h2 className="text-3xl font-semibold mb-8 text-gray-900 text-center">Carvings</h2>


        {/* Artworks Grid */}
        <section className="mb-16">

          {loadingArtworks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full aspect-square bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <p className="text-gray-500">No artworks available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artworks.map((art) => (
                <motion.div
                  key={art.id}
                  whileHover={{ scale: 1.02 }}
                  className="group block overflow-hidden rounded-xl shadow-md hover:shadow-2xl bg-white transition-shadow duration-300"
                >
                  <Link href={`/artwork/${art.id}`}>
                    <img
                      src={art.image_url}
                      alt={art.title || 'Artwork image'}
                      loading="lazy"
                      className="w-full aspect-square object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {art.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Reviews Carousel */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900">
            What People Say
          </h2>

          {loadingReviews ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="relative max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviews[currentReviewIndex].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {reviews[currentReviewIndex].user_name}
                  </h3>
                  <p className="text-gray-600 mb-3 italic">
                    “{reviews[currentReviewIndex].comment}”
                  </p>
                  {reviews[currentReviewIndex].rating && (
                    <div className="flex justify-center gap-1">
                      {Array.from({ length: MAX_STARS }).map((_, idx) => {
                        const fillValue = Math.min(
                          1,
                          Math.max(
                            0,
                            (reviews[currentReviewIndex].rating || 0) - idx
                          )
                        );
                        return <Star key={idx} fillPercentage={fillValue * 100} />;
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Carousel Controls */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={prevReview}
                  className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  aria-label="Previous Review"
                >
                  Prev
                </button>
                <button
                  onClick={nextReview}
                  className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  aria-label="Next Review"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Review Submission Form */}
        <ReviewForm onReviewAdded={fetchReviews} />
      </main>

      <Footer />
    </div>
  );
}
