import { Route, Routes } from "react-router";
import Layout from "@/components/Layout";

function App() {
  return (
    <Routes>
      {/* Layout is the common outer structure */}
      <Route element={<Layout />}>
      
      </Route>
    </Routes>
  );
}

export default App;
