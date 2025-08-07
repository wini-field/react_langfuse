import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SettingsSidebar.module.css';

const SettingsSidebar: React.FC = () => {
    return (
        <nav className = { styles.nav }>
            <ul>
                <li><NavLink to = "/settings" end />General</li>
                <li><NavLink to = "/settings/ApiKeys" />API Keys</li>
                <li><NavLink to = "/settings/LLMConnections" />LLM Connections</li>
                <li><NavLink to = "/settings/Models" />Models</li>
                <li><NavLink to = "/settings/Scores" />Scores / Evaluation</li>
                <li><NavLink to = "/settings/Members" />Members</li>
                <li><NavLink to = "/settings/Integrations" />Integrations</li>
                <li><NavLink to = "/settings/Exports" />Exports</li>
                <li><NavLink to = "/settings/AuditLogs" />Audit Logs</li>
                <li><NavLink to = "/Organization/" end />Organization Settings</li>
            </ul>
        </nav>
    );
};

export default SettingsSidebar;