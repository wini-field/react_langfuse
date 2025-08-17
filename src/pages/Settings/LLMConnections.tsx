import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal'
import NewLLMConnectionForm from "./form/NewLLMConnectionsForm";
import styles from "./layout/SettingsCommon.module.css";
import llmstyles from './layout/LLMConnections.module.css';
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Connection {
    id: string;
    provider: string;
    adapter: string;
    baseUrl: string;
    apiKey: string;
}

const initialFormState = {
    provider: '',
    adapter: '',
    baseUrl: '',
    apiKey: '',
};

const LLMConnections = () => {

    const [connections, setConnections] = useState<Connection[]>([
        {
            id: '1',
            provider: 'gemini',
            adapter: 'google-ai-studio',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
        {
            id: '2',
            provider: 'chatgpt',
            adapter: 'openai',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
        {
            id: '3',
            provider: 'claude',
            adapter: 'anthropic',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newConnectionData, setNewConnectionData] = useState(initialFormState);

    const handleOpenModal = () => {
        setNewConnectionData(initialFormState); // 모달 열 때 폼 초기화
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveConnection = () => {
        const { provider, apiKey } = newConnectionData;
        if (!provider || !apiKey) {
            alert('Provider와 API Key는 필수 항목입니다.');
            return;
        }

        const connectionWithId = {
            ...newConnectionData,
            id: crypto.randomUUID(),
            apiKey: `...${ apiKey.slice(-3) }`,
        };
        setConnections([...connections, connectionWithId]);
        handleCloseModal();
    };

    return (
        <div className = { styles.container }>
            { /* Host Name Section */ }
            <h3 className = { styles.title }>LLM Connections </h3>
            <p>Connect your LLM services to enable evaluations and playground features. Your provider will charge based on usage.</p>

            <div className = { styles.keyList }>
                <div className = { `${ styles.keyRow } ${ styles.keyHeader }` }>
                    <span>Provider</span>
                    <span>Adapter</span>
                    <span>Base URL</span>
                    <span>API Key</span>
                    <span style = {{ textAlign: 'center' }}>Actions</span>
                </div>
                { connections.map((conn) => (
                    <div key = { conn.id } className = { styles.keyRow }>
                        <span>{ conn.provider }</span>
                        <span>{ conn.adapter }</span>
                        <span>{ conn.baseUrl }</span>
                        <span>{ conn.apiKey }</span>
                        <div className = { llmstyles.actions }>
                            <button title = "Edit"><Pencil size = { 16 } />️</button>
                            <button title = "Delete"><Trash2 size = { 16 } /></button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick = { handleOpenModal } className = { styles.createButton }>
                <Plus size = { 16 } /> Add LLM Connection
            </button>

            <Modal
                title = "Add new LLM Connection"
                isOpen = { isModalOpen }
                onClose = { handleOpenModal }
                onConfirm = { handleSaveConnection }
                confirmText = "Save"
            >
                <NewLLMConnectionForm
                    data = { newConnectionData }
                    setData = { setNewConnectionData}
                />
            </Modal>
        </div>
    );
};

export default LLMConnections;