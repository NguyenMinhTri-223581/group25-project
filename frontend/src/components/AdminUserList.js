import React, { useEffect, useState } from "react";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
        setMessage("");
      } else {
        setMessage(data.message || "❌ Không thể tải danh sách user!");
      }
    } catch (err) {
      console.error(err);
      setMessage("🚫 Lỗi kết nối đến server!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Xóa user thành công!");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert(data.message || "❌ Xóa thất bại!");
      }
    } catch (err) {
      alert("🚫 Không thể kết nối đến server!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Trang Quản Trị Người Dùng</h2>

      {message && (
        <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>
      )}

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Không có user nào!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
