import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
}

export const PhotoUpload = ({ onUpload, maxFiles = 5 }: PhotoUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + previews.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} photos allowed`,
        variant: "destructive"
      });
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    if (onUpload) {
      onUpload(files);
    }

    toast({
      title: "Photos added",
      description: `${files.length} photo(s) ready to upload`
    });
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative aspect-square overflow-hidden group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePreview(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {previews.length < maxFiles && (
        <Card
          className="border-dashed border-2 p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">Upload Photos</p>
          <p className="text-xs text-muted-foreground">
            Click to select up to {maxFiles - previews.length} more photo(s)
          </p>
        </Card>
      )}
    </div>
  );
};
