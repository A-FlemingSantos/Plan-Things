import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomepageGemini } from "@/features/homepage/HomepageGemini";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomepageGemini />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
