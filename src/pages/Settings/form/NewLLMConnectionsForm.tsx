import React from 'react';
import styles from './NewLLMConnectionForm.module.css';

interface NewLLMConnectionFormProps {
    data: {
        provider: string;
        adapter: string;
        baseUrl: string;
        apiKey: string;
    };
    setData: React.Dispatch<React.SetStateAction<any>>;
}

const NewLLMConnectionForm = ({ data, setData }: NewLLMConnectionFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData((prevData: any) => ({ ...prevData, [id]: value }));
}

    return (
        <div className = { styles.formGrid }>
            <label htmlFor = "provider">Provider</label>
            <input id = "provider" type = "text" value = { data.provider } onChange = { handleChange } placeholder = "e.g., openai" />

            <label htmlFor = "adapter">Provider</label>
            <input id = "adapter" type = "text" value = { data.adapter } onChange = { handleChange } placeholder = "e.g., gpt-4-turbo" />

            <label htmlFor = "baseUrl">Provider</label>
            <input id = "baseUrl" type = "text" value = { data.baseUrl } onChange = { handleChange } placeholder = "https://api.openai.com/v1" />

            <label htmlFor = "apiKey">Provider</label>
            <input id = "apiKey" type = "password" value = { data.apiKey } onChange = { handleChange } placeholder = "sk-..." />
        </div>
    );
};

export default NewLLMConnectionForm;