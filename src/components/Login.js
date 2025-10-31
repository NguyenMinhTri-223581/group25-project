import React, { useState } from "react";

const Login = () => {
  // 🧠 State cho form đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // 🔑 Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    // Kiểm tra input trống
    if (!email || !password) {
      setError(true);
      setMessage("⚠️ Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "✅ Đăng nhập thành công!");
        setError(false);

        // Lưu token vào localStorage để xác thực
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Reset form
        setEmail("");
        setPassword("");
      } else {
        setError(true);
        setMessage(data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (err) {
      setError(true);
      setMessage("🚫 Lỗi kết nối đến server!");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🔐 Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
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
            marginTop: "10px",
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

