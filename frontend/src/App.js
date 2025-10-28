import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h2>🧑‍💻 User Management App</h2>
        <nav>
          <Link to="/register">Đăng ký</Link> |{" "}
          <Link to="/login">Đăng nhập</Link> |{" "}
          <Link to="/profile">Thông tin</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
