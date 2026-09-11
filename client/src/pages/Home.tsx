import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Play, Info, Star } from "lucide-react";
import { moviesApi } from "@/api/movies";
import { errorMessage } from "@/lib/api";
import MovieRow from "@/components/MovieRow";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types";
import toast from "react-hot-toast";

function Home() {
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [newMovies, setNewMovies] = useState<Movie[]>();
  const [topMovies, setTopMovies] = useState<Movie[]>();
  const [randomMovies, setRandomMovies] = useState<Movie[]>();

  useEffect(() => {
    moviesApi
      .getTop()
      .then((movies) => {
        setTopMovies(movies);
        if (movies[0]) setFeatured(movies[0]);
      })
      .catch((error) => toast.error(errorMessage(error)));

    moviesApi
      .getNew()
      .then(setNewMovies)
      .catch((error) => toast.error(errorMessage(error)));

    moviesApi
      .getRandom()
      .then(setRandomMovies)
      .catch((error) => toast.error(errorMessage(error)));
  }, []);

  const genreName =
    featured && typeof featured.genre === "object" && featured.genre
      ? featured.genre.name
      : null;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-700">
        {featured ? (
          <div className="absolute inset-0">
            <img
              src={featured.image}
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/20 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        <div className="relative mx-auto flex min-h-[64vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6">
          <p className="font-mono text-xs uppercase text-blue-600">
            Now showing
          </p>
          <h1 className="mt-3 max-w-2xl font-semibold text-4xl leading-[1.05] text-slate-100 sm:text-6xl">
            {featured ? featured.name : "Discover your next favorite film"}
          </h1>
          {featured && (
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-sm text-slate-400">
              <span>{featured.year}</span>
              {genreName && (
                <>
                  <span className="text-slate-600">/</span>
                  <span>{genreName}</span>
                </>
              )}
              {featured.rating > 0 && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={13} className="fill-yellow-400" />
                    {featured.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          )}
          <p className="mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            {featured
              ? featured.detail.slice(0, 180) +
                (featured.detail.length > 180 ? "…" : "")
              : "Browse a growing catalog of movies and shows, rate what you watch, and find something new tonight."}
          </p>
          <div className="mt-7 flex gap-3">
            {featured ? (
              <>
                <Link
                  to={`/movies/${featured._id}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "gap-2",
                  )}
                >
                  <Play className="h-4 w-4 fill-current" /> View details
                </Link>
                <Link
                  to="/browse"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "gap-2",
                  )}
                >
                  <Info className="h-4 w-4" /> Browse catalog
                </Link>
              </>
            ) : (
              <Link to="/browse" className={buttonVariants({ size: "lg" })}>
                Start browsing
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MovieRow title="Top rated" movies={topMovies} loading={!topMovies} />
        <MovieRow
          title="Recently added"
          movies={newMovies}
          loading={!newMovies}
        />
        <MovieRow
          title="Discover something different"
          movies={randomMovies}
          loading={!randomMovies}
        />
      </div>
    </div>
  );
}

export default Home;
