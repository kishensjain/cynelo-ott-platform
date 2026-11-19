import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/users";
import { errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MovieCard from "@/components/MovieCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Profile() {
  const { user, setUser, unsubscribe } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [loadingLikedMovies, setLoadingLikedMovies] = useState(true);

  useEffect(() => {
    let active = true;
    usersApi.getProfile()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch((error) => {
        if (active) toast.error(errorMessage(error));
      })
      .finally(() => {
        if (active) setLoadingLikedMovies(false);
      });

    return () => {
      active = false;
    };
  }, [setUser]);

  if (!user) return null;

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const updated = await usersApi.updateProfile({
        username,
        email,
        ...(password ? { password } : {}),
      });
      setUser(updated);
      setPassword("");
      toast.success("Profile updated");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const cancelSubscription = async () => {
    setCancelling(true);
    try {
      await unsubscribe();
      toast.success("Subscription cancelled");
      setConfirmCancel(false);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-2xl text-slate-100">
            {user.username}
          </h1>
          {user.isAdmin && <Badge variant="default">Admin</Badge>}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="username" className="mb-1">Username</Label>
          <Input
            className="w-sm"
            id="username"
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email" className="mb-1">Email</Label>
          <Input
            className="w-sm"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1 text-sm">New password</Label>
          <Input
            className="w-sm"
            id="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <section className="mt-10 border-t border-white/10 pt-6">
        <h2 className="font-semibold text-xl text-slate-100">Liked movies</h2>
        {loadingLikedMovies ? (
          <p className="mt-2 text-sm text-slate-400">Loading liked movies...</p>
        ) : user.likedMovies?.some((movie) => typeof movie !== "string") ? (
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-10">
            {user.likedMovies.filter((movie): movie is import("@/types").Movie => typeof movie !== "string").map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Movies you like will appear here.</p>
        )}
      </section>

      {user.isSubscribed && (
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-slate-200">Subscription</p>
          <p className="mt-1 text-sm text-slate-400">
            Your Cynelo subscription is active.
          </p>
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            disabled={cancelling}
            onClick={() => setConfirmCancel(true)}
          >
            {cancelling ? "Cancelling..." : "Cancel subscription"}
          </Button>
        </div>
      )}

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel your subscription?</DialogTitle>
            <DialogDescription>
              You will lose access to subscriber-only movie details and reviews.
              You can subscribe again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmCancel(false)}
              disabled={cancelling}
            >
              Keep subscription
            </Button>
            <Button
              variant="destructive"
              onClick={cancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;
