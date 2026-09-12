import { Route, Routes } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";

function App() {
  return (
    <Routes>
      {/* Layout is the common outer structure */}
      <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='browse' element={<Browse />} />
      </Route>
    </Routes>
  );
}

export default App;
