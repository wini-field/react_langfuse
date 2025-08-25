import React from 'react';
import Modal from '../../../components/Modal/Modal';
import styles from './DeleteForm.module.css'; // 전용 스타일 파일

interface DeleteFormProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode; // 메시지에 JSX를 포함할 수 있도록 React.ReactNode 타입 사용
    deleteButtonText?: string;
    deleteButtonVariant?: 'danger' | 'primary'; // 버튼 스타일 옵션
}

const DeleteForm: React.FC<DeleteFormProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onConfirm,
                                                   title,
                                                   message,
                                                   deleteButtonText = 'Confirm',
                                                   deleteButtonVariant = 'primary',
                                               }) => {
    if (!isOpen) {
        return null;
    }

    const deleteButtonClassName = `${styles.button} ${
        deleteButtonVariant === 'danger' ? styles.dangerButton : styles.primaryButton
    }`;

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <div className={styles.container}>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button onClick={onConfirm} className={deleteButtonClassName}>
                        {deleteButtonText}
                    </button>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteForm;