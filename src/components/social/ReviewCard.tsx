import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RatingComponent } from "./RatingComponent";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

export const ReviewCard = ({ author, rating, date, content, helpful }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">{author}</h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingComponent value={rating} readonly size="sm" />
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed mb-4">{content}</p>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful ({helpful})
        </Button>
      </CardContent>
    </Card>
  );
};
