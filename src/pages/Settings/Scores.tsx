import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, ICellRendererParams } from 'ag-grid-react';
import {Plus, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Menu} from 'lucide-react';
import styles from './Models.module.css';

interface ScoreConfig {
    id: number;
    name: string;
    dataType: 'BOOLEAN' | 'CATEGORICAL' | 'NUMERIC';
    range: Record<string, any>;
    description: string;
    status: 'Active' | 'Archived';
}

const DUMMY_SCORES_DATA: ScoreConfig[] = [
  { id: 1, name: 'tonality_correct', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: '', status: 'Active' },
  { id: 2, name: 'answer_correct', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: '', status: 'Active' },
  { id: 3, name: 'test-july44th', dataType: 'CATEGORICAL', range: { '0': 'test1', '1': 'test2', '2': 'test3' }, description: 'To provide context to annotato...', status: 'Active' },
  { id: 4, name: 'First Pass', dataType: 'CATEGORICAL', range: { '0': 'Good Output', '1': 'Bad Output', '2': 'Saved for Later' }, description: '', status: 'Active' },
  { id: 5, name: 'is_question', dataType: 'BOOLEAN', range: { '0': 'False', '1': 'True' }, description: 'Is the user message a question?', status: 'Active' },
];

// Range
const RangeRenderer: React.FC<ICellRendererParams> = (props) => {
    const rangeData = props.value;
    let displayValue = '';

    if (typeof rangeData === 'object' && rangeData !== null) {
        displayValue = JSON.stringify(rangeData);
    } else if (typeof rangeData === 'string') {
        displayValue = rangeData;
    }

    return (
        <div className = { styles.simpleTokenizerCell }>
            {displayValue}
        </div>
    );
};

const ActionsRenderer: React.FC = () => {
    return (
        <div style = { { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
            <button style = { { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' } }>
                <Trash2 size = { 16 } />
            </button>
        </div>
    )
}

const Scores: React.FC = () => {
    const [rowData] = useState<ScoreConfig[]>(DUMMY_SCORES_DATA);

    const [columnDefs] = useState<ColDef[]>([
        { field: 'name', headerName: 'Name', flex: 2, resizable: true, sortable: true },
        { field: 'dataType', headerName: 'Data Type', flex: 1.5, resizeable: true, sortable: true },
        { field: 'range', header: 'Range', cellRenderer: RangeRenderer, flex: 3, resizable: true, autoHeight: true },
        { field: 'description', headerName: 'Description', flex: 3, resizable: true },
        { field: 'status', headerName: 'Status', flex: 1, resizable: true, sortable: true },
        {
            field: 'actions',
            headerName: 'Action',
            cellRenderer: ActionsRenderer,
            flex: 1,
            resizable: false,
            sortable: false,
        },
    ]);

     const icons = {
        paginationFirst: () => <ChevronsLeft size={18} />,
        paginationPrev: () => <ChevronLeft size={18} />,
        paginationNext: () => <ChevronRight size={18} />,
        paginationLast: () => <ChevronsRight size={18} />,
    };

    return (
        <div className = { styles.container }>
            <h3></h3>
            <p></p>
            <div className = { styles.header }>
                <button className = { `${ styles.headerButton } ${ styles.columnsButton }`}>
                    <span>Column</span>
                    <span className = { styles.count }>6/8</span>
                </button>
                <button className = { `${ styles.headerButton } ${ styles.iconButton }` } >
                    <Menu size = { 16 } />
                </button>
                <button className = { `${ styles.headerButton } ${ styles.addButton }` }>
                    <Plus size = { 16 } /> Add new score config
                </button>
            </div>

            <div className = { `ag-theme-alpine ${ styles.gridContainer }` }>
                <AgGridReact
                    rowData = {rowData}
                    columnDefs = { columnDefs }
                    pagination = { true }
                    paginationPageSize = { 50 }
                    paginationPageSizeSelector = { [10, 20, 30, 40, 50] }
                    suppressRowClickSelection = { true }
                    icons = { icons }
                    rowHeight = { 96 }
                />
            </div>
        </div>
    );
};

export default Scores;