import React from 'react';
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css'

const MainLayout: React.FC = () => {
    return (
        <div className = { styles.layout }>
            <div className = { styles.contentWrapper }>
                <Sidebar />
                <main className = { styles.mainContent }>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;