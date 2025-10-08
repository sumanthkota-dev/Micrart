'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { Upload, Loader2, X } from 'lucide-react';
import getCroppedBlogImg from '@/lib/getCroppedBlogImg';
import AdminLayout from '@/components/AdminLayout';
import 'react-quill-new/dist/quill.snow.css';
export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';
const ReactQuill = dynamicImport(() => import('react-quill-new'), { ssr: false });

const aspectRatios = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
];

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function NewBlogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(aspectRatios[0].value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropper, setShowCropper] = useState(false);

  // --- Session check ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      if (!currentUser) router.replace('/admin/login');
      else {
        setUser(currentUser);
        setSessionChecked(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) router.replace('/admin/login');
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!coverImage || !croppedAreaPixels) {
      toast.error('No image to crop.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const croppedBlob = await getCroppedBlogImg(coverImage, croppedAreaPixels);
      const fileName = `blog-${Date.now()}-${coverImage.name}`;

      const uploadInterval = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 5 : p));
      }, 150);

      const { error: uploadError } = await supabase
        .storage
        .from('blog-images')
        .upload(fileName, croppedBlob, { upsert: true });

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      setCroppedImage(data.publicUrl);
      setShowCropper(false);

      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to crop or upload image.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    setCroppedImage(null);
    setShowCropper(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !croppedImage) {
      toast.error('Title, content, and cover image are required.');
      return;
    }

    try {
      setUploading(true);
      const slug = generateSlug(title);
      const { error } = await supabase
        .from('blog_posts')
        .insert([{ title, content, cover_image_url: croppedImage, slug }]);
      if (error) throw error;
      toast.success('Blog published successfully!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish blog.');
    } finally {
      setUploading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-indigo-600 mb-6">Create New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Blog Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              placeholder="Write your blog content..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image *</label>
            {!imagePreview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center hover:border-indigo-400 transition cursor-pointer"
              >
                <Upload className="w-10 h-10 text-gray-500" />
                <p className="mt-2 text-gray-600 text-sm">Click to upload</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}

            {showCropper && imagePreview && (
              <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden mt-4">
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  {aspectRatios.map((ar) => (
                    <button
                      key={ar.label}
                      type="button"
                      onClick={() => setAspect(ar.value)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        aspect === ar.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4">
                  <button type="button" onClick={handleCropSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Crop</button>
                  <button type="button" onClick={clearImage} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                </div>
              </div>
            )}

            {croppedImage && !showCropper && (
              <div className="mt-4 flex justify-center relative">
                <img src={croppedImage} alt="Cropped" className="max-h-60 rounded-lg object-contain" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
            >
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? 'Uploading...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
