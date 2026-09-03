# Custom Employee Portal with Zoho One Integration

A web-based employee portal built with React, Node.js, Express, PostgreSQL, and Zoho One APIs.

The application provides secure authentication, role-based access control (RBAC), employee management, audit logging, and controlled access to Zoho applications through a backend service integration.

## Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Secure password hashing with bcrypt
- PostgreSQL database
- Admin user management
- Role and permission management
- Audit logging
- Zoho One OAuth integration
- Backend-only Zoho API integration
- Permission-based Zoho application access
- Responsive React dashboard
- Protected Admin Panel
- Environment-based configuration

## Role-Based Zoho Access

| Role | Zoho Application |
|------|------------------|
| Admin | All Zoho applications |
| HR | Zoho People |
| Sales | Zoho CRM |
| Support | Zoho Desk |
| Finance | Zoho Books |

The backend independently validates permissions before allowing access to each Zoho service.

## Technology Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Axios
- JWT
- bcryptjs

### Database

- PostgreSQL

### External Integration

- Zoho One
- Zoho OAuth
- Zoho People
- Zoho CRM
- Zoho Desk
- Zoho Books

## Project Structure

```text
custom-employee-portal/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── zoho/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md