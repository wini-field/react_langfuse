import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header';
import SettingsSidebar from '../../components/layout/SettingsSidebar';

const SettingsPage: React.FC = () => {
    return (
        <div>
            <Header title = "Project Settings" />
            <div style = { { display: 'flex', marginTop: '32px' } }>
                <SettingsSidebar />
                <div style = { { flex: 1 } }>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;