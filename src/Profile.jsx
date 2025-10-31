import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    fetch("http://localhost:5000/profile")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
      .then((res) => res.json())
      .then((data) => alert(data.message));
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <label>Họ tên:</label>
        <input name="name" value={user.name} onChange={handleChange} /><br />
        <label>Email:</label>
        <input name="email" type="email" value={user.email} onChange={handleChange} /><br />
        <label>Điện thoại:</label>
        <input name="phone" value={user.phone} onChange={handleChange} /><br />
        <label>Địa chỉ:</label>
        <input name="address" value={user.address} onChange={handleChange} /><br />
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}
