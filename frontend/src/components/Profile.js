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
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          setMessage(data.message || "Không thể tải thông tin người dùng!");
        }
      } catch (err) {
        setMessage("🚫 Lỗi kết nối đến server!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>👤 Thông tin người dùng</h2>

      {user ? (
        <div style={{ lineHeight: "1.8" }}>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user._id}</p>
        </div>
      ) : (
        <p style={{ color: "red", textAlign: "center" }}>{message}</p>
      )}
    </div>
  );
};

export default Profile;
