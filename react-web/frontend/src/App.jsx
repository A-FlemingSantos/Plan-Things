import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomepageGemini } from "@/features/homepage/HomepageGemini";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomepageGemini />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
