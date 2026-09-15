import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { genresApi } from "@/api/genres";
import { errorMessage } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/Common";
import type { Genre } from "@/types";

export function AdminGenres() {
  const [genres, setGenres] = useState<Genre[]>();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [toDelete, setToDelete] = useState<Genre | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    genresApi
      .getAll()
      .then(setGenres)
      .catch((error) => toast.error(errorMessage(error)));
  };

  useEffect(load, []);

  const createGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await genresApi.create(newName.trim());
      toast.success("Genre added");
      setNewName("");
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (genre: Genre) => {
    setEditingId(genre._id);
    setEditingName(genre.name);
  };

  const saveEdit = async (genreId: string) => {
    if (!editingName.trim()) return;
    try {
      await genresApi.update(genreId, editingName.trim());
      toast.success("Genre renamed");
      setEditingId(null);
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await genresApi.remove(toDelete._id);
      toast.success("Genre deleted");
      setToDelete(null);
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-semibold text-3xl text-slate-100">Manage genres</h1>

      <form onSubmit={createGenre} className="mt-6 flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New genre name"
          maxLength={32}
        />
        <Button type="submit" disabled={creating} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      <div className="mt-8 divide-y divide-slate-800 rounded-md border border-slate-700">
        {!genres && (
          <p className="px-4 py-6 text-sm text-slate-400">Loading…</p>
        )}
        {genres?.map((genre) => (
          <div
            key={genre._id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            {editingId === genre._id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                autoFocus
                className="h-9"
              />
            ) : (
              <span className="text-sm text-slate-100">{genre.name}</span>
            )}
            <div className="flex shrink-0 gap-1.5">
              {editingId === genre._id ? (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => saveEdit(genre._id)}
                    aria-label="Save"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEdit(genre)}
                    aria-label="Rename"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setToDelete(genre)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {genres?.length === 0 && (
        <EmptyState
          title="No genres yet"
          description="Add one above to get started."
        />
      )}

      <Dialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{toDelete?.name}"?</DialogTitle>
            <DialogDescription>
              This only works if no movies currently use this genre.
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
