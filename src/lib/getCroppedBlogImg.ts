// utils/getCroppedBlogImg.ts
export default async function getCroppedBlogImg(
  image: File | string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const imageSrc = typeof image === 'string' ? image : URL.createObjectURL(image);
  const img = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    img,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Failed to create cropped image'));
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}

// Helper to load image from URL or ObjectURL
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}
