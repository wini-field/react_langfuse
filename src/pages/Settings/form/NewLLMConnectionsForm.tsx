import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './NewLLMConnectionForm.module.css';
import ToggleSwitch from "./ToggleSwitch.tsx";

interface NewLLMConnectionFormProps {
    onSave: (connection: any) => void;
    onCancel: () => void;
}

interface ListItem {
    id: string;
    [key: string]: string;
}

const NewLLMConnectionForm = ({ onSave, onCancel}: NewLLMConnectionFormProps) => {
    //기본 설정 상태
    const [adapter, setAdapter] = useState('openai');
    const [provider, setProvider] = useState('');
    const [apiKey, setApiKey] = useState('');

    //고급 설정 상태
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const [extraHeaders, setExtraHeaders] = useState<ListItem[]>([]);
    const [enableDefaultModels, setEnableDefaultModels] = useState(true);
    const [customModels, setCustomModels] = useState<ListItem[]>([]);

    // 동적 리스트 아이템 추가/삭제/수정 핸들러
    const handleListChange = (
        list: ListItem[],
        setList: React.Dispatch<React.SetStateAction<ListItem[]>>,
        id: string,
        field: string,
        value: string
    ) => {
        setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addListItem = (setList: React.Dispatch<React.SetStateAction<ListItem[]>>, newItem: ListItem) => {
        setList(prev => [...prev, newItem]);
    };

    const removeListItem = (list: ListItem[], setList: React.Dispatch<React.SetStateAction<ListItem[]>>, id: string) => {
        setList(list.filter(item => item.id !== id));
    };

    const handleSave = () => {
        if (!provider || !apiKey) {
            alert('Provider name과 API Key는 필수 항목입니다.');
            return;
        }
        const connectionDate = {
            adapter,
            provider,
            apiKey,
            ...(showAdvanced && {
                baseUrl,
                extraHeaders: extraHeaders.filter(h => h.key && h.value), // key, value 둘 다 있는 것만 저장
                enableDefaultModels,
                customModels: customModels.filter(m => m.name), // 이름 존재하는 것만 저장
            })
        };
        onSave(connectionDate);
    }

    return (
        <div className = { styles.formWrapper }>
            { /* --- 기본 설정 --- */ }
            <div className = { styles.formGroup }>
                <label htmlFor = "llm-adapter">LLM adapter</label>
                <p className = { styles.description }>Schema that is accepted at that provider endpoint.</p>
                <select id = "llm-adapter" value = { adapter } onChange = { (e) => setAdapter(e.target.value) } className = { styles.select }>
                    <option value = "openai">openai</option>
                    <option value = "anthropic">anthropic</option>
                    <option value = "azure">azure</option>
                    <option value = "bedrock">bedrock</option>
                    <option value = "google-vertex-ai">google-vertex-ai</option>
                    <option value = "google-ai-studio">google-ai-studio</option>
                    <option value = "custom">custom</option>
                </select>
            </div>

            <div className = { styles.formGroup }>
                <label htmlFor = "provider-name">Provider name</label>
                <p className = { styles.description }>Key to identify the connection within Langfuse.</p>
                <input
                    id = "provider-name"
                    type = "text"
                    value = { provider }
                    onChange = { (e) => setProvider(e.target.value) }
                    placeholder = "e.g. openai"
                    className = { styles.input }
                />
            </div>

            <div className = { styles.formGroup }>
                <label htmlFor = "api-key">API Key</label>
                <p className = { styles.description }>Your API keys are stored encrypted on our servers.</p>
                <input
                    id = "api-key"
                    type = "password"
                    value = { apiKey }
                    onChange = { (e) => setApiKey(e.target.value) }
                    placeholder = "sk-..."
                    className = { styles.input }
                />
            </div>

            { /* --- 고급 설정 토글 --- */ }
            <div className = { styles.advancedToggle } onClick = { () => setShowAdvanced(!showAdvanced) }>
                Show advanced settings { showAdvanced ? '▲' : '▼' }
            </div>

            { /* --- 고급 설정 섹션 --- */}
            { showAdvanced && (
                <div className = { styles.advancedSection }>
                    <div className = { styles.divider }></div>

                    { /* API Base URL */ }
                    <div className = { styles.formGroup }>
                        <label htmlFor = "base-url">Base URL (optional)</label>
                        <p className = { styles.description}>
                            Leave blank to use the default base URL for the given LLM adapter. OpenAI default: https://api.openai.com/v1
                        </p>
                        <input
                            id = "base-url"
                            type = "text"
                            value = { baseUrl }
                            onChange = { (e) => setBaseUrl(e.target.value) }
                            placeholder = "https://api.openai.com/v1"
                            className = { styles.input }
                        />
                    </div>

                    { /* Extra Headers */ }
                    <div className = { styles.formGroup }>
                        <label>Extra Headers</label>
                        <p className = { styles.description }>Optional additional HTTP headers to include with requests towards LLM provider. All header values stored encrypted on our servers.</p>
                        { extraHeaders.map(header => (
                            <div key = { header.id } className = { styles.listItem }>
                                <input type = "text" placeholder = "Key" value = { header.key } onChange = { e => handleListChange(extraHeaders, setExtraHeaders, header.id, 'key', e.target.value) } className = { styles.listInput } />
                                <input type = "text" placeholder = "Value" value = { header.value } onChange = { e => handleListChange(extraHeaders, setExtraHeaders, header.id, 'value', e.target.value) } className = { styles.listInput } />
                                <button onClick = { () => removeListItem(extraHeaders, setExtraHeaders, header.id) } className = { styles.deleteButton }><X size = { 16 } /></button>
                            </div>
                        ))}
                        <button onClick = { () => addListItem(setExtraHeaders, { id: crypto.randomUUID(), key: '', value: '' })} className = { styles.addButton} ><Plus size = { 16 } /> Add Header</button>
                    </div>

                    { /* Enable default models */ }
                    <div className = { `${ styles.formGroup } ${ styles.toggleGroup }` }>
                        <div>
                            <label>Enable default models</label>
                            <p className = { styles.description }>Default models for the selected adapter will be available in Langfuse features.</p>
                        </div>
                        <ToggleSwitch checked = { enableDefaultModels } onChange = { setEnableDefaultModels } />
                    </div>

                    { /* Custom modles */ }
                    <div className = { styles.formGroup }>
                        <label>Custom models</label>
                        <p className = { styles.description }>Custom model names accepted by given endpoint.</p>
                        { customModels.map(model => (
                            <div key = { model.id } className = { styles.listItem }>
                                <input type = "text" placeholder = "Model name" value = { model.name } onChange = { e => handleListChange(customModels, setCustomModels, model.id, 'name', e.target.value) } className = { styles.listInputFull} />
                                <button onClick = { () => removeListItem(customModels, setCustomModels, model.id) } className = { styles.deleteButton }><X size = { 16 } /></button>
                            </div>
                        ))}
                        <button onClick = { () => addListItem(setCustomModels, { id: crypto.randomUUID(), name: ''})} className = { styles.addButton }><Plus size = { 16 } /> Add custom model name</button>
                    </div>
                </div>
            )}

            { /* --- Footer --- */}
            <div className = { styles.footer }>
                <button onClick = { handleSave } className = "btn-primary">
                    Create connection
                </button>
            </div>
        </div>
    );
};

export default NewLLMConnectionForm;