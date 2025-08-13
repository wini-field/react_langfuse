import React from 'react';
import { Info, Plus, Clipboard, Trash2 } from 'lucide-react';
import commonStyles from "./layout/SettingsCommon.module.css"
import styles from "./layout/Apikeys.module.css";

const DUMMY_API_KEYS = [
    {
        id: '1',
        created: '2025. 8. 7',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
    {
        id: '2',
        created: '2025. 8. 1',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
    {
        id: '3',
        created: '2025. 8. 27',
        note: 'Click to add note',
        publicKey: 'pkey',
        secretKey: 'skey',
    },
];

const ApiKeys: React.FC = () => {
    return (
        <div className = { commonStyles.container }>
            { /* Host Name Section */ }
            <h3 className = { commonStyles.title }>
                Project API Keys <Info size = { 16 } />
            </h3>

            <div className = { commonStyles.keyList }>
                <div className = { `${ commonStyles.keyRow } ${ commonStyles.keyHeader }` }>
                    <div>Created</div>
                    <div>Note</div>
                    <div>Public Key</div>
                    <div>Secret Key</div>
                    <div>Actions</div>
                </div>

                { DUMMY_API_KEYS.map(apiKey => (
                    <div key = { apiKey.id } className = { commonStyles.keyRow }>
                        <div>{ apiKey.created }</div>
                        <div className = { styles.note }>{ apiKey.note }</div>
                        <div className = { styles.keyBox }>
                            <code>{ apiKey.publicKey }</code>
                            <Clipboard size = { 14 } className = { styles.copyIcon } />
                        </div>
                        <div>
                            <code>{ apiKey.secretKey }</code>
                        </div>
                        <div className = { styles.actionIcons }>
                            <button className = { styles.iconButton }><Trash2 size = { 16 } className = { styles.deleteIcon } /></button>
                        </div>
                    </div>
                ))}
            </div>
            <button className = { commonStyles.createButton }>
                <Plus size = { 16 } /> Create new API keys
            </button>
        </div>
    );
};

export default ApiKeys;