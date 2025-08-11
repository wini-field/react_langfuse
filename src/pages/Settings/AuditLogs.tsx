import React from "react";
import styles from "./Apikeys.module.css";

const ApiKeys: React.FC = () => {
    return (
        <div className = { styles.container }>
            <h3 className = { styles.h3 }> Audit Logs</h3>
            <p>Track who changed what in your project and when. Monitor settings, configurations, and data changes over time. Reach out to the Langfuse team if you require more detailed/filtered audit logs.</p>
            <p></p>
            <p>Audit logs are an Enterprise feature. Upgrade your plan to track all changes made to your project.</p>
        </div>
    );
};

export default ApiKeys;