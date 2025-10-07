'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ReviewFormProps {
  onReviewAdded?: () => void;
}

const MAX_STARS = 5;

const Star: React.FC<{ fillPercentage: number }> = ({ fillPercentage }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-10 h-10 transition-transform duration-200 ease-in-out transform hover:scale-110"
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

const ReviewForm: React.FC<ReviewFormProps> = ({ onReviewAdded }) => {
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const starContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // --- Mouse / Touch Helpers ---
  const getHoverRating = (x: number) => {
    if (!starContainerRef.current) return 0;
    const stars = starContainerRef.current.children;
    let newRating = 0;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i] as HTMLElement;
      const { left, width } = star.getBoundingClientRect();
      if (x >= left && x <= left + width) {
        newRating = i + (x - left) / width;
        break;
      } else if (x > left + width) {
        newRating = i + 1;
      }
    }

    return parseFloat(Math.min(newRating, MAX_STARS).toFixed(1));
  };

  // Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const newRating = getHoverRating(e.clientX);
      setHoverRating(newRating);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHoverRating(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newRating = getHoverRating(e.clientX);
    setRating(newRating);
  };

  // Touch Handlers
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newRating = getHoverRating(touch.clientX);
    setHoverRating(newRating);
  };
  const handleTouchEnd = () => {
    setRating(hoverRating);
    setHoverRating(0);
  };

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') setRating(Math.min(MAX_STARS, parseFloat((rating + 0.1).toFixed(1))));
    if (e.key === 'ArrowLeft') setRating(Math.max(0, parseFloat((rating - 0.1).toFixed(1))));
  };

  const displayRating = hoverRating || rating;

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment || rating === 0) {
      setError('Please fill all fields and select a rating.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('reviews').insert([
        { user_name: userName, comment, rating },
      ]);
      if (error) throw error;

      setUserName('');
      setComment('');
      setRating(0);

      if (onReviewAdded) onReviewAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-900 text-center">Leave a Comment</h3>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-gray-900 font-medium mb-1">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-gray-900 font-medium mb-1">
          Your Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
          placeholder="Write your review..."
          required
        />
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-gray-900 font-medium mb-1">Your Rating</label>
        <div
          ref={starContainerRef}
          className="flex cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={MAX_STARS}
          aria-valuenow={rating}
          aria-label="Star Rating"
        >
          {[...Array(MAX_STARS)].map((_, idx) => {
            const fillValue = Math.min(1, Math.max(0, displayRating - idx));
            return <Star key={idx} fillPercentage={fillValue * 100} />;
          })}
          <span className="ml-2 font-semibold text-yellow-500 text-lg transition-colors duration-200">
            {displayRating.toFixed(1)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default ReviewForm;
