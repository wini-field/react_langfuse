import React from 'react';
import styles from "./ApiKeys.module.css";

const Integarations: React.FC = () => {
    return (
        <div className = { styles.container }>
            { /* Host Name Section */ }
            <h3 className = { styles.h3 }>LLM Connections </h3>
            <h5>Connect your LLM services to enable evaluations and playground features. Your provider will charge based on usage.</h5>

            <div className = { styles.keyList }>
                <div className = { `${ styles.keyRow } ${ styles.keyHeader }` }>
                    <div>Provider</div>
                    <div>Adapter</div>
                    <div>Base URL</div>
                    <div>API Key</div>
                </div>

                { DUMMY_LLM_DATA.map(llmData => (
                    <div key = { llmData.id } className = { styles.keyRow }>
                        <div>{ llmData.provider }</div>
                        <div>{ llmData.adapter }</div>
                        <div>{ llmData.baseUrl }</div>
                        <div>{ llmData.apiKey }</div>
                    </div>
                ))}
            </div>
            <button className = { styles.addbutton }>
                Add LLM Connection
            </button>
        </div>
    );
};

export default Integarations;