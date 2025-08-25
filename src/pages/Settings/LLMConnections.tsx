import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/Modal/Modal'
import NewLLMConnectionForm, { LLMConnectionData } from "./form/NewLLMConnectionsForm";
import styles from "./layout/SettingsCommon.module.css";
import llmstyles from './layout/LLMConnections.module.css';
import { Plus, Pencil, Trash2 } from "lucide-react";

// API 스키마에 맞춰 인터페이스 업데이트
interface Connection {
    id: string;
    provider: string;
    adapter: string;
    baseUrl: string | null;
    displaySecretKey: string;
}

const LLMConnections = () => {
 // 목업 데이터 대신 빈 배열로 초기화
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 로딩 및 에러 상태 추가
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API 호출 함수 (페이지네이션 제거)
    const fetchConnections = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 페이지네이션 파라미터 제거
            const response = await fetch(`/api/public/llm-connections`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setConnections(result.data);
            // setPaginationMeta 제거
        } catch (e) {
            console.error("LLM 연결 목록을 가져오는 데 실패했습니다:", e);
            setError('데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 컴포넌트 마운트 시 데이터 fetching
    useEffect(() => {
        fetchConnections();
    }, [fetchConnections]);

    // 저장 핸들러: API POST 요청으로 수정
    const handleSaveConnection = async (newConnectionData: LLMConnectionData) => {
        try {
            const response = await fetch('/api/public/llm-connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: newConnectionData.provider,
                    adapter: newConnectionData.adapter,
                    secretKey: newConnectionData.apiKey,
                    baseURL: newConnectionData.baseUrl || null,
                    withDefaultModels: newConnectionData.enableDefaultModels,
                    customModels: newConnectionData.customModels,
                    extraHeaders: newConnectionData.extraHeaders,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '저장에 실패했습니다.');
            }

            setIsModalOpen(false);
            fetchConnections(); // 성공 시 목록 새로고침
        } catch (e) {
            console.error("LLM 연결 저장에 실패했습니다:", e);
            alert(`저장 중 오류가 발생했습니다: ${e instanceof Error ? e.message : String(e)}`);
        }
    };

    // 삭제 핸들러
    const handleDeleteConnection = async (id: string) => {
        if (!window.confirm('정말로 이 연결을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/api/public/llm-connections/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '삭제에 실패했습니다.');
            }

            fetchConnections(); // 삭제 성공 시 목록 새로고침
        } catch (e) {
            console.error(`${id} 연결 삭제에 실패했습니다:`, e);
            alert(`삭제 중 오류가 발생했습니다: ${e instanceof Error ? e.message : String(e)}`);
        }
    };

    if (isLoading) {
        return <div className={styles.container}>Loading connections...</div>;
    }

    if (error) {
        return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
    }

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
                        <span>{ conn.baseUrl || 'default '}</span>
                        <span>{ conn.displaySecretKey }</span>
                        <div className={llmstyles.actions}>
                            <button title="Edit" disabled><Pencil size={16} />️</button>
                            <button title="Delete" onClick={() => handleDeleteConnection(conn.id)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick = { () => setIsModalOpen(true) } className = { styles.createButton }>
                <Plus size = { 16 } /> Add LLM Connection
            </button>

            <Modal
                title = "New LLM Connection"
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewLLMConnectionForm
                    onSave={handleSaveConnection}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default LLMConnections;