import api from "./api";

export const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post(
        "/admin/users",
        userData
    );

    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(
        `/admin/users/${userId}`,
        userData
    );

    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(
        `/admin/users/${userId}`
    );

    return response.data;
};

export const getAuditLogs = async () => {
    const response = await api.get(
        "/admin/audit-logs"
    );

    return response.data;
};

export const getRoles = async () => {
    const response = await api.get("/admin/roles");
    return response.data;
};

export const getPermissions = async () => {
    const response = await api.get("/admin/permissions");
    return response.data;
};

export const updateRolePermissions = async (
    roleId,
    permissionIds
) => {
    const response = await api.put(
        `/admin/roles/${roleId}/permissions`,
        {
            permissionIds
        }
    );

    return response.data;
};