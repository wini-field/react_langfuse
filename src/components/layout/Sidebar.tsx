import React from 'react';
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
    return (
        <aside style = { {width: '200px', borderRight: '1px solid #ccc', height: '100vh', padding: '20px' } }>
            <h2>Menu</h2>
            <nav>
                <ul>
                    <li><Link to="/">Main</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/evaluation">Evaluation</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;