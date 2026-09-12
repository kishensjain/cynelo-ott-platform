import { Route, Routes } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Layout is the common outer structure */}
      <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='browse' element={<Browse />} />

      <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
