import React, { useEffect, useState } from "react";

interface ImageGalleryProps {
  searchTerm: string;
}

const ImageGallery = ({ searchTerm }: ImageGalleryProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=1`,
        {
          headers: {
            Authorization: import.meta.env.VITE_PEXELS_API_KEY, // ✅ Uses your API key
          },
        }
      );

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setImageUrl(data.photos[0].src.landscape);
      }
    };

    fetchImage();
  }, [searchTerm]);

  return (
    <div className="aspect-video bg-gray-200">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={searchTerm}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
