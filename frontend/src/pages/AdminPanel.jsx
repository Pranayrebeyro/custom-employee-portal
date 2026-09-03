import { useEffect, useState } from "react";

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getAuditLogs,
    getRoles,
    getPermissions,
    updateRolePermissions
} from "../services/adminService";

import "./AdminPanel.css";


function AdminPanel({ onBack }) {

    const [activeTab, setActiveTab] = useState("users");

    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingUser, setEditingUser] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "HR"
    });


    useEffect(() => {
        loadUsers();
    }, []);


    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const result = await getUsers();

            setUsers(result.users || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    }


    async function loadAuditLogs() {
        try {
            setLoading(true);
            setError("");

            const result = await getAuditLogs();

            setAuditLogs(result.logs || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load audit logs"
            );
        } finally {
            setLoading(false);
        }
    }


    async function loadRolesAndPermissions() {
        try {
            setLoading(true);
            setError("");

            const [rolesResult, permissionsResult] =
                await Promise.all([
                    getRoles(),
                    getPermissions()
                ]);

            setRoles(rolesResult.roles || []);

            setPermissions(
                permissionsResult.permissions || []
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load roles and permissions"
            );
        } finally {
            setLoading(false);
        }
    }


    function handleTabChange(tab) {

        setActiveTab(tab);

        setMessage("");
        setError("");

        if (tab === "users") {
            loadUsers();
        }

        if (tab === "audit") {
            loadAuditLogs();
        }

        if (tab === "roles") {
            loadRolesAndPermissions();
        }
    }


    function handleChange(event) {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    function resetForm() {

        setEditingUser(null);

        setForm({
            name: "",
            email: "",
            password: "",
            role: "HR"
        });
    }


    async function handleCreateUser(event) {

        event.preventDefault();

        try {

            setLoading(true);
            setMessage("");
            setError("");

            await createUser(form);

            setMessage(
                "User created successfully"
            );

            resetForm();

            await loadUsers();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to create user"
            );

        } finally {
            setLoading(false);
        }
    }


    function startEditUser(user) {

        setEditingUser(user);

        setForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.roles?.[0] || "HR"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    async function handleUpdateUser(event) {

        event.preventDefault();

        try {

            setLoading(true);
            setMessage("");
            setError("");

            await updateUser(
                editingUser.id,
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role
                }
            );

            setMessage(
                form.password
                    ? "User and password updated successfully"
                    : "User updated successfully"
            );

            resetForm();

            await loadUsers();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update user"
            );

        } finally {
            setLoading(false);
        }
    }


    async function handleToggleUser(user) {

        if (user.id === 1) {
            return;
        }

        try {

            setLoading(true);
            setMessage("");
            setError("");

            await updateUser(
                user.id,
                {
                    is_active: !user.is_active
                }
            );

            setMessage(
                user.is_active
                    ? "User deactivated successfully"
                    : "User activated successfully"
            );

            await loadUsers();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update user status"
            );

        } finally {
            setLoading(false);
        }
    }


    async function handleDeleteUser(user) {

        if (user.id === 1) {
            return;
        }

        const confirmed = window.confirm(
            `Deactivate ${user.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);
            setMessage("");
            setError("");

            await deleteUser(user.id);

            setMessage(
                "User deactivated successfully"
            );

            await loadUsers();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to deactivate user"
            );

        } finally {
            setLoading(false);
        }
    }


    function hasPermission(role, permissionId) {

        const permission =
            permissions.find(
                (item) => item.id === permissionId
            );

        if (!permission) {
            return false;
        }

        return role.permissions?.includes(
            permission.name
        );
    }


    async function handlePermissionChange(
        role,
        permissionId
    ) {

        const currentPermissionIds =
            permissions
                .filter((permission) =>
                    role.permissions?.includes(
                        permission.name
                    )
                )
                .map((permission) => permission.id);

        let newPermissionIds;

        if (
            currentPermissionIds.includes(
                permissionId
            )
        ) {

            newPermissionIds =
                currentPermissionIds.filter(
                    (id) => id !== permissionId
                );

        } else {

            newPermissionIds = [
                ...currentPermissionIds,
                permissionId
            ];
        }

        try {

            setLoading(true);
            setMessage("");
            setError("");

            await updateRolePermissions(
                role.id,
                newPermissionIds
            );

            setMessage(
                `${role.name} permissions updated successfully`
            );

            await loadRolesAndPermissions();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update permissions"
            );

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="admin-page">

            <div className="admin-header">

                <div>

                    <h1>Admin Panel</h1>

                    <p>
                        Manage users, roles, permissions
                        and audit logs
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>

            </div>


            <div className="admin-tabs">

                <button
                    className={
                        activeTab === "users"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleTabChange("users")
                    }
                >
                    Users
                </button>


                <button
                    className={
                        activeTab === "roles"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleTabChange("roles")
                    }
                >
                    Roles & Permissions
                </button>


                <button
                    className={
                        activeTab === "audit"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        handleTabChange("audit")
                    }
                >
                    Audit Logs
                </button>

            </div>


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {loading && (
                <div className="loading-message">
                    Loading...
                </div>
            )}


            {/* USERS */}

            {activeTab === "users" && (

                <div className="admin-content">

                    <div className="admin-card">

                        <h2>
                            {editingUser
                                ? "Edit User"
                                : "Create User"}
                        </h2>


                        <form
                            className="user-form"
                            onSubmit={
                                editingUser
                                    ? handleUpdateUser
                                    : handleCreateUser
                            }
                        >

                            <input
                                type="text"
                                name="name"
                                placeholder="Full name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="password"
                                name="password"
                                placeholder={
                                    editingUser
                                        ? "New password (leave blank to keep current)"
                                        : "Password"
                                }
                                value={form.password}
                                onChange={handleChange}
                                required={!editingUser}
                                minLength={6}
                            />


                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                            >

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Sales">
                                    Sales
                                </option>

                                <option value="Support">
                                    Support
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>

                            </select>


                            <div className="form-actions">

                                <button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </button>


                                {editingUser && (
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>


                    <div className="admin-card">

                        <h2>Users</h2>

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {users.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                {user.id}
                                            </td>


                                            <td>
                                                {user.name}
                                            </td>


                                            <td>
                                                {user.email}
                                            </td>


                                            <td>
                                                {user.roles?.join(", ")}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        user.is_active
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }
                                                >
                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        startEditUser(user)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                {user.id !== 1 && (
                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDeleteUser(user)
                                                        }
                                                    >
                                                        Deactivate
                                                    </button>
                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            )}


            {/* ROLES & PERMISSIONS */}

            {activeTab === "roles" && (

                <div className="admin-content">

                    <div className="admin-card">

                        <h2>
                            Roles & Permissions
                        </h2>


                        <p className="section-description">
                            Assign permissions to each
                            employee role.
                        </p>


                        <div className="roles-container">

                            {roles.map((role) => (

                                <div
                                    className="role-card"
                                    key={role.id}
                                >

                                    <div className="role-header">

                                        <div>

                                            <h3>
                                                {role.name}
                                            </h3>

                                            <p>
                                                {role.description}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="permissions-grid">

                                        {permissions.map(
                                            (permission) => (

                                                <label
                                                    className="permission-item"
                                                    key={
                                                        permission.id
                                                    }
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={hasPermission(
                                                            role,
                                                            permission.id
                                                        )}
                                                        onChange={() =>
                                                            handlePermissionChange(
                                                                role,
                                                                permission.id
                                                            )
                                                        }
                                                    />


                                                    <span>

                                                        <strong>
                                                            {permission.name}
                                                        </strong>


                                                        <small>
                                                            {
                                                                permission.description
                                                            }
                                                        </small>

                                                    </span>

                                                </label>

                                            )
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            )}


            {/* AUDIT LOGS */}

            {activeTab === "audit" && (

                <div className="admin-content">

                    <div className="admin-card">

                        <h2>
                            Audit Logs
                        </h2>


                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Resource</th>
                                        <th>Status</th>
                                        <th>IP Address</th>
                                        <th>Time</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {auditLogs.map((log) => (

                                        <tr key={log.id}>

                                            <td>
                                                {log.id}
                                            </td>


                                            <td>
                                                {log.user_name ||
                                                    "System"}
                                            </td>


                                            <td>
                                                {log.action}
                                            </td>


                                            <td>
                                                {log.resource || "-"}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        log.status ===
                                                        "SUCCESS"
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }
                                                >
                                                    {log.status}
                                                </span>

                                            </td>


                                            <td>
                                                {log.ip_address ||
                                                    "-"}
                                            </td>


                                            <td>
                                                {new Date(
                                                    log.created_at
                                                ).toLocaleString()}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminPanel;