import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  location?: string;
  className?: string;
}

export const MapPlaceholder = ({ location, className }: MapPlaceholderProps) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-primary/40 mx-auto" />
          {location && (
            <p className="text-sm text-muted-foreground font-medium">{location}</p>
          )}
          <p className="text-xs text-muted-foreground">Map integration coming soon</p>
        </div>
      </div>
    </Card>
  );
};
