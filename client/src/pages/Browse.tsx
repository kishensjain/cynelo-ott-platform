import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { moviesApi } from "@/api/movies";
import { genresApi } from "@/api/genres";
import { errorMessage } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, Pagination } from "@/components/Common";
import type { Genre, Movie } from "@/types";

const currentYear = new Date().getFullYear();
// 1900 to current year, +1 to include current year
// Array.from({ length: 127 }, ...) creates an array of 127 elements all set to undefined
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
  // using String() as these years will go into <Select> component
  String(currentYear - i),
);

function Browse() {
  const [params, setParams] = useSearchParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>();
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const query = params.get("query") || "";
  const genre = params.get("genre") || "";
  const year = params.get("year") || "";
  const page = Number(params.get("page")) || 1;

  useEffect(() => {
    genresApi
      .getAll()
      .then(setGenres)
      .catch((error) => toast.error(errorMessage(error)));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    moviesApi
      .search({ query, genre, year: year || undefined, page, limit: 20 })
      .then((res) => {
        setMovies(res.movies);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoading(false));
  }, [query, genre, year, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    // Because changing a filter should reset pagination.
    next.delete("page");
    setParams(next);
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-semibold text-3xl text-slate-100">Browse</h1>
      <p className="mt-1 text-sm text-slate-400">
        {loading
          ? "Searching…"
          : `${total} title${total === 1 ? "" : "s"} found`}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Input
          value={query}
          onChange={(e) => updateParam("query", e.target.value)}
          placeholder="Search titles, cast, plot…"
          className="sm:col-span-2"
        />
        <Select
          value={genre}
          onValueChange={(value) => {
            if (value === null) return;
            updateParam("genre", value === "all" ? "" : value);
          }}
        >
          // SelectTrigger = the clickable dropdown box
          // SelectValue = what is displayed inside that box
          <SelectTrigger>
            <SelectValue placeholder="All genres">
              {genre === "" || genre === "all"
                ? "All genres"
                : (genres.find((g) => g._id === genre)?.name ?? "All genres")}
            </SelectValue>
          </SelectTrigger>
          
          // SelectContent = dropdown list that appears after you click the SelectTrigger
          // SelectItem = each dropdown list item
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>

            {genres.map((g) => (
              <SelectItem key={g._id} value={g._id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={year}
          onValueChange={(value) => {
            if (value === null) return;
            updateParam("year", value === "all" ? "" : value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All years" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All years</SelectItem>

            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-2/3 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-3 w-1/2" />
              </div>
            ))
          : movies?.map((movie) => (
              <MovieCard key={movie._id} movie={movie} className="w-full" />
            ))}
      </div>

      {!loading && movies?.length === 0 && (
        <EmptyState
          title="No titles match those filters"
          description="Try a different search term, or clear the genre and year filters."
        />
      )}

      {!loading && <Pagination page={page} pages={pages} onChange={goToPage} />}
    </div>
  );
}

export default Browse;
