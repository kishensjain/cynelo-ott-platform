import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/types";

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies?: Movie[];
  loading?: boolean;
}

export function MovieRow({ title, subtitle, movies, loading }: MovieRowProps) {
  if (!loading && (!movies || movies.length === 0)) return null;

  return (
    <section className="py-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-semibold text-xl text-slate-100">{title}</h2>
        {subtitle && (
          <span className="font-mono text-xs text-slate-400">{subtitle}</span>
        )}
      </div>
      <div className="row-scroll flex gap-4 overflow-x-auto pb-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0 sm:w-44">
                <Skeleton className="aspect-2/3 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-3 w-1/2" />
              </div>
            ))
          : movies!.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
      </div>
    </section>
  );
}
