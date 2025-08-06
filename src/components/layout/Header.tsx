import React from 'react';

const Header: React.FC = () => {
    return (
        <header style = { { padding: '20px', borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' } }>
            <h1>Langfuse Dashboard</h1>
        </header>
    );
};

export default Header;