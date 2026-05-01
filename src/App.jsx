import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
