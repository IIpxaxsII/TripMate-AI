import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Compass } from 'lucide-react';

interface SearchResult {
  id: number;
  title: string;
  subtitle: string;
  type: 'destination' | 'activity';
}

interface SearchAutocompleteProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

export const SearchAutocomplete = ({ onSelect, placeholder = "Search destinations..." }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Mock search results - replace with actual API call
  const mockSearch = (searchQuery: string): SearchResult[] => {
    const allResults: SearchResult[] = [
      { id: 1, title: 'Paris', subtitle: 'France', type: 'destination' },
      { id: 2, title: 'Bali', subtitle: 'Indonesia', type: 'destination' },
      { id: 3, title: 'Tokyo', subtitle: 'Japan', type: 'destination' },
      { id: 4, title: 'Eiffel Tower Visit', subtitle: 'Paris, France', type: 'activity' },
      { id: 5, title: 'Beach Hopping', subtitle: 'Bali, Indonesia', type: 'activity' },
    ];

    return allResults.filter(
      result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = mockSearch(query);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    if (onSelect) {
      onSelect(result);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-2 max-h-80 overflow-y-auto animate-fade-in">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleSelect(result)}
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {result.type === 'destination' ? (
                  <MapPin className="h-4 w-4 text-primary" />
                ) : (
                  <Compass className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{result.title}</p>
                <p className="text-xs text-muted-foreground">{result.subtitle}</p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
