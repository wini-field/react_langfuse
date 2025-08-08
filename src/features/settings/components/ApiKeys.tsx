import React from 'react';

const DUMMY_API_KEYS = [
    {
        id: '1',
        name: 'My First App Key',
        keyPreview: 'sk-......aBcDe',
        createdAt: '2023-07-15',
        lastUsed: '2023-08-03',
    },
    {
        id: '2',
        name: 'Staging Server Key',
        keyPreview: 'sk-......fGhIj',
        createdAt: '2023-07-20',
        lastUsed: '2023-08-01',
    },
    {
        id: '2',
        name: 'Local Test Key',
        keyPreview: 'sk-......kLmNo',
        createdAt: '2023-08-01',
        lastUsed: 'Never used',
    },
];

const ApiKeys: React.FC = () => {
    return (
        <div>
            <h2>API Keys</h2>
            <p>백엔드와 통신하기 위한 API 키를 관리하세요.</p>
            <button>+ Add Model</button>

            <table style = { { width: '100%', marginTop: '20px', borderCollapse: 'collapse' } }>
                <thead>
                    <tr style = { { borderBottom: '1px solid #ccc', textAlign: 'left' } }>
                        <th style={ { padding: '8px' } }>Name</th>
                        <th style={ { padding: '8px' } }>Secret Key</th>
                        <th style={ { padding: '8px' } }>Created At</th>
                        <th style={ { padding: '8px' } }>Last Used</th>
                    </tr>
                </thead>
                <tbody>
                {DUMMY_API_KEYS.map(apiKey => (
                    <tr key = { apiKey.id } style = { { borderBottom: '1px solid #eee'} }>
                        <td style= { { padding: '8px' } }>{apiKey.name}</td>
                        <td style= { { padding: '8px' } }><code>{apiKey.keyPreview}</code></td>
                        <td style= { { padding: '8px' } }>{apiKey.createdAt}</td>
                        <td style= { { padding: '8px' } }>{apiKey.lastUsed}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApiKeys;