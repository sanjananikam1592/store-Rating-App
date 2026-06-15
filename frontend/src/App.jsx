import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/stores"
          element={user?.role === "USER" ? <UserStores /> : <Navigate to="/" />}
        />

        <Route
          path="/owner"
          element={user?.role === "OWNER" ? <OwnerDashboard /> : <Navigate to="/" />}
        />

        <Route 
        path="/change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;