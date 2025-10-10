import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge = ({ count }: NotificationBadgeProps) => {
  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-scale-in"
    >
      {count > 9 ? "9+" : count}
    </Badge>
  );
};
