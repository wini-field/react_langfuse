// src/pages/Evaluation/EvaluationList.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyEvaluations as initialEvaluations } from '../../data/dummyEvaluations';
import styles from './EvaluationList.module.css';

export default function EvaluationList() {
  const [evaluations, setEvaluations] = useState(initialEvaluations);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('정말로 이 평가를 삭제하시겠습니까?');
    if (confirmDelete) {
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📋 Evaluation List</h1>
      <Link to="/evaluation/new" className={styles.addButton}>
        ➕ 새 평가 추가
      </Link>

      {evaluations.length === 0 ? (
        <p className={styles.emptyMessage}>아직 등록된 평가가 없습니다.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Model</th>
              <th>Score</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evalItem) => (
              <tr key={evalItem.id}>
                <td>{evalItem.id}</td>
                <td>{evalItem.name}</td>
                <td>{evalItem.model}</td>
                <td>{evalItem.score}</td>
                <td>{evalItem.updated}</td>
                <td>
                  <Link to={`/evaluation/${evalItem.id}`} className={styles.link}>
                    🔍 보기
                  </Link>{' '}
                  |{' '}
                  <Link to={`/evaluation/${evalItem.id}/edit`} className={styles.link}>
                    ✏️ 수정
                  </Link>{' '}
                  |{' '}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(evalItem.id)}
                  >
                    🗑️ 삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
