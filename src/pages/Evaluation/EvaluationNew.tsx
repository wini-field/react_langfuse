// src/pages/Evaluation/EvaluationNew.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EvaluationNew.module.css';

export default function EvaluationNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: '',
    name: '',
    model: '',
    score: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.id || !form.name || !form.model || !form.score) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    console.log('📝 새 평가 제출:', form);
    alert('✅ 평가가 제출되었습니다! (콘솔 확인)');
    navigate('/evaluation');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>➕ 새 평가 추가</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          ID *
          <input
            className={styles.input}
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          이름 *
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          모델 *
          <input
            className={styles.input}
            name="model"
            value={form.model}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          점수 *
          <input
            className={styles.input}
            name="score"
            type="number"
            value={form.score}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          설명
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          제출하기
        </button>
      </form>
    </div>
  );
}
