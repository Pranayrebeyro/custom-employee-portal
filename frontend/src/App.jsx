import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

function App() {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    const [currentPage, setCurrentPage] = useState("dashboard");


    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setCurrentPage("dashboard");
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setCurrentPage("dashboard");
    };


    const handleOpenAdmin = () => {

        const isAdmin =
            user?.permissions?.includes("admin:users");

        if (!isAdmin) {
            return;
        }

        setCurrentPage("admin");
    };


    if (!user) {
        return (
            <Login
                onLogin={handleLogin}
            />
        );
    }


    if (currentPage === "admin") {

        const isAdmin =
            user.permissions?.includes("admin:users");

        if (!isAdmin) {
            return (
                <Dashboard
                    user={user}
                    onLogout={handleLogout}
                    onOpenAdmin={handleOpenAdmin}
                />
            );
        }

        return (
            <AdminPanel
                onBack={() =>
                    setCurrentPage("dashboard")
                }
            />
        );
    }


    return (
        <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenAdmin={handleOpenAdmin}
        />
    );
}

export default App;