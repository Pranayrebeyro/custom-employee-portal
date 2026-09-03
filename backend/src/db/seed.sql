-- ============================================
-- ROLES
-- ============================================

INSERT INTO Roles (name, description)
VALUES
    ('Admin', 'Full access to the employee portal and integrated Zoho services'),
    ('HR', 'Human resources access through Zoho People'),
    ('Sales', 'Sales and customer relationship access through Zoho CRM'),
    ('Support', 'Support ticketing and case management through Zoho Desk'),
    ('Finance', 'Financial and accounting access through Zoho Books')
ON CONFLICT (name) DO NOTHING;


-- ============================================
-- PERMISSIONS
-- ============================================

INSERT INTO Permissions (name, description)
VALUES
    ('portal:read', 'Access the employee portal'),

    ('zoho:people', 'Access Zoho People'),
    ('zoho:crm', 'Access Zoho CRM'),
    ('zoho:desk', 'Access Zoho Desk'),
    ('zoho:books', 'Access Zoho Books'),

    ('admin:users', 'Create, edit and delete users'),
    ('admin:roles', 'Create and manage roles'),
    ('admin:permissions', 'Manage permissions'),
    ('admin:audit', 'View audit logs')
ON CONFLICT (name) DO NOTHING;


-- ============================================
-- ADMIN ROLE PERMISSIONS
-- ============================================

INSERT INTO RolePermissions (role_id, permission_id)
SELECT r.id, p.id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.name = 'Admin'
ON CONFLICT DO NOTHING;


-- ============================================
-- HR ROLE
-- Zoho People
-- ============================================

INSERT INTO RolePermissions (role_id, permission_id)
SELECT r.id, p.id
FROM Roles r
JOIN Permissions p
    ON p.name IN (
        'portal:read',
        'zoho:people'
    )
WHERE r.name = 'HR'
ON CONFLICT DO NOTHING;


-- ============================================
-- SALES ROLE
-- Zoho CRM
-- ============================================

INSERT INTO RolePermissions (role_id, permission_id)
SELECT r.id, p.id
FROM Roles r
JOIN Permissions p
    ON p.name IN (
        'portal:read',
        'zoho:crm'
    )
WHERE r.name = 'Sales'
ON CONFLICT DO NOTHING;


-- ============================================
-- SUPPORT ROLE
-- Zoho Desk
-- ============================================

INSERT INTO RolePermissions (role_id, permission_id)
SELECT r.id, p.id
FROM Roles r
JOIN Permissions p
    ON p.name IN (
        'portal:read',
        'zoho:desk'
    )
WHERE r.name = 'Support'
ON CONFLICT DO NOTHING;


-- ============================================
-- FINANCE ROLE
-- Zoho Books
-- ============================================

INSERT INTO RolePermissions (role_id, permission_id)
SELECT r.id, p.id
FROM Roles r
JOIN Permissions p
    ON p.name IN (
        'portal:read',
        'zoho:books'
    )
WHERE r.name = 'Finance'
ON CONFLICT DO NOTHING;