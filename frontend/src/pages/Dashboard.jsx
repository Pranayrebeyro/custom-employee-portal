import { useState } from "react";
import "./Dashboard.css";
import { logoutUser } from "../services/authService";
import {
    getPeople,
    getCRM,
    getDesk,
    getBooks
} from "../services/zohoService";
import ZohoDataView from "../components/ZohoDataView";

function Dashboard({ user, onLogout, onOpenAdmin }) {

    const [selectedApp, setSelectedApp] = useState(null);
    const [appData, setAppData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const applications = [
        {
            name: "Zoho People",
            description: "Employee and HR management",
            permission: "zoho:people",
            icon: "👥",
            loadData: getPeople
        },
        {
            name: "Zoho CRM",
            description: "Customer relationship management",
            permission: "zoho:crm",
            icon: "📊",
            loadData: getCRM
        },
        {
            name: "Zoho Desk",
            description: "Customer support and ticket management",
            permission: "zoho:desk",
            icon: "🎧",
            loadData: getDesk
        },
        {
            name: "Zoho Books",
            description: "Accounting and financial management",
            permission: "zoho:books",
            icon: "💰",
            loadData: getBooks
        }
    ];

    const hasPermission = (permission) => {
        return user.permissions.includes(permission);
    };

    const handleOpenApplication = async (application) => {
        setSelectedApp(application);
        setAppData(null);
        setError("");
        setLoading(true);

        try {
            const data = await application.loadData();
            setAppData(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to retrieve application data."
            );
        } finally {
            setLoading(false);
        }
    };

    const closeApplication = () => {
        setSelectedApp(null);
        setAppData(null);
        setError("");
    };

    const handleLogout = () => {
        logoutUser();
        onLogout();
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Custom Employee Portal</h1>
                    <p>Employee workspace</p>
                </div>

                <div className="user-section">

                    <div className="user-info">
                        <strong>{user.name}</strong>
                        <span>{user.roles.join(", ")}</span>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="dashboard-content">

                <section className="welcome-section">

                    <h2>
                        Welcome, {user.name}
                    </h2>

                    <p>
                        Access the applications available for your role.
                    </p>

                </section>

                <section>

                    <h3 className="section-title">
                        Your Applications
                    </h3>

                    <div className="application-grid">

                        {applications
                            .filter((app) =>
                                hasPermission(app.permission)
                            )
                            .map((app) => (

                                <div
                                    className="application-card"
                                    key={app.permission}
                                >

                                    <div className="application-icon">
                                        {app.icon}
                                    </div>

                                    <div className="application-info">

                                        <h3>{app.name}</h3>

                                        <p>
                                            {app.description}
                                        </p>

                                    </div>

                                    <button
                                        className="open-button"
                                        onClick={() =>
                                            handleOpenApplication(app)
                                        }
                                    >
                                        Open
                                    </button>

                                </div>

                            ))}

                    </div>

                </section>

                {hasPermission("admin:users") && (
                    <section className="admin-section">

                        <h3 className="section-title">
                            Administration
                        </h3>

                        <div className="admin-card">

                            <div className="application-icon">
                                ⚙️
                            </div>

                            <div className="application-info">

                                <h3>Admin Panel</h3>

                                <p>
                                    Manage users, roles, permissions
                                    and audit logs.
                                </p>

                            </div>

                            <button
    className="open-button"
    onClick={onOpenAdmin}
>
    Manage
</button>

                        </div>

                    </section>
                )}

            </main>

            {selectedApp && (
                <div className="modal-overlay">

                    <div className="application-modal">

                        <div className="modal-header">

                            <div>
                                <h2>{selectedApp.name}</h2>
                                <p>{selectedApp.description}</p>
                            </div>

                            <button
                                className="close-button"
                                onClick={closeApplication}
                            >
                                ×
                            </button>

                        </div>

                        <div className="modal-body">

                            {loading && (
                                <div className="loading">
                                    Loading {selectedApp.name}...
                                </div>
                            )}

                            {error && (
                                <div className="modal-error">
                                    {error}
                                </div>
                            )}

                            {appData && !loading && !error && (
    <ZohoDataView
        appName={selectedApp.name}
        data={appData}
    />
)}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Dashboard;