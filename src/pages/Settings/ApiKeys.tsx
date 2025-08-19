import React, { useState, useMemo } from 'react';
import { Info, Plus, Clipboard, Trash2, Copy, X } from 'lucide-react';
import commonStyles from "./layout/SettingsCommon.module.css"
import apiKeyStyles from "./layout/Apikeys.module.css";
import { getCodeSnippets } from './codeSnippets'

type ApiKey = {
    id: string;
    createdAt: string;
    note: string;
    publicKey: string;
    secretKey: string;
};

const Button = (props: React.ComponentPropsWithoutRef<"button">) => {
    return <button className = { commonStyles.button } { ...props } />
};

const ApiKeys: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newPublicKey, setNewPublicKey] = useState<string | null>(null);
    const [newSecretKey, setNewSecretKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Python');

    const host = "http://localhost:3000";

    const codeSnippets = useMemo(() => {
        if (!newPublicKey || !newSecretKey) return {};

        return getCodeSnippets({
            publicKey: newPublicKey,
            secretKey: newSecretKey,
            host: host,
        });
    }, [newPublicKey, newSecretKey, host]);

    const generateSecureRandomString = (length: number = 36): string => {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const copyToClipboard = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            alert('복사되었습니다.');
        });
    };

    const maskSecretKey = (key: string) => {
        return `${ key.slice(0, 9) } ...${ key.slice(-4) }`;
    };

    const handleCreateNewKey = () => {
        const sk = `sk-lf-${ generateSecureRandomString(4) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(6) }`;
        const pk = `pk-lf-${ generateSecureRandomString(4) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(2) }-${ generateSecureRandomString(6) }`;

        const newKey: ApiKey = {
            id: crypto.randomUUID(),
            createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\. /g, '.').slice(0, -1),
            note: "Click to add note",
            publicKey: pk,
            secretKey: sk,
        };

        setApiKeys(prevKeys => [newKey, ...prevKeys]);
        setNewPublicKey(pk);
        setNewSecretKey(sk);
        setIsModalOpen(true);
    };

    const handleDeleteKey = ( idToDelete: string ) => {
        if (window.confirm("정말로 이 API 키를 삭제하시겠습니까?")) {
            setApiKeys(prevKeys => prevKeys.filter(key => key.id !== idToDelete));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPublicKey(null);
    };

    return (
        <div className = { commonStyles.container }>
            { /* Host Name Section */ }
            <header className = { commonStyles.header }>
                <h1 className = { commonStyles.title }>
                    Project API Keys <Info size = { 12 } />
                </h1>
            </header>

            <main className = { commonStyles.content }>
                <div className = { commonStyles.keyList }>
                    <div className = { `${ commonStyles.keyRow } ${ commonStyles.keyHeader }` }>
                        <div>Created</div>
                        <div>Note</div>
                        <div>Public Key</div>
                        <div>Secret Key</div>
                        <div>Actions</div>
                    </div>

                    { apiKeys.map(key => (
                        <div key = { key.id } className = { commonStyles.keyRow }>
                            <div>{ key.createdAt }</div>
                            <div className = { apiKeyStyles.note }>{ key.note }</div>
                            <div>
                                <div className = { apiKeyStyles.publicKeyCell }>
                                    <span>{ key.publicKey }</span>
                                    <button onClick = { () => copyToClipboard(key.publicKey) } className = { apiKeyStyles.copyButton }>
                                        <Clipboard size = { 14 } />
                                    </button>
                                </div>
                            </div>
                            <div className = { apiKeyStyles.secreatKeyCell }>{ maskSecretKey(key.secretKey) }</div>
                            <div>
                                <button onClick = { () => handleDeleteKey(key.id) } className = { apiKeyStyles.deleteButton }>
                                    <Trash2 size = { 14 } />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <button onClick = { handleCreateNewKey } className = { commonStyles.createButton }>
                <Plus size = { 16 } /> Create new API keys
            </button>

            {isModalOpen && (
                <div className = { apiKeyStyles.modalOverlay }>
                    <div className = { apiKeyStyles.modalContent }>
                        <div className = { apiKeyStyles.modalHeader }>
                            <h2 className = { apiKeyStyles.modalTitle }>API Keys</h2>
                            <button onClick = { handleCloseModal } className = { apiKeyStyles.closeButton }><X size = { 20 } /></button>
                        </div>

                        { newSecretKey && (
                            <div className = { apiKeyStyles.section } >
                                <h3 className = { apiKeyStyles.sectionTitle }>Secret Key</h3>
                                <p className = { apiKeyStyles.sectionDescription }>This key can only be viewed once. You can always create new keys in the project settings.</p>
                                <div className = { apiKeyStyles.inputWrapper }>
                                    <input value = { newSecretKey } readOnly className = { apiKeyStyles.input } />
                                    <button onClick = { () => copyToClipboard(newSecretKey) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                                </div>
                            </div>
                        )}

                        <div className = { apiKeyStyles.setion }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Public Key</h3>
                            <div className = { apiKeyStyles.inputWrapper }>
                                <input value = { newPublicKey ?? ""} readOnly className = { apiKeyStyles.input } />
                                <button onClick = { () => copyToClipboard(newPublicKey) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                            </div>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Host</h3>
                            <div className = { apiKeyStyles.inputWrapper }>
                                <input value = { host } readOnly className = { apiKeyStyles.input } />
                                <button onClick = { () => copyToClipboard(host) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                            </div>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Usage</h3>
                            <div className = { apiKeyStyles.tabsContainer }>
                                { Object.keys(codeSnippets).map(tab => (
                                    <button
                                        key = { tab }
                                        onClick = { () => setActiveTab(tab) }
                                        className = { `${ apiKeyStyles.tabButton } ${ activeTab === tab ? apiKeyStyles.tabActive : '' }` }
                                    >
                                        { tab }
                                    </button>
                                    ))}
                            </div>
                            <div className = { apiKeyStyles.codeBlockWrapper }>
                                <pre className = { apiKeyStyles.codeBlock }>
                                    <code>{ codeSnippets[activeTab] }</code>
                                </pre>
                                <button onClick = { () => copyToClipboard(codeSnippets[activeTab])} className = { apiKeyStyles.copyButtonInCode }>
                                    <Copy size = { 16 } />
                                </button>
                            </div>
                        </div>
                        <p className = { apiKeyStyles.footerLinks }>
                            See <a href="#">Quickstart</a> and <a href="#">Python docs</a> for more details and an end-to-end example.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;