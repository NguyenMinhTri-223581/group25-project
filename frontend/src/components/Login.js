import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!email || !password) {
      setError(true);
      setMessage("⚠️ Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      // ✅ Gọi đúng API backend qua biến môi trường
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );

      setMessage(res.data.message || "✅ Đăng nhập thành công!");
      setError(false);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Lỗi kết nối tới server:", err);
      if (err.response) {
        setMessage(err.response.data.message || "❌ Đăng nhập thất bại!");
      } else {
        setMessage("🚫 Lỗi kết nối đến server!");
      }
      setError(true);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🔐 Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Đăng nhập
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: error ? "red" : "green",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;

