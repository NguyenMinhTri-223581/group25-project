import React, { useState } from "react";

const Register = () => {
  // 🧠 State lưu giá trị input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // 📩 Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    setMessage("");
    setError(false);

    // Kiểm tra input trống
    if (!name || !email || !password) {
      setError(true);
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "✅ Đăng ký thành công!");
        setError(false);
        // Reset form sau khi đăng ký
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(true);
        setMessage(data.message || "❌ Đăng ký thất bại!");
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
      <h2 style={{ textAlign: "center" }}>🧑‍💻 Đăng ký tài khoản</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
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
          Gửi
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

export default Register;

