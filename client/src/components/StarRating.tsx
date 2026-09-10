import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}

function StarRating({
  value,
  onChange,
  size = 16,
  className,
}: StarRatingProps) {
  const interactive = Boolean(onChange);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(
            "focus-ring rounded-sm",
            interactive ? "cursor-pointer" : "cursor-default",
          )}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={
              n <= Math.round(value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-slate-500"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
