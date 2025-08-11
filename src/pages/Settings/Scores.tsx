import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, ICellRendererParams} from 'ag-grid-react';
import { Plus, GitCommitHorizontal } from 'lucide-react';
import styles from './Models.module.css';

// Maintainer 아이콘
const MaintainerRenderer: React.FC<ICellRendererParams> = () => (
    <div className = { styles.maintainerCell }>
        <GitCommitHorizontal size = { 16 } color = "#ef444" />
    </div>
);

// 가격
const PricesRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { styles.pricesCell }>
        <div><span>input</span> ${ props.data.inputPrice.toFixed(4) }</div>
        <div><span>output</span> ${ props.data.outputPrice.toFixed(4) }</div>
    </div>
)

// Tokenizer 설정
const TokenizerConfRenderer: React.FC<ICellRendererParams> = (props) => {
    return (
        <pre className = { styles.tokenizerConfCell }>
            {JSON.stringify(props.data.tokenizerConfig, null, 2)}

        </pre>
    );
};

// Actions 버튼
const ActionsRederer: React.FC<ICellRendererParams> = (props) => {
    return (
        <div className = { styles.cellCenter }>
            <button className = { styles.cloneButton }>Clone</button>
        </div>
    );
};

const Scores: React.FC = () => {
    const [columnDefs] = useState<ColDef[]>([
        { field: 'modelName', headerName: 'Model Name', flex: 2 },
        {
            field: 'maintainer',
            headerName: 'Maintainer',
            cellRenderer: MaintainerRenderer,
            flex: 1
        },
        { field: 'matchPattern', headerName: 'Match Pattern', flex: 3 },
        {
            field: 'prices',
            haederName: 'Prices per unit',
            cleeRenderer: PricesRenderer,
            flex: 1.5
        },
        { field: 'tokenizer', headerName: 'Tokenizer', flex: 1 },
        {
            field: 'tokenizerConfig',
            headerName: 'Tokenizer Config',
            cellRenderer: TokenizerConfRenderer,
            flex: 2,
            autoHeight: true
        },
        { field: 'lastUsed', headerName: 'Last used', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            cellRenderer: ActionsRederer,
            flex: 1,
        },
    ]);

     const [rowData] = useState([
        { modelName: 'babbage-002', matchPattern: '(?i)^(babbage-002)$', inputPrice: 0.000004, outputPrice: 0.000016, tokenizer: 'openai', tokenizerConfig: { tokenizerModel: "babbage-002" }, lastUsed: '' },
        { modelName: 'chat-bison', matchPattern: '(?i)^(chat-bison)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: '', tokenizerConfig: {}, lastUsed: '' },
        { modelName: 'chat-bison-32k', matchPattern: '(?i)^(chat-bison-32k)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: '', tokenizerConfig: {}, lastUsed: '' },
        { modelName: 'chatgpt-4o-latest', matchPattern: '(?i)^(chatgpt-4o-latest)$', inputPrice: 0.000005, outputPrice: 0.000015, tokenizer: 'openai', tokenizerConfig: { "tokensPerMessage": 1, "tokenizerModel": "gpt-4o" }, lastUsed: '' },
        { modelName: 'claude-1.1', matchPattern: '(?i)^(claude-1.1)$', inputPrice: 0.000008, outputPrice: 0.000024, tokenizer: 'claude', tokenizerConfig: {}, lastUsed: '' },
    ]);


    return (
        <div className = { styles.container }>z
            <div className = { styles.header }>
                <button>Column = 8/8</button>
                <button><Plus size = { 16 } /> Add model definition</button>
            </div>

            <div className = { `ag-theme-alpine-dark ${ styles.gridContainer }` }>
                <AgGridReact
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    pagination = { true }
                    paginationPageSize = { 50 }
                    suppressRowClickSelection = { true }
                />
            </div>
        </div>
    );
};

export default Scores;