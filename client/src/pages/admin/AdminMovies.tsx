import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { moviesApi } from "@/api/movies";
import { errorMessage } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState, Pagination } from "@/components/Common";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";
function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [toDelete, setToDelete] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    moviesApi
      .getAll(page, 20)
      .then((res) => {
        setMovies(res.movies);
        setPages(res.pages);
      })
      .catch((error) => toast.error(errorMessage(error)));
  };

  useEffect(load, [page]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await moviesApi.remove(toDelete._id);
      toast.success("Movie deleted");
      setToDelete(null);
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-3xl text-slate-100">Manage movies</h1>
        <Link to="/admin/movies/new" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" /> Add movie
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {!movies &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={4}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            {movies?.map((movie) => (
              <tr key={movie._id} className="hover:bg-slate-800/60">
                <td className="px-4 py-3 text-slate-100">{movie.name}</td>
                <td className="px-4 py-3 font-mono text-slate-400">
                  {movie.year}
                </td>
                <td className="px-4 py-3">
                  {movie.rating > 0 ? (
                    <span className="flex items-center gap-1 font-mono text-yellow-400">
                      <Star size={12} className="fill-yellow-400" />
                      {movie.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/movies/${movie._id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                      )}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setToDelete(movie)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {movies?.length === 0 && (
        <EmptyState
          title="No movies yet"
          description="Add your first title to get the catalog started."
        />
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />

      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{toDelete?.name}"?</DialogTitle>
            <DialogDescription>
              This permanently removes the title and its reviews. This can't be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminMovies;
