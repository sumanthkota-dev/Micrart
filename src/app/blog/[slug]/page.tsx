// src/app/blog/[slug]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogDetailClient from '@/components/BlogDetailClient';

interface Props {
  params: { slug: string };
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  cover_image_url?: string;
  created_at: string;
  author?: string;     // Optional if you have author info
  tags?: string[];     // Optional tags
  slug: string;
}

async function getBlog(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  return { data, error };
}

export default async function BlogPage({ params }: Props) {
  const slug = params.slug;
  const { data: blog, error } = await getBlog(slug);

  if (error) return <div className="text-center p-8">Failed to fetch blog</div>;
  if (!blog) return <div className="text-center p-8">Blog not found</div>;

  // Format date on the server to avoid hydration mismatch
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6] text-[#2E2A27]">
      <Navbar />
      <BlogDetailClient
        blog={{
          ...blog,
          formattedDate,
          cover_image: blog.cover_image_url,
          html_content: blog.content,
        }}
      />
      <Footer />
    </div>
  );
}
