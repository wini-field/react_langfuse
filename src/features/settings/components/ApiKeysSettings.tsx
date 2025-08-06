import React from 'react';
import { Outlet } from 'react-router-dom';

const ApiKeysSettings: React.FC = () => {
    return (
        <div>
            <h1>Settings</h1>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default ApiKeysSettings;