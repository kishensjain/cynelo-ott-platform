import { useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router";
import toast from "react-hot-toast";
import { Film } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate(from, { replace: true });
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
        <h1 className="font-semibold text-3xl text-slate-100">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Sign in to rate and review titles.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1">Email</Label>
          <Input
          className="w-sm"
            id="email"
            type="email"
            required
            // autoComplete is for autofill suggestions that the browser provides
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1">Password</Label>
          <Input
          className="w-sm"
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to Cynelo?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;
