import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { moviesApi } from "@/api/movies";
import { genresApi } from "@/api/genres";
import { errorMessage } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Genre } from "@/types";

function MovieForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [detail, setDetail] = useState("");
  const [cast, setCast] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    genresApi
      .getAll()
      .then(setGenres)
      .catch((error) => toast.error(errorMessage(error)));
  }, []);

  useEffect(() => {
    if (!id) return;
    moviesApi
      .getOne(id)
      .then((movie) => {
        setName(movie.name);
        setYear(String(movie.year));
        setGenre(
          typeof movie.genre === "object" ? movie.genre._id : movie.genre,
        );
        setDetail(movie.detail);
        setCast(movie.cast.join(", "));
        setPreview(movie.image);
      })
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoading(false));
  }, [id]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim() || !year || !genre || !detail.trim()) {
      toast.error("Fill in all required fields");
      return;
    }
    if (!isEdit && !file) {
      toast.error("A poster image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("year", year);
    formData.append("genre", genre);
    formData.append("detail", detail.trim());
    cast
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => formData.append("cast", c));
    if (file) formData.append("image", file);

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await moviesApi.update(id, formData);
        toast.success("Movie updated");
      } else {
        await moviesApi.create(formData);
        toast.success("Movie added");
      }
      navigate("/admin/movies");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/admin/movies"
        className="focus-ring inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>

      <div className="mt-8">
        <h1 className="font-semibold text-3xl text-slate-100">
          {isEdit ? "Edit movie" : "Add movie"}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {isEdit
            ? "Update the movie information below."
            : "Add a new movie to your collection."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="name" className="mb-1">
            Title
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Movie title"
            required
          />
        </div>

        {/* Year + Genre */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="year" className="mb-1">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              min={1888}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              required
            />
          </div>

          <div>
            <Label htmlFor="genre" className="mb-1">
              Genre
            </Label>

            <Select
              value={genre}
              onValueChange={(value) => {
                if (value === null) return;
                setGenre(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>

              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g._id} value={g._id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Synopsis */}
        <div>
          <Label htmlFor="detail" className="mb-1">
            Synopsis
          </Label>
          <Textarea
            id="detail"
            rows={5}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Write a short synopsis..."
            required
          />
        </div>

        {/* Cast */}
        <div>
          <Label htmlFor="cast" className="mb-1">
            Cast
          </Label>
          <Input
            id="cast"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
            placeholder="Jane Doe, John Smith"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Separate multiple actors with commas.
          </p>
        </div>

        {/* Poster */}
        <div>
          <Label htmlFor="image" className="mb-1">
            Poster image
          </Label>

          <div className="mt-2 flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Poster preview"
                className="h-28 w-20 rounded-md border border-slate-700 object-cover"
              />
            )}

            <label
              htmlFor="image"
              className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-slate-200"
            >
              <UploadCloud className="h-4 w-4" />
              {file ? file.name : "Choose file"}
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {!isEdit && (
            <p className="mt-1.5 text-xs text-slate-500">
              A poster image is required.
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save changes"
              : "Add movie"}
        </Button>
      </form>
    </div>
  );
}

export default MovieForm;
