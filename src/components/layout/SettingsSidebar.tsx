import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SettingsSidebar.module.css';

const SettingsSidebar: React.FC = () => {
    return (
        <nav className = { styles.nav }>
            <ul>
                <li><NavLink to = "/settings" end>General</NavLink></li>
                <li><NavLink to = "/settings/ApiKeys">API Keys</NavLink></li>
                <li><NavLink to = "/settings/LLMConnections">LLM Connections</NavLink></li>
                <li><NavLink to = "/settings/Models">Models</NavLink></li>
                <li><NavLink to = "/settings/Scores">Scores / Evaluation</NavLink></li>
                <li><NavLink to = "/settings/Members">Members</NavLink></li>
                <li><NavLink to = "/settings/Integrations">Integrations</NavLink></li>
                <li><NavLink to = "/settings/Exports">Exports</NavLink></li>
                <li><NavLink to = "/settings/AuditLogs">Audit Logs</NavLink></li>
                <li><NavLink to = "/Organization/" end>Organization Settings</NavLink></li>
            </ul>
        </nav>
    );
};

export default SettingsSidebar;