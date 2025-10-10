/**
 * Compress an image file to reduce its size
 * @param file - The image file to compress
 * @param maxWidth - Maximum width of the compressed image
 * @param maxHeight - Maximum height of the compressed image
 * @param quality - Compression quality (0-1)
 * @returns Promise with the compressed image as a Blob
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
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

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
  });
};

/**
 * Generate a blur placeholder for an image
 * @param file - The image file
 * @returns Promise with the blur placeholder as a data URL
 */
export const generateBlurPlaceholder = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 10; // Small size for blur effect
        
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL());
      };

      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
  });
};
