import { Outlet } from "react-router";
import { Film } from "lucide-react";
import Navbar from "@/components/Navbar";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center sm:px-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Film className="h-4 w-4 text-amber-300" />
            <span className="font-semibold text-sm">Cynelo</span>
          </div>
          <p className="max-w-md text-xs text-slate-500">
            Movie metadata like title, description, year, genre, cast,image and reviews for demonstration purposes.
            Full-length copyrighted films are not hosted or distributed here.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;