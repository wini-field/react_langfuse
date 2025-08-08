// src/pages/Dashboard/LLMDashboard.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dummyDashboardData } from '../../data/dummyDashboardData';
import styles from './LLMDashboard.module.css';

export default function LLMDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 LLM 모델 성능 비교</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dummyDashboardData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#4aa3ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}