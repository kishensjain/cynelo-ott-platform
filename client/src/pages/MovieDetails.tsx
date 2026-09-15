import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Star, Trash2, ArrowLeft, LockKeyhole } from "lucide-react";
import { moviesApi } from "@/api/movies";
import { errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/types";
import SubscribeButton from "@/components/SubscribeButton";

const isSubscriptionError = (error: unknown) =>
  Boolean(
    error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 403,
  );

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  const load = async () => {
    if (!id) return;

    try {
      const data = await moviesApi.getOne(id);
      setMovie(data);
      setSubscriptionRequired(false);
    } catch (error) {
      if (isSubscriptionError(error)) {
        setSubscriptionRequired(true);
        return;
      }
      toast.error(errorMessage(error));
      navigate("/browse");
    }
  };

  useEffect(() => {
    if (!id) return;

    moviesApi
      .getOne(id)
      .then((data) => {
        setMovie(data);
        setSubscriptionRequired(false);
      })
      .catch((error) => {
        if (isSubscriptionError(error)) {
          setSubscriptionRequired(true);
          return;
        }
        toast.error(errorMessage(error));
        navigate("/browse");
      })
      .finally(() => setLoading(false));
    // navigate doesnot change but React's rule for Effect dependencies is essentially:
    // If your Effect uses a value from inside the Effect, that value should not be in the dependency array.
  }, [id, navigate]);

  const genreName =
    movie && typeof movie.genre === "object" && movie.genre
      ? movie.genre.name
      : null;

  const alreadyReviewed = Boolean(
    movie && user && movie.reviews.some((r) => r.user === user._id),
  );

  const submitReview = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!id) return;
    if (rating < 1) {
      toast.error("Pick a star rating first");
      return;
    }
    if (!comment.trim()) {
      toast.error("Write a short comment");
      return;
    }
    setSubmitting(true);
    try {
      await moviesApi.addReview(id, rating, comment.trim());
      toast.success("Review posted");
      setRating(0);
      setComment("");
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (reviewId: string) => {
    if (!id) return;
    try {
      await moviesApi.deleteReview(id, reviewId);
      toast.success("Review removed");
      load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
          <Skeleton className="aspect-2/3 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionRequired) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full rounded-2xl border border-amber-300/20 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-amber-300">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-amber-300">
            Subscriber content
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
            Unlock the Cynelo catalog
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
            Subscribe to view movie details, reviews, and the rest of the
            subscriber experience.
          </p>
          <div className="mt-7 flex justify-center">
            <SubscribeButton onSubscribed={load} />
          </div>
          <Link
            to="/browse"
            className="mt-5 inline-flex text-sm text-slate-500 transition-colors hover:text-slate-200"
          >
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        to="/browse"
        className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
        <div className="aspect-2/3 overflow-hidden rounded-md border border-slate-700 bg-slate-800">
          {movie.image ? (
            <img
              src={movie.image}
              alt={movie.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div>
          <h1 className="font-semibold text-3xl text-slate-100 sm:text-4xl">
            {movie.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{movie.year}</Badge>
            {genreName && <Badge variant="secondary">{genreName}</Badge>}
            {movie.rating > 0 && (
              <Badge variant="default" className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400" />
                {movie.rating.toFixed(1)} ({movie.numReviews} review
                {movie.numReviews === 1 ? "" : "s"})
              </Badge>
            )}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400">
            {movie.detail}
          </p>

          {movie.cast.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Cast
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {movie.cast.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-10" />

      <div>
        <h2 className="font-semibold text-2xl text-slate-100">Reviews</h2>

        {user && !alreadyReviewed && (
          <form
            onSubmit={submitReview}
            className="mt-5 max-w-xl rounded-md border border-slate-700 bg-slate-800/60 p-5"
          >
            <p className="text-sm font-medium text-slate-300">
              Rate this title
            </p>
            <StarRating
              value={rating}
              onChange={setRating}
              size={22}
              className="mt-2"
            />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think?"
              className="mt-3 text-slate-100 placeholder:text-slate-500"
              rows={3}
            />
            <Button type="submit" className="mt-3" disabled={submitting}>
              {submitting ? "Posting..." : "Post Review"}
            </Button>
          </form>
        )}

        {user && alreadyReviewed && (
          <p className="mt-4 text-sm text-slate-400">
            You've already reviewed this title.
          </p>
        )}

        {!user && (
          <p className="mt-4 text-sm text-slate-400">
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}

        <div className="mt-8 space-y-6">
          {movie.reviews.length === 0 && (
            <p className="text-sm text-slate-500">
              No reviews yet — be the first to share your thoughts.
            </p>
          )}
          {movie.reviews
            .slice()
            .reverse()
            .map((review) => (
              <div key={review._id} className="border-b border-slate-800 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      {review.name}
                    </p>
                    <StarRating
                      value={review.rating}
                      size={13}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {review.createdAt && (
                      <span className="font-mono text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {review._id &&
                      (user?.isAdmin || review.user === user?._id) && (
                        <button
                          onClick={() => removeReview(review._id!)}
                          className="focus-ring rounded-sm text-slate-500 hover:text-red-400"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-400">{review.comment}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
