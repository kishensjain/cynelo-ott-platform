import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Film, Search, User as UserIcon, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // URLSearchParams is a browser-provided JavaScript API for working with the query parameters of a URL.
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get("query") || "",
  );

  const submitSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    // encodeURIComponent() converts a string to a URL-encoded string
    // eg. "Spider Man" -> "Spider%20Man"
    navigate(
      trimmed ? `/browse?query=${encodeURIComponent(trimmed)}` : "/browse",
    );
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="focus-ring flex shrink-0 items-center gap-2 rounded-sm"
        >
          <Film className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-xl tracking-tight text-slate-100">
            Cynelo
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-4 font-mono text-xs uppercase tracking-wide text-slate-400 md:flex">
          <Link
            className="focus-ring rounded-sm hover:text-slate-100"
            to="/browse"
          >
            Browse
          </Link>
        </nav>

        <form onSubmit={submitSearch} className="ml-auto flex max-w-md flex-1">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, cast, plot…"
              className="pl-9"
            />
          </div>
        </form>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-ring rounded-full">
              <Avatar>
                <AvatarFallback>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/profile")}>
                <UserIcon className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              {user.isAdmin && (
                <DropdownMenuItem onSelect={() => navigate("/admin/movies")}>
                  <Shield className="h-4 w-4" /> Admin panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              className="cursor-pointer"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Join
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
