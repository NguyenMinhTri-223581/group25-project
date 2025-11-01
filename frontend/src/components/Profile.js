import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("⚠️ Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }

      try {
        // 🔥 Gọi đúng endpoint của backend
        const res = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Nếu server không trả về JSON hợp lệ (ví dụ: lỗi HTML)
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Phản hồi không phải JSON:", text);
          throw new Error("Server không trả về JSON hợp lệ");
        }

        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
          setMessage("");
        } else {
          setMessage(data.message || "❌ Không thể tải thông tin người dùng!");
        }
      } catch (err) {
        console.error("🚫 Lỗi khi tải thông tin:", err);
        setMessage("🚫 Không thể kết nối đến server!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Hiển thị trong lúc đang tải
  if (loading)
    return <p style={{ textAlign: "center" }}>⏳ Đang tải thông tin...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        👤 Thông tin người dùng
      </h2>

      {user ? (
        <div style={{ lineHeight: "1.8", fontSize: "16px" }}>
          <p>
            <strong>Tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user._id}
          </p>
        </div>
      ) : (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;

