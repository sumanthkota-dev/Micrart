// src/app/artwork/[id]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtworkDetailClient from '@/components/ArtworkDetailClient';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  created_at?: string;
}

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}


// src/app/artwork/[id]/page.tsx

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !artwork)
    return <div className="text-center p-8">Artwork not found</div>;

  const formattedDate = artwork.created_at
    ? new Date(artwork.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <ArtworkDetailClient
        artwork={{
          ...artwork,
          formattedDate,
          cover_image: artwork.image_url,
          html_content: artwork.description || '',
        }}
      />
      <Footer />
    </div>
  );
}
