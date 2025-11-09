import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!name || !email || !password) {
      setError(true);
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // ✅ Đảm bảo URL backend chính xác
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      // 📨 Gửi request đến đúng endpoint
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      // ✅ Hiển thị thông báo phản hồi
      setMessage(res.data.message || "✅ Đăng ký thành công!");
      setError(false);

      // 🔒 Lưu token nếu có
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // 🧹 Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);

      // ✅ Xử lý lỗi server
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(`🚫 ${err.response.data.message}`);
      } else if (err.code === "ERR_NETWORK") {
        setMessage("🚫 Không thể kết nối tới server! Hãy kiểm tra backend đang chạy tại cổng 5000.");
      } else {
        setMessage("🚫 Lỗi không xác định khi đăng ký!");
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        📝 Đăng ký tài khoản
      </h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
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
            fontWeight: "bold",
          }}
        >
          Đăng ký
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

