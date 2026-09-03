function ZohoDataView({ appName, data }) {

    if (!data) {
        return null;
    }

    // Zoho People
    if (appName === "Zoho People") {

        const employees =
            data.data?.response?.result || [];

        return (
            <div className="zoho-data">

                <h3>Employees</h3>

                {employees.map((employeeGroup, index) => {

                    const employeeRecords =
                        Object.values(employeeGroup)[0] || [];

                    return employeeRecords.map((employee) => (
                        <div
                            className="data-card"
                            key={`${employee.EmployeeID}-${index}`}
                        >

                            <div className="data-card-header">
                                <div className="data-avatar">
                                    {employee.FirstName?.charAt(0)}
                                </div>

                                <div>
                                    <h4>
                                        {employee.FirstName}{" "}
                                        {employee.LastName}
                                    </h4>

                                    <p>
                                        {employee.EmailID}
                                    </p>
                                </div>
                            </div>

                            <div className="data-grid">

                                <div>
                                    <span>Employee ID</span>
                                    <strong>
                                        {employee.EmployeeID || "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Role</span>
                                    <strong>
                                        {employee.Role || "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Status</span>
                                    <strong>
                                        {employee.Employeestatus || "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Experience</span>
                                    <strong>
                                        {employee.Experience || "0"}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    ));
                })}

            </div>
        );
    }

    // Zoho CRM
    if (appName === "Zoho CRM") {

        const organization =
            data.data?.org?.[0];

        if (!organization) {
            return <p>No CRM organization data found.</p>;
        }

        return (
            <div className="zoho-data">

                <h3>CRM Organization</h3>

                <div className="data-card">

                    <div className="data-card-header">
                        <div className="data-avatar">
                            🏢
                        </div>

                        <div>
                            <h4>
                                {organization.company_name}
                            </h4>

                            <p>
                                {organization.primary_email}
                            </p>
                        </div>
                    </div>

                    <div className="data-grid">

                        <div>
                            <span>Country</span>
                            <strong>
                                {organization.country || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>State</span>
                            <strong>
                                {organization.state || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Currency</span>
                            <strong>
                                {organization.currency || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Timezone</span>
                            <strong>
                                {organization.time_zone || "-"}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // Zoho Desk
    if (appName === "Zoho Desk") {

        const agents =
            data.data?.data || [];

        return (
            <div className="zoho-data">

                <h3>Support Agents</h3>

                {agents.map((agent) => (

                    <div
                        className="data-card"
                        key={agent.id}
                    >

                        <div className="data-card-header">

                            <div className="data-avatar">
                                {agent.firstName?.charAt(0)}
                            </div>

                            <div>
                                <h4>
                                    {agent.name}
                                </h4>

                                <p>
                                    {agent.emailId}
                                </p>
                            </div>

                        </div>

                        <div className="data-grid">

                            <div>
                                <span>Status</span>
                                <strong>
                                    {agent.status}
                                </strong>
                            </div>

                            <div>
                                <span>Role</span>
                                <strong>
                                    {agent.rolePermissionType}
                                </strong>
                            </div>

                            <div>
                                <span>Timezone</span>
                                <strong>
                                    {agent.timeZone}
                                </strong>
                            </div>

                            <div>
                                <span>Language</span>
                                <strong>
                                    {agent.langCode}
                                </strong>
                            </div>

                        </div>

                    </div>

                ))}

            </div>
        );
    }

    // Zoho Books
    if (appName === "Zoho Books") {

        const organizations =
            data.data?.organizations || [];

        return (
            <div className="zoho-data">

                <h3>Books Organizations</h3>

                {organizations.map((organization) => (

                    <div
                        className="data-card"
                        key={organization.organization_id}
                    >

                        <div className="data-card-header">

                            <div className="data-avatar">
                                💰
                            </div>

                            <div>
                                <h4>
                                    {organization.name}
                                </h4>

                                <p>
                                    {organization.email}
                                </p>
                            </div>

                        </div>

                        <div className="data-grid">

                            <div>
                                <span>Country</span>
                                <strong>
                                    {organization.country}
                                </strong>
                            </div>

                            <div>
                                <span>State</span>
                                <strong>
                                    {organization.state}
                                </strong>
                            </div>

                            <div>
                                <span>Currency</span>
                                <strong>
                                    {organization.currency_code}
                                </strong>
                            </div>

                            <div>
                                <span>Timezone</span>
                                <strong>
                                    {organization.time_zone_formatted}
                                </strong>
                            </div>

                        </div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <p>No data available.</p>
    );
}

export default ZohoDataView;