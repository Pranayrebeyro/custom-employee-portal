CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS UserRoles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES Roles(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RolePermissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    FOREIGN KEY (role_id)
        REFERENCES Roles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (permission_id)
        REFERENCES Permissions(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AuditLogs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(120) NOT NULL,
    resource VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    ip_address INET,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE SET NULL
);