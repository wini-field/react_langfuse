import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { dummyEvaluations } from '../../data/dummyEvaluations';
import styles from './EvaluationEdit.module.css';

export default function EvaluationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const existing = dummyEvaluations.find((e) => e.id === id);

  const [form, setForm] = useState(
    existing || {
      id: '',
      name: '',
      model: '',
      score: '',
      description: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 수정된 평가:', form);
    alert('수정 완료! 콘솔에서 확인하세요.');
    navigate('/evaluation');
  };

  if (!existing) {
    return <div className={styles.container}>⚠️ 평가 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>✏️ 평가 수정</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          ID:
          <input name="id" value={form.id} onChange={handleChange} readOnly />
        </label>
        <label>
          이름:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          모델:
          <input name="model" value={form.model} onChange={handleChange} />
        </label>
        <label>
          점수:
          <input name="score" type="number" value={form.score} onChange={handleChange} />
        </label>
        <label>
          설명:
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <button type="submit" className={styles.saveButton}>저장하기</button>
      </form>
    </div>
  );
}
