import { useState } from "react";
import toast from "react-hot-toast";
import { usersApi } from "@/api/users";
import { errorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Profile() {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
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
    </div>
  );
}

export default Profile;