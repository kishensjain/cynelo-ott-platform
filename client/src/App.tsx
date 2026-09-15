import { Route, Routes } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import NotFound from "@/pages/NotFound";
import MovieDetails from "@/pages/MovieDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import { ProtectedRoute, AdminRoute } from "@/components/RouteGuard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminMovies from "@/pages/admin/AdminMovies";
import AdminGenres from "@/pages/admin/AdminGenres";
import MovieForm from "@/pages/admin/MovieForm";

function App() {
  return (
    <Routes>
      {/* Layout is the common outer structure */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="admin" element={<AdminRoute />}>
          <Route path="movies/new" element={<MovieForm />} />
          <Route path="movies/:id/edit" element={<MovieForm />} />
          <Route element={<AdminLayout />}>
            <Route path="movies" element={<AdminMovies />} />
            <Route path="genres" element={<AdminGenres />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
