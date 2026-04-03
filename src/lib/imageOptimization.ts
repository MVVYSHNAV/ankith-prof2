/**
 * Compresses an image file before upload to save bandwidth and storage.
 * @param file The original image file
 * @param maxWidth Maximum width of the compressed image
 * @param quality Compression quality (0.1 to 1.0)
 * @returns Promise resolving to a compressed Blob
 */
export const compressImage = async (file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Only resize if the image is larger than maxWidth
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob (webp is preferred for size, fallback to original type if no webp support)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/webp', // Use WebP for maximum compression
          quality
        );
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
};
