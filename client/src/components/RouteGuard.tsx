import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function FullScreenLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status !== "ready") return <FullScreenLoader />;
  if (!user) {
    // state means coming from where so we can go back to that page
    // replace means don't add history so the user won't go back to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function AdminRoute() {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status !== "ready") return <FullScreenLoader />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
