import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="aspect-square cursor-pointer overflow-hidden rounded-lg hover-scale"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeLightbox}
          >
            <X className="h-5 w-5" />
          </Button>

          {selectedIndex !== null && (
            <div className="relative">
              <img
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].alt}
                className="w-full max-h-[80vh] object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
