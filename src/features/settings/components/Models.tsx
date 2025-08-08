import React from 'react'

const DUMMY_MODELS = [
    {
        id: '1',
        modelName: 'gpt-4-1106-preview',
        provider: 'OpenAI',
        isAvailable: true,
    },
    {
        id: '2',
        modelName: 'claude-2',
        provider: 'Anthropic',
        isAvailable: true,
    },
    {
        id: '3',
        modelName: 'gpt-3.5-turbo',
        provider: 'OpenAI',
        isAvailable: false,
    },
    {
        id: '4',
        modelName: 'gemini-pro',
        provider: 'Google',
        isAvailable: true,
    },
];

const Models: React.FC = () => {
    return (
        <div>
            <h2>Models</h2>
            <p>프로젝트에서 사용할 LLM 모델을 설정하세요.</p>

            <table style = { { width : '100%', marginTop: '20px', borderCollapse: 'collapse' } }>
                <thead>
                    <tr style = { { borderBottom: '1px solid #ccc', textAlign: 'left' } }>
                        <th style = { { padding: '8px' } }>Model Name</th>
                        <th style = { { padding: '8px' } }>Provider</th>
                        <th style = { { padding: '8px' } }>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { DUMMY_MODELS.map(model => (
                        <tr key = { model.id } style = { { borderBottom: '1px solid #eee' } }>
                            <td style = { { padding: '8px' } }>{model.modelName}</td>
                            <td style = { { padding: '8px' } }>{model.provider}</td>
                            <td style = { { padding: '8px' } }>{model.isAvailable ? 'Available' : 'Not Available'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Models;