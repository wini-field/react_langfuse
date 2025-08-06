import React from 'react';
import Header from './Header'
import { Outlet } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div style = { { display: 'flex' } }>
            <Sidebar />
            <div style ={ { flex: 1} }>
                <Header />
                <main style = { { padding: '20px' } }>
                    { /* 페이지 내용 여기에 */ }
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Sidebar;