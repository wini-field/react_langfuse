import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ICellRendererParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Plus, Archive, ArchiveRestore, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import commonStyles from './layout/SettingsCommon.module.css'
import gridStyles from './layout/SettingsGrid.module.css'
import CustomPagination from './CustomPagination.tsx';
import ColumnMenu from "../../layouts/ColumnMenu.tsx";
import Modal from '../../components/Modal/Modal'
import NewScoreForm from './form/NewScoreForm'
import { publicKey, secretKey, baseUrl } from '../../lib/langfuse'

// Basic Auth를 위한 Base64 인코딩
const base64Credentials =
  publicKey && secretKey
    ? btoa(`${publicKey}:${secretKey}`)
    : '';


interface ApiCategory {
    value: number;
    label: string;
}

interface ApiScoreConfig {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    dataType: 'NUMERIC' | 'BOOLEAN' | 'CATEGORICAL';
    isArchived: boolean;
    minValue: number | null;
    maxValue: number | null;
    categories: ApiCategory[] | null;
    description: string | null;
}

interface ApiResponse {
    data: ApiScoreConfig[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

interface GridScoreConfig {
    id: string;
    configID: string; // 에러 해결을 위해 configID 필드 추가
    name: string;
    dataType: 'NUMERIC' | 'BOOLEAN' | 'CATEGORICAL';
    range: Record<string, string> | string;
    description: string;
    projectId: string;
    createdAt: string;
    status: 'Active' | 'Archived';
}

const transformApiToGridData = (apiData: ApiScoreConfig[]): GridScoreConfig[] => {
    return apiData.map(item => {
        let range: Record<string, string> | string = '';

        if (item.dataType === 'NUMERIC') {
            range = `Min: ${item.minValue ?? 'N/A'}, Max: ${item.maxValue ?? 'N/A'}`;
        } else if (item.dataType === 'CATEGORICAL' && item.categories) {
            range = item.categories.reduce((acc, cat) => {
                acc[cat.value.toString()] = cat.label;
                return acc;
            }, {} as Record<string, string>);
        } else if (item.dataType === 'BOOLEAN') {
            range = { '0': 'False', '1': 'True' };
        }

        return {
            id: item.id,
            configID: item.id, // API의 id를 configID에 매핑
            name: item.name,
            dataType: item.dataType,
            range: range,
            description: item.description ?? '',
            projectId: item.projectId,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
            status: item.isArchived ? 'Archived' : 'Active',
        };
    });
};

// Range Renderer
const RangeRenderer: React.FC<ICellRendererParams<GridScoreConfig, GridScoreConfig['range']>> = (props) => {
    const rangeData = props.value;
    let displayValue = '';
    if (typeof rangeData === 'object' && rangeData !== null) {
        displayValue = JSON.stringify(rangeData, null, 2);
    } else if (typeof rangeData === 'string') {
        displayValue = rangeData;
    }
    return <div className={commonStyles.simpleTokenizerCell} style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{displayValue}</div>;
};

// Actions Renderer
interface ActionsRendererProps extends ICellRendererParams<GridScoreConfig> {
    onToggleStatus: (id: string, currentStatus: 'Active' | 'Archived') => void;
}

const ActionsRenderer: React.FC<ActionsRendererProps> = (props) => {
    const { data, onToggleStatus } = props;

    // 상태 변경 버튼 클릭 핸들러
    const handleToggleClick = () => {
        if (data) {
            onToggleStatus(data.id, data.status);
        }
    };

    // status 값에 따라 다른 아이콘을 보여줍니다.
    const Icon = data?.status === 'Active' ? Archive : ArchiveRestore;
    const tooltip = data?.status === 'Active' ? 'Archive this score' : 'Restore this score';

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <button
                onClick={handleToggleClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                title={tooltip}
            >
                <Icon size={16} />
            </button>
        </div>
    );
};

const COLUMN_DEFINITIONS: (ColDef & { headerName: string; field: string, initialHide?: boolean })[] = [
    { field: 'name', headerName: 'Name', flex: 2, resizable: true, sortable: true },
    { field: 'dataType', headerName: 'Data Type', flex: 1.5, resizable: true, sortable: true },
    { field: 'range', headerName: 'Range', cellRenderer: RangeRenderer, flex: 3, resizable: true, autoHeight: true },
    { field: 'description', headerName: 'Description', flex: 3, resizable: true },
    { field: 'configID', headerName: 'Config ID', flex: 3, resizable: true, initialHide: true },
    { field: 'createdAt', headerName: 'Created At', flex: 1, resizable: true, initialHide: true },
    { field: 'status', headerName: 'Status', flex: 1, resizable: true, sortable: true },
    { field: 'actions', headerName: 'Action', cellRenderer: ActionsRenderer, flex: 1, resizable: false, sortable: false, },
]

const Scores: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const pageSizes = useMemo(() => [10, 20, 30, 40, 50], []);

    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const columnButtonRef = useRef<HTMLDivElement>(null);

    const [rowData, setRowData] = useState<GridScoreConfig[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [scoreToToggle, setScoreToToggle] = useState<{ id: string; status: 'Active' | 'Archived' } | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 페이지네이션 상태 추가
    const [paginationMeta, setPaginationMeta] = useState<ApiResponse['meta'] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchScoreConfigs = useCallback(async (page: number, limit: number) => {
        if (!base64Credentials) {
            setError("Langfuse API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // ✅ 2. import한 baseUrl 사용
            const response = await fetch(`${baseUrl}/api/public/score-configs?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: API 키가 올바른지 확인해주세요.');
                }
                throw new Error('Failed to fetch score configs');
            }
            const data: ApiResponse = await response.json();
            const gridData = transformApiToGridData(data.data);
            setRowData(gridData);
            setPaginationMeta(data.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setRowData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScoreConfigs(currentPage, limit);
    }, [currentPage, limit, fetchScoreConfigs]);

    // 상태 변경 요청 핸들러
    const handleToggleRequest = useCallback((id: string, currentStatus: 'Active' | 'Archived') => {
        setScoreToToggle({ id, status: currentStatus });
        setIsToggleModalOpen(true);
    }, []);

    // 상태 변경 확정 핸들러
    const handleConfirmToggle = async () => {
        if (scoreToToggle !== null) {
            const isArchived = scoreToToggle.status === 'Active';
            try {
                // ✅ 3. import한 baseUrl 사용
                const response = await fetch(`${baseUrl}/api/public/score-configs/${scoreToToggle.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${base64Credentials}`
                    },
                    body: JSON.stringify({ isArchived: isArchived }),
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized: API 키가 올바른지 확인해주세요.');
                    }
                    throw new Error('Failed to update status');
                }
                fetchScoreConfigs(currentPage, limit);
            } catch (err) {
                console.error("Failed to toggle status:", err);
                alert(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setScoreToToggle(null);
                setIsToggleModalOpen(false);
            }
        }
    };

    const [columnVisibility, setColumnVisibility] = useState(() =>{
        const initialVisibility: { [key: string]: boolean } = {};
        COLUMN_DEFINITIONS.forEach(col => {
            if (col.field) {
                initialVisibility[col.field] = !col.initialHide;
            }
        });
        return initialVisibility;
    });

    const toggleColumnVisibility = (field: keyof typeof columnVisibility) => {
        const columnDef = COLUMN_DEFINITIONS.find(c => c.field === field);
        if (columnDef?.lockVisible) {
            return;
        }
         setColumnVisibility(prev => ({ ...prev, [field]: !prev[field] }));
     };

    const toggleAllColumns = (select: boolean) => {
        const newVisibility = { ...columnVisibility };
        COLUMN_DEFINITIONS.forEach(col => {
            if (!col.lockVisible) {
                newVisibility[col.field as keyof typeof columnVisibility] = select;
            }
        });
        setColumnVisibility(newVisibility);
    };

    const visibleColumnCount = useMemo(() => {
        return Object.values(columnVisibility).filter(isVisible => isVisible).length;
    }, [columnVisibility]);

    const mandatoryFields = useMemo(() =>
        COLUMN_DEFINITIONS.filter(c => c.lockVisible).map(c => c.field),
    []);

    const columnDisplayNames = useMemo(() =>
        COLUMN_DEFINITIONS.reduce((acc, col) => {
            if (col.field) {
                acc[col.field] = col.headerName;
            }
            return acc;
        }, {} as Record<string, string>),
    []);

    const columnDefs = useMemo((): ColDef[] =>
        COLUMN_DEFINITIONS.map(col => ({
            ...col,
            hide: !columnVisibility[col.field as keyof typeof columnVisibility],
            cellRendererParams: col.field === 'actions' ? { onToggleStatus: handleToggleRequest } : undefined,
        })),
    [columnVisibility]);

    const icons = {
       paginationFirst: () => <ChevronsLeft size={18} />,
       paginationPrev: () => <ChevronLeft size={18} />,
       paginationNext: () => <ChevronRight size={18} />,
       paginationLast: () => <ChevronsRight size={18} />,
   };

    const onGridReady = useCallback((event: GridReadyEvent) => {
        setGridApi(event.api);
    }, []);

    // 모달의 동적 컨텐츠
    const modalInfo = useMemo(() => {
        if (!scoreToToggle) return { title: '', message: '', buttonText: '' };
        const isArchiving = scoreToToggle.status === 'Active';
        return {
            title: isArchiving ? 'Archive Score Config' : 'Restore Score Config',
            message: `Are you sure you want to ${isArchiving ? 'archive' : 'restore'} this score config?`,
            buttonText: isArchiving ? 'Archive' : 'Restore',
        };
    }, [scoreToToggle]);

    if (isLoading) return <div className={commonStyles.container}>Loading...</div>;
    if (error) return <div className={commonStyles.container}>Error: {error} <button onClick={() => fetchScoreConfigs(currentPage, limit)}>Retry</button></div>;

    return (
        <div className = { commonStyles.container }>
            <h3>Score Configs</h3>
            <p>Score configs define which scores are available for annotation in your project. Please note that all score configs are immutable.</p>
            <div className = { gridStyles.header }>
                {/* ✅ Columns 버튼을 div로 감싸서 position 기준점으로 만듦 */}
                <div ref = { columnButtonRef } className = { gridStyles.columnsButtonWrapper } onClick={() => setIsColumnMenuOpen(prev => !prev)}>
                    <button
                        className = { `${ gridStyles.headerButton } ${ gridStyles.columnsButton }` }
                    >
                        <span>Columns</span>
                        <span className = { gridStyles.count }>{ visibleColumnCount }/{ COLUMN_DEFINITIONS.length }</span>
                    </button>
                    <ColumnMenu
                        isOpen = { isColumnMenuOpen }
                        onClose = { () => setIsColumnMenuOpen(false) }
                        anchorE1 = { columnButtonRef }
                        columnVisibility = { columnVisibility }
                        toggleColumnVisibility = { toggleColumnVisibility }
                        displayNames = { columnDisplayNames }
                        mandatoryFields = { mandatoryFields }
                        onToggleAll = { toggleAllColumns }
                    />
                </div>
                <button onClick = { () => setIsModalOpen(true) } className = { `${ gridStyles.headerButton} ${ gridStyles.addButton }` } >
                    <Plus size = { 16 } /> Add new score config
                </button>
            </div>

            <div className = { `ag-theme-alpine ${gridStyles.gridContainer }` }>
                <AgGridReact
                    ref = { gridRef }
                    rowData = { rowData }
                    columnDefs = { columnDefs }
                    suppressRowClickSelection = { true }
                    icons = { icons }
                    rowHeight = { 96 }
                    onGridReady = { onGridReady }
                    domLayout = 'autoHeight'
                />
            </div>

            <Modal
                title = "Add new score config"
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewScoreForm onClose = { () => setIsModalOpen(false) } />
            </Modal>

            {/* 상태 변경 확인 모달 */}
            <Modal
                title={modalInfo.title}
                isOpen={isToggleModalOpen}
                onClose={() => setIsToggleModalOpen(false)}
            >
                <div>
                    <p>{modalInfo.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                        <button onClick={() => setIsToggleModalOpen(false)} className={gridStyles.headerButton}>
                            Cancel
                        </button>
                        <button onClick={handleConfirmToggle} className={`${gridStyles.headerButton} ${scoreToToggle?.status === 'Active' ? gridStyles.deleteButton : gridStyles.addButton}`}>
                            {modalInfo.buttonText}
                        </button>
                    </div>
                </div>
            </Modal>

            {gridApi && paginationMeta && (
                <CustomPagination
                    gridApi={gridApi}
                    pageSizes={pageSizes}
                    currentPage={paginationMeta.page}
                    totalPages={paginationMeta.totalPages}
                    totalItems={paginationMeta.totalItems}
                    onPageChange={(page) => setCurrentPage(page)}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setCurrentPage(1); // 페이지 크기 변경 시 1페이지로
                    }}
                />
            )}
        </div>
    );
};

export default Scores;