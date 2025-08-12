import React, { useState, useCallback, useRef } from 'react'
import { ColDef, ICellRendererParams, PaginationChangedEvent, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Plus, GitCommitHorizontal, Menu, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
const TokenizerConfRenderer: React.FC<ICellRendererParams> = ({ data }) => {
    const config = data.tokenizerConfig;
    const entries = Object.entries(config);

    return (
        <div className = { styles.simpleTokenizerCell }>
            { entries.map(([key, value]) => (
                <div key = { key }>
                    { `{${ key }: "${ value }"` }
                </div>
            ))}
        </div>
    );
};

// Actions 버튼
const ActionsRenderer: React.FC<ICellRendererParams> = (props) => {
    return (
        <div className = { styles.cellCenter }>
            <button className = { styles.cloneButton }>Clone</button>
        </div>
    );
};

const Models: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [columnDefs] = useState<ColDef[]>([
        {
            field: 'modelName',
            headerName: 'Model Name',
            defaultWidth: 100,
            minWidth: 50,
            cellStyle: { 'fontWeight': 'bold' }
        },
        {
            field: 'maintainer',
            headerName: 'Maintainer',
            cellRenderer: MaintainerRenderer,
            defaultWidth: 100,
            minWidth: 50,
        },
        { field: 'matchPattern', headerName: 'Match Pattern', defaultWidth: 100, minWidth: 50, },
        {
            field: 'prices',
            headerName: 'Prices per unit',
            cellRenderer: PricesRenderer,
            defaultWidth: 100,
            minWidth: 50,
        },
        { field: 'tokenizer', headerName: 'Tokenizer', defaultWidth: 100, minWidth: 50, },
        {
            field: 'tokenizerConfig',
            headerName: 'Tokenizer Config',
            cellRenderer: TokenizerConfRenderer,
            defaultWidth: 100,
            minWidth: 50,
            autoHeight: true
        },
        { field: 'lastUsed', headerName: 'Last used', defaultWidth: 100, minWidth: 50, },
        {
            field: 'actions',
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            defaultWidth: 100,
            minWidth: 50,
        },
    ]);

     const [rowData] = useState([
        { modelName: 'babbage-002', matchPattern: '(?i)^(babbage-002)$', inputPrice: 0.000004, outputPrice: 0.000016, tokenizer: 'openai', tokenizerConfig: { tokenizerModel: "babbage-002" }, lastUsed: '' },
        { modelName: 'chat-bison', matchPattern: '(?i)^(chat-bison)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: '', tokenizerConfig: {}, lastUsed: '' },
        { modelName: 'chat-bison-32k', matchPattern: '(?i)^(chat-bison-32k)(@[a-za-Z0-9_-]+)?$', inputPrice: 0.00000025, outputPrice: 0.00000050, tokenizer: '', tokenizerConfig: {}, lastUsed: '' },
        { modelName: 'chatgpt-4o-latest', matchPattern: '(?i)^(chatgpt-4o-latest)$', inputPrice: 0.000005, outputPrice: 0.000015, tokenizer: 'openai', tokenizerConfig: { "tokensPerMessage": 1, "tokenizerModel": "gpt-4o" }, lastUsed: '' },
        { modelName: 'claude-1.1', matchPattern: '(?i)^(claude-1.1)$', inputPrice: 0.000008, outputPrice: 0.000024, tokenizer: 'claude', tokenizerConfig: {}, lastUsed: '' },
    ]);

     const icons = {
        paginationFirst: () => <ChevronsLeft size={18} />,
        paginationPrev: () => <ChevronLeft size={18} />,
        paginationNext: () => <ChevronRight size={18} />,
        paginationLast: () => <ChevronsRight size={18} />,
    };

     const updateTotalPages = useCallback((event: PaginationChangedEvent) => {
         const summaryPanel = gridRef.current?.api?.getGridCore().eGridDiv.querySelector('.ag-paging-page-summary-panel');
         if (summaryPanel) {
             const totalPages = event.api.paginationGetTotalPages();
             summaryPanel.setAttribute('data-total-pages', totalPages.toString());
         }
    }, []);

    // 그리드가 처음 준비되었을 때 호출되는 함수
    const onGridReady = useCallback((event: GridReadyEvent) => {
        updateTotalPages(event.api);
    }, [updateTotalPages]);

    // 페이지가 변경될 때마다 호출되는 함수
    const onPaginationChanged = useCallback((event: PaginationChangedEvent) => {
        updateTotalPages(event.api);
    }, [updateTotalPages]);

    return (
        <div className = { styles.container }>
            <h3>Models</h3>
            <p>A model represents a LLM model. It is used to calculate tokens and cost.</p>
            <div className = { styles.header }>
                <button className = { `${ styles.headerButton } ${ styles.columnsButton }` }>
                    <span>Column</span>
                    <span className = { styles.count }>8/8</span>
                </button>
                <button className = { `${ styles.headerButton } ${ styles.iconButton }` } >
                    <Menu size = { 16 } />
                </button>
                <button className = { `${ styles.headerButton} ${ styles.addButton }` } >
                    <Plus size = { 16 } /> Add model definition
                </button>
            </div>

            <div className = { `ag-theme-alpine ${styles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    pagination = { true }
                    paginationPageSize = { 50 }
                    paginationPageSizeSelector = { [10, 20, 30, 40, 50] }
                    suppressRowClickSelection = { true }
                    icons = { icons }
                    rowHeight = { 96 }
                    onGridReady = { onGridReady }
                    onPaginationChanged = { onPaginationChanged }
                />
            </div>
        </div>
    );
};

export default Models;