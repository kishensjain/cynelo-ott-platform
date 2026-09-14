import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Film } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      await register(username, email, password);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Film className="h-7 w-7 text-blue-600" />
        <h1 className="font-semibold text-3xl text-slate-100">Join Cynelo</h1>
        <p className="text-sm text-slate-400">
          Create an account to rate and review titles.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            required
            maxLength={20}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;