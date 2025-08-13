import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import styles from './ColumnMenu.module.css';

// 컬럼 보이기/숨기기
type ColumnVisibility = {
    [key: string]: boolean;
}

interface ColumnMenuProps {
    isOpen: boolean;
    onClose: () => void;
    columnVisibility: ColumnVisibility;
    toggleColumnVisibility: (field: string) => void;
    anchorE1: React.RefObject<HTMLElement>; // 메뉴를 띄울 기준 요소
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({
    isOpen,
    onClose,
    columnVisibility,
    toggleColumnVisibility,
    anchorE1,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    // anchorE1(버튼)의 위치를 기준으로 메뉴 위치 계산
    useEffect(() => {
        if (isOpen && anchorE1.current) {
            const rect = anchorE1.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen, anchorE1]);

    // 메뉴 바깥 클릭시 닫히게 하는 로직
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                anchorE1.current &&
                !anchorE1.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorE1]);

    if (!isOpen || !position) {
        return null;
    }

    return (
        <div ref = { menuRef } className = { styles.columnMenu }>
            { Object.keys(columnVisibility).map(key => (
                <div
                key = { key }
                className = { styles.menuItem }
                onClick = { () => toggleColumnVisibility(key) }
                >
                    <div className = { styles.checkbox }>
                        { columnVisibility[key] && <Check size = { 14 } />}
                    </div>
                    <span>{ key }</span>
                </div>
            ))}
        </div>
    );
};

export default ColumnMenu;