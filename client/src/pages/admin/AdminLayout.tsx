import { NavLink, Outlet } from "react-router";
import { cn } from "@/lib/utils";

function AdminLayout() {
  return (
    <div>
      <div className="border-b border-white/10 bg-slate-950/35">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          <NavLink
            to="/admin/movies"
            className={({ isActive }) =>
              cn(
                "focus-ring border-b-2 px-1 py-4 text-sm font-medium",
                isActive
                  ? "border-amber-300 text-slate-100"
                  : "border-transparent text-slate-400 hover:text-amber-200",
              )
            }
          >
            <span className="mx-3">Movies</span>
          </NavLink>
          <NavLink
            to="/admin/genres"
            className={({ isActive }) =>
              cn(
                "focus-ring border-b-2 px-1 py-4 text-sm font-medium",
                isActive
                  ? "border-amber-300 text-slate-100"
                  : "border-transparent text-slate-400 hover:text-amber-200",
              )
            }
          >
            <span className="mx-3">Genres</span>
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
