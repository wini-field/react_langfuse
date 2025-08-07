import React from 'react';
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const Sidebar: React.FC = () => {
    return (
        <aside className = { styles.sidebar }>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="">DashBoards</Link></li>
                    <li><Link to="">Tracing</Link></li>
                    <li><Link to="/">Sessions</Link></li>
                    <li><Link to="/">Users</Link></li>
                    <li><Link to="/">Prompts</Link></li>
                    <li><Link to="/">Playground</Link></li>
                    <li><Link to="/">Scores</Link></li>
                    <li><Link to="/">LLM-as-a-Judge</Link></li>
                    <li><Link to="/">Human Annotation</Link></li>
                    <li><Link to="/">Datasets</Link></li>
                    <li><Link to="/Settings">Settings</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;