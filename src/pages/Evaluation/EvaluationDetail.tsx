import { useParams } from 'react-router-dom';
import { dummyEvaluations } from '../../data/dummyEvaluations';
import styles from './EvaluationDetail.module.css';

export default function EvaluationDetail() {
  const { id } = useParams();
  const evalItem = dummyEvaluations.find((e) => e.id === id);

  if (!evalItem) {
    return <div className={styles.container}>⚠️ 평가를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📄 {evalItem.name}</h1>
      <p><strong>모델:</strong> {evalItem.model}</p>
      <p><strong>점수:</strong> {evalItem.score}</p>
      <p><strong>업데이트:</strong> {evalItem.updated}</p>
      <p><strong>설명:</strong> {evalItem.description}</p>
    </div>
  );
}
