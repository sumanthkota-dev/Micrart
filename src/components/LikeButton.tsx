'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LikeButtonProps {
  artworkId: number;
  initialLikes: number;
}

export default function LikeButton({ artworkId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .update({ likes: likes + 1 })
        .eq('id', artworkId)
        .select();

      if (error) throw error;
      setLikes(data![0].likes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded">
      ❤️ {likes}
    </button>
  );
}
