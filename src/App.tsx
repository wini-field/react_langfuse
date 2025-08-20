// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';

import Home from './pages/Home/Home';

import Sessions from './pages/Tracing/Sessions';

import Prompts from './pages/Prompts/Prompts';
import PromptsDetail from './pages/Prompts/PromptsDetail';
import PromptsNew from './pages/Prompts/PromptsNew';

import Playground from './pages/Playground/Playground';

import JudgePage from './pages/Evaluation/Judge/JudgePage';
import JudgePageNew from './pages/Evaluation/Judge/JudgePageNew';
import DatasetsList from './pages/Evaluation/DataSets/DatasetsPage';

import Dashboards from './pages/Dashboard/Dashboards';
import DashboardNew from './pages/Dashboard/DashboardNew';
import DashboardDetail from './pages/Dashboard/DashboardDetail';
import WidgetNew from './pages/Dashboard/WidgetNew';

import SettingsPage from './pages/Settings/SettingsPage';
import General from './pages/Settings/General';
import ApiKeys from './pages/Settings/ApiKeys';
import LLMConnections from "./pages/Settings/LLMConnections";
import Models from './pages/Settings/Models';
import Members from './pages/Settings/Members';
import Scores from './pages/Settings/Scores';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 홈 */}
        <Route index element={<Home />} />

        {/* Tracing */}
        <Route path="sessions" element={<Sessions />} />

        {/* Prompts */}
        <Route path="prompts" element={<Prompts />} />
        <Route path="prompts/:id" element={<PromptsDetail />} />
        <Route path="prompts/new" element={<PromptsNew />} />

        {/* Playground */}
        <Route path="playground" element={<Playground />} />

        {/* 실제 페이지로 교체 */}
        <Route path="llm-as-a-judge" element={<JudgePage />} />
        <Route path="llm-as-a-judge/new" element={<JudgePageNew />} />
        <Route path="datasets" element={<DatasetsList />} />

        {/* 구 /evaluation 경로 호환 */}
        <Route path="evaluation" element={<Navigate to="/scores" replace />} />
        <Route path="evaluation/new" element={<Navigate to="/scores/new" replace />} />
        <Route path="evaluation/:id" element={<Navigate to="/scores/:id" replace />} />
        <Route path="evaluation/:id/edit" element={<Navigate to="/scores/:id/edit" replace />} />

          {/* Dashboards */}
        <Route path="dashboards" element={<Dashboards />} />
        <Route path="dashboards/new" element={<DashboardNew />} /> {/* '/dashboards/new' 라우트 추가 */}
        <Route path="dashboards/widgets/new" element={<WidgetNew />} />
        <Route path="dashboards/:dashboardId" element={<DashboardDetail />} />

        {/* Settings (상대 경로로 선언) */}
        <Route path = "projects/:projectId/settings" element = { <SettingsPage /> }>
          <Route index element={<General />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="llm-connections" element={<LLMConnections />} />
          <Route path="models" element={<Models />} />
          <Route path="scores" element={<Scores />} />
          <Route path="members" element={<Members />} />
        </Route>
          
          <Route path = "settings/*" element = { <Navigate to = "/projects/your-default-project-id/settings" replace /> } />
      </Route>
    </Routes>
  );
}
