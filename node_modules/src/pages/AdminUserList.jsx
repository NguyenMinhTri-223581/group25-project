// src/pages/AdminUserList.jsx
import React, { useEffect, useState } from "react";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy danh sách user từ backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users"); // URL backend của bạn
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Không có người dùng nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserList;
