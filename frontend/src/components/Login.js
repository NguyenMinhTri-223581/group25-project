import React, { useState } from "react";

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
      // 🔥 CHỈNH LẠI ĐƯỜNG DẪN API
      // Nếu backend bạn KHÔNG có "/api", dùng dòng dưới:
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Nếu backend có "/api/auth", thì thay lại dòng trên bằng:
      // const res = await fetch("http://localhost:5000/api/auth/login", {...});

      const contentType = res.headers.get("content-type");

      // Kiểm tra phản hồi có phải JSON không
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server không trả về JSON hợp lệ");
      }

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "✅ Đăng nhập thành công!");
        setError(false);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setEmail("");
        setPassword("");
      } else {
        setError(true);
        setMessage(data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(true);
      setMessage("🚫 Lỗi kết nối đến server!");
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
