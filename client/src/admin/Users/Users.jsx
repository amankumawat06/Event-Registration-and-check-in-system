import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  ShieldCheck,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

import { getAllUsers, deleteUser } from "../../services/userAPI";

import "./Users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        (user.phone || "").toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        (user.role || "user").toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((user) => user.role === "admin").length;

  const handleDelete = async (user) => {
    if (user.role === "admin") {
      window.alert("Admin accounts cannot be deleted here.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || "this user"}?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(user._id);
      await deleteUser(user._id);

      setUsers((previous) => previous.filter((item) => item._id !== user._id));

      if (selectedUser?._id === user._id) {
        setSelectedUser(null);
      }
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="adminUsers">
      <div className="adminUsers__header">
        <div>
          <span className="adminUsers__eyebrow"></span>
          <h1>User Management</h1>
        </div>

        <button
          className="adminUsers__refresh"
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="adminUsers__stats">
        <div className="adminUsers__stat">
          <div className="adminUsers__statIcon">
            <Users size={21} />
          </div>
          <div>
            <span>Total Users</span>
            <h2>{users.length}</h2>
          </div>
        </div>

        <div className="adminUsers__stat">
          <div className="adminUsers__statIcon">
            <UserRound size={21} />
          </div>
          <div>
            <span>Regular Users</span>
            <h2>{users.length - adminCount}</h2>
          </div>
        </div>

        <div className="adminUsers__stat">
          <div className="adminUsers__statIcon">
            <ShieldCheck size={21} />
          </div>
          <div>
            <span>Administrators</span>
            <h2>{adminCount}</h2>
          </div>
        </div>
      </div>

      <div className="adminUsers__toolbar">
        <div className="adminUsers__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Clear search" onClick={() => setSearch("")}>
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">Regular Users</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {error && (
        <div className="adminUsers__error">
          {error}
          <button onClick={fetchUsers}>Try again</button>
        </div>
      )}

      <div className="adminUsers__tableCard">
        <div className="adminUsers__tableHeader">
          <h3>Registered Users</h3>
          <span>{filteredUsers.length} results</span>
        </div>

        {loading ? (
          <div className="adminUsers__state">
            <RefreshCw className="adminUsers__spinner" size={24} />
            <p>Loading users...</p>
          </div>
        ) : !error && filteredUsers.length === 0 ? (
          <div className="adminUsers__state">
            <Users size={32} />
            <p>No users found.</p>
          </div>
        ) : (
          !error && (
            <div className="adminUsers__tableWrap">
              <table className="adminUsers__table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="adminUsers__identity">
                          <div className="adminUsers__avatar">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>

                          <div className="adminUsers__identityText">
                            <strong>{user.name || "Unnamed User"}</strong>
                            <span>{user.email || "No email"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{user.phone || "-"}</td>

                      <td>
                        <span
                          className={`adminUsers__role ${
                            user.role === "admin"
                              ? "adminUsers__role--admin"
                              : ""
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="adminUsers__actions">
                          <button
                            className="adminUsers__view"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </button>

                          {user.role !== "admin" && (
                            <button
                              className="adminUsers__delete"
                              onClick={() => handleDelete(user)}
                              disabled={deletingId === user._id}
                              aria-label={`Delete ${user.name}`}
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {selectedUser && (
        <div
          className="adminUsers__overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="adminUsers__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adminUsers__modalHeader">
              <h2>User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="adminUsers__profile">
              <div className="adminUsers__profileAvatar">
                {(selectedUser.name || "U").charAt(0).toUpperCase()}
              </div>
              <h3>{selectedUser.name || "Unnamed User"}</h3>
              <span>{selectedUser.role || "user"}</span>
            </div>

            <div className="adminUsers__details">
              <div>
                <span>Email</span>
                <strong>{selectedUser.email || "-"}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedUser.phone || "-"}</strong>
              </div>
              <div>
                <span>User ID</span>
                <strong>{selectedUser._id}</strong>
              </div>
              <div>
                <span>Joined</span>
                <strong>
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "-"}
                </strong>
              </div>
            </div>

            <button
              className="adminUsers__close"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
