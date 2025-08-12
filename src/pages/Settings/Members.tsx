import React, {useState, useRef, useCallback, useMemo} from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {ColDef, GridApi, GridReadyEvent, ICellRendererParams} from 'ag-grid-community';
import {Plus, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './Models.module.css';
import memberStyles from './Members.module.css';
import CustomPagination from "./CustomPagination.tsx";

interface Member {
    id: string;
    name: string;
    email: string;
    organizationRole: 'Owner' | 'Admin' | 'Member' | 'Viewer' | 'None';
    projectRole: string;
}

const DUMMY_MEMBERS_DATA: Member[] = [
  { id: '1', name: 'Na Youngseok', email: 'youngseok@naver.com', organizationRole: 'Owner', projectRole: 'N/A on plan' },
  // 페이지네이션 테스트를 위해 데이터 추가
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `${i + 2}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    organizationRole: (['Admin', 'Member'] as const)[i % 2],
    projectRole: 'N/A on plan',
  })),
];

// Name
const NameRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { memberStyles.nameCell }>
        <span>{props.value}</span>
    </div>
)

// Organization Role
const OrganizationRoleRenderer: React.FC<ICellRendererParams> = (props) => (
    <div className = { memberStyles.roleCell }>
        <select defaultValue ={ props.value } className = { memberStyles.roleSelect }>
            <option>Owner</option>
            <option>Admin</option>
            <option>Member</option>
            <option>Viewer</option>
            <option>None</option>
        </select>
    </div>
)

const ActionsRenderer: React.FC = () => {
    return (
        <div className = { memberStyles.actionRenderer }>
            <button className = { memberStyles.actionButton }>
                <Trash2 size = { 16 } />
            </button>
        </div>
    )
}

const Members: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [rowData] = useState<Member[]>(DUMMY_MEMBERS_DATA);
    const [columnDefs] = useState<ColDef[]>([
        { field: 'name', headerName: 'Name', cellRenderer: NameRenderer, flex: 2, resizable: true, sortable: true },
        { field: 'email', headerName: 'Email', flex: 3, resizable: true, sortable: true },
        { field: 'organizationRole', headerName: 'Organization Role', cellRenderer: OrganizationRoleRenderer, flex: 2, resizable: true, sortable: true },
        { field: 'projectRole', headerName: 'Project Role', flex: 2, resizable: true, sortable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            flex: 1,
            resizable: false,
            sortable: false,
        },
    ])

     const icons = {
        paginationFirst: () => <ChevronsLeft size={18} />,
        paginationPrev: () => <ChevronLeft size={18} />,
        paginationNext: () => <ChevronRight size={18} />,
        paginationLast: () => <ChevronsRight size={18} />,
    };

    const onGridReady = useCallback((event: GridReadyEvent) => {
         setGridApi(event.api);
     }, []);

    return (
        <div className = { styles.container }>
            <h3>Project Members</h3>
            <div className = { styles.header }>
                <button className = { `${ styles.headerButton } ${ styles.columnsButton }`}>
                    <span>Column</span>
                    <span className = { styles.count }>5/6</span>
                </button>
                <button className = { `${ styles.headerButton } ${ styles.addButton }` }>
                    <Plus size = { 16 } /> Add new member
                </button>
            </div>

            <div className = { `ag-theme-alpine ${styles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    pagination = { true }
                    paginationPageSize = { pageSizes[0] }
                    suppressRowClickSelection = { true }
                    icons = { icons }
                    onGridReady = { onGridReady }
                />
            </div>
            { gridApi && <CustomPagination gridApi = { gridApi } pageSizes = { pageSizes } /> }
        </div>
    );
};

export default Members;