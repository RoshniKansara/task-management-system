import { useEffect, useState } from "react";
import axios from "axios";
import "../AdminDashboard.css";
import { toast } from "react-toastify";

function AdminDashboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchUsers = async () => {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://task-management-backend-3ecl.onrender.com/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(response.data);
    };

    fetchUsers();

  }, []);

  const totalUsers = users.length;

    const totalAdmins = users.filter(
    user => user.role === "ADMIN"
    ).length;

    const totalNormalUsers = users.filter(
    user => user.role === "USER"
    ).length;

    console.log("USERS =", users);
    console.log("TOTAL =", totalUsers);

    const deleteUser = async (id) => {

      try {

        const token = localStorage.getItem("token");

        await axios.delete(
          `https://task-management-backend-3ecl.onrender.com/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUsers(
          users.filter(user => user.id !== id)
        );

       toast.success("User deleted successfully!");
      } catch (error) {
        console.error(error);
        console.log("STATUS =", error.response?.status);
        console.log("DATA =", error.response?.data);
      }
    };

    

  return (
    <div>
      <button
        onClick={() => window.location.href="/dashboard"}
      >
        Back to Dashboard
      </button>
      <h1>Admin Dashboard</h1>

        <div className="admin-stats">

        <div className="admin-card">
          <h2>{totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-card">
          <h2>{totalAdmins}</h2>
          <p>Admins</p>
        </div>

        <div className="admin-card">
          <h2>{totalNormalUsers}</h2>
          <p>Users</p>
        </div>

      </div>

            <hr />
      <table className="user-table">

  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>

    {users.map(user => (

      <tr key={user.id}>

        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
        <span
          className={
            user.role === "ADMIN"
              ? "admin-badge"
              : "user-badge"
          }
        >
          {user.role}
        </span>
      </td>

        <td>
          <button
            onClick={() => {
              if (window.confirm("Delete this user?")) {
                deleteUser(user.id);
              }
            }}
          >
            Delete
          </button>
        </td>

      </tr>

    ))}

  </tbody>

</table>
    </div>
  );
}

export default AdminDashboard;