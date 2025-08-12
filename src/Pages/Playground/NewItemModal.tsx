import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import styles from './NewItemModal.module.css';
import LineNumberedTextarea from '../../components/LineNumberedTextarea/LineNumberedTextarea'; // 공통 컴포넌트 import

interface NewItemModalProps {
  isOpen: boolean;
  type: 'tool' | 'schema';
  onClose: () => void;
}

const NewItemModal: React.FC<NewItemModalProps> = ({ isOpen, type, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState(
    '{\n  "type": "object",\n  "properties": {},\n  "required": [],\n  "additionalProperties": false\n}'
  );

  const content = useMemo(() => {
    if (type === 'tool') {
      return {
        title: 'Create LLM Tool',
        subtitle: 'Define a tool for LLM function calling',
        descriptionHelpText: "This description will be sent to the LLM to help it understand the tool's purpose and functionality.",
        descriptionPlaceholder: "Describe the tool's purpose and usage",
        parametersLabel: 'Parameters (JSON Schema)',
        footerNote: 'Note: Changes to tools are reflected to all new traces of this project.'
      };
    }
    return {
      title: 'Create LLM Schema',
      subtitle: 'Define a JSON Schema for structured outputs',
      descriptionHelpText: 'Describe the schema',
      descriptionPlaceholder: 'Describe the schema',
      parametersLabel: 'JSON Schema',
      footerNote: 'Note: Changes to Schemas are reflected to all new traces of this project.'
    };
  }, [type]);

  if (!isOpen) return null;

  const handleSave = () => {
    console.log({ type, name, description, parameters: JSON.parse(parameters) });
    alert(`${type === 'tool' ? 'Tool' : 'Schema'} saved! (See console for details)`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{content.title}</h2>
            <p className={styles.modalSubtitle}>{content.subtitle}</p>
          </div>
          <button onClick={onClose} className={styles.closeButton}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label htmlFor="item-name">Name</label>
            <input id="item-name" type="text" placeholder="e.g., get_weather" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="item-description">Description</label>
            <p className={styles.descriptionText}>{content.descriptionHelpText}</p>
            <textarea id="item-description" rows={3} placeholder={content.descriptionPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="item-parameters">{content.parametersLabel}</label>
            <p className={styles.descriptionText}>
              Define the structure of your tool parameters using JSON Schema format.
            </p>
            {/* 기존 textarea를 LineNumberedTextarea 컴포넌트로 교체 */}
            <LineNumberedTextarea
              id="item-parameters"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              minHeight={120}
            >
              <button className={styles.prettifyButton}>Prettify</button>
            </LineNumberedTextarea>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>{content.footerNote}</span>
          <div className={styles.footerActions}>
            <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemModal;