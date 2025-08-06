import React, { useState } from 'react';

// import GeneralSettings from './components/GeneralSettings'
// import ApiKeysSettings from './components/ApiKeysSettings'

type Menu = 'General' | 'API Keys' | 'Models' | 'Scores' | 'Members';

const SettingsPage: React.FC = () => {
    const [currentMenu, setCurrentMenu] = useState<Menu>('General');

    const renderContent = () => {
        switch (currentMenu) {
            case 'General':
                return <div>General Settings Content</div>; // <GeneralSettings />
            case 'API Keys':
                return <div>API Keys Content</div>; // <ApuKeysSettings />
            case 'Scores':
                return <div>Scores Content</div>; // <GeneralSettings />
            case 'Members':
                return <div>Members Content</div>; // <GeneralSettings />
            default:
                return <div>Select a menu</div>;
        }
    };

    return (
        <div style = { { display: 'flex' } }>
            <nav style = { { borderRight: '1px solid #ccc', padding: '20px' } }>
                <h2>Settings</h2>
                <ul>
                    <li onClick = { () => setCurrentMenu('General')}>General</li>
                    <li onClick = { () => setCurrentMenu('API Keys')}>API Keys</li>
                    <li onClick = { () => setCurrentMenu('Models')}>Models</li>
                    <li onClick = { () => setCurrentMenu('Scores')}>Scores</li>
                    <li onClick = { () => setCurrentMenu('Members')}>Members</li>
                </ul>
            </nav>
            <main style = { { padding: '20px', flex: 1 } }>
                {renderContent()}
            </main>
        </div>
    );
};

export default SettingsPage;