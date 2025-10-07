'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import {
  Upload,
  Loader2,
  X,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';
import getCroppedImg from '@/lib/cropImage';
import AdminLayout from '@/components/AdminLayout'; // <-- import AdminLayout

export default function NewArtworkPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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

  // --- Image Upload & Crop ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imagePreview || !croppedAreaPixels) {
      toast.error('No image to crop.');
      return;
    }

    try {
      setUploading(true);
      const croppedImg = await getCroppedImg(imagePreview, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setShowCropper(false);

      const response = await fetch(croppedImg);
      const blob = await response.blob();
      const fileName = `artwork-${Date.now()}.jpg`;

      const uploadInterval = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 5 : p));
      }, 150);

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, blob);

      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('artworks').getPublicUrl(fileName);
      const imageUrl = data.publicUrl;
      setCroppedImage(imageUrl);

      toast.success('Artwork Uploaded Successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to crop or upload image.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setCroppedImage(null);
    setShowCropper(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !croppedImage) {
      toast.error('Title and image are required.');
      return;
    }

    try {
      setUploading(true);

      const { error } = await supabase
        .from('artworks')
        .insert([{ title, description, image_url: croppedImage }]);
      if (error) throw error;

      toast.success('Artwork Added Successfully!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save artwork.');
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
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-indigo-600 mb-6">
          Upload New Carving
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Carving Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter carving title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Enter a short description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Carving Image *</label>
            {!imagePreview && (
              <div
                onClick={() => document.getElementById('imageInput')?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center hover:border-indigo-400 transition cursor-pointer"
              >
                <Upload className="w-10 h-10 text-gray-500" />
                <p className="mt-2 text-gray-600 text-sm">
                  Click to upload or drag an image
                </p>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Cropper */}
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

                {/* Aspect ratio buttons */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-4">
                  {[1, 4 / 3, 16 / 9].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspect(ratio)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        aspect === ratio
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {ratio === 1 ? '1:1' : ratio === 4 / 3 ? '4:3' : '16:9'}
                    </button>
                  ))}
                </div>

                {/* Crop and Cancel */}
                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleCropSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Crop
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Upload progress */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Cropped image preview */}
            {croppedImage && !showCropper && (
              <div className="mt-4 flex justify-center">
                <div className="relative inline-block">
                  <img
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="max-h-60 rounded-lg shadow-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Uploading...' : 'Add Artwork'}
            </button>
          </div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}

function SidebarLink({
  label,
  href,
  pathname,
}: {
  label: string;
  href: string;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg font-medium transition ${
        isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'
      }`}
    >
      {label}
    </Link>
  );
}
