import React, { useEffect, useState } from "react";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải danh sách người dùng!");

      setUsers(data);
      setLoading(false);
    } catch (err) {
      setMessage(`🚫 ${err.message}`);
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể xóa người dùng!");

      setMessage("🗑️ Đã xóa người dùng thành công!");
      fetchUsers();
    } catch (err) {
      setMessage(`🚫 ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Đang tải danh sách người dùng...</p>;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>👥 Danh sách người dùng</h2>
      {message && (
        <p style={{ color: message.includes("🚫") ? "red" : "green", textAlign: "center" }}>
          {message}
        </p>
      )}

      {users.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có người dùng nào.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={cellStyle}>Tên</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={cellStyle}>{u.name}</td>
                <td style={cellStyle}>{u.email}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => deleteUser(u._id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

export default AdminUserList;
