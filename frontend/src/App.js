// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import các component
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import AdminUserList from "./components/AdminUserList"; // ✅ Trang Admin

function App() {
  return (
    <Router>
      <div>
        {/* 🔗 Menu điều hướng */}
        <nav
          style={{
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            marginBottom: "20px",
          }}
        >
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>
          <Link to="/profile" style={{ marginRight: "1rem" }}>Profile</Link>
          <Link to="/admin/users" style={{ marginRight: "1rem" }}>Admin Users</Link>
        </nav>

        {/* 🛣️ Định tuyến các trang */}
        <Routes>
          <Route path="/" element={<h1 style={{ textAlign: "center" }}>🏠 Welcome Home</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

