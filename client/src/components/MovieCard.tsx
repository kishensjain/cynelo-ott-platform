import { Link } from "react-router";
import { Star } from "lucide-react";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

function MovieCard({
  movie,
  className,
}: {
  movie: Movie;
  className?: string;
}) {
  const genreName =
    typeof movie.genre === "object" && movie.genre ? movie.genre.name : "";

  return (
    <Link
      to={`/movies/${movie._id}`}
      className={cn("focus-ring group block w-40 shrink-0 sm:w-44", className)}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-lg shadow-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-300/50 group-hover:shadow-amber-950/20">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-semibold text-slate-500">
            {movie.name}
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/0 to-slate-950/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {movie.rating > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/10 bg-slate-950/80 px-2 py-1 font-mono text-xs text-amber-300 backdrop-blur-sm">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            {movie.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="line-clamp-1 text-sm font-medium text-slate-100 transition-colors group-hover:text-amber-200">
          {movie.name}
        </p>
        <p className="font-mono text-xs text-slate-400">
          {movie.year}
          {genreName ? ` / ${genreName}` : ""}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;