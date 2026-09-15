import { NavLink, Outlet } from "react-router";
import { cn } from "@/lib/utils";

function AdminLayout() {
  return (
    <div>
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          <NavLink
            to="/admin/movies"
            className={({ isActive }) =>
              cn(
                "focus-ring border-b-2 px-1 py-4 text-sm font-medium",
                isActive
                  ? "border-blue-600 text-slate-100"
                  : "border-transparent text-slate-400 hover:text-slate-300",
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
                  ? "border-blue-600 text-slate-100"
                  : "border-transparent text-slate-400 hover:text-slate-300",
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
