// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import Home from './pages/Home/Home';

import Tracing from './pages/Tracing/Tracing';
import TraceDetail from './pages/Tracing/TraceDetail';
import SpanDetail from './pages/Tracing/SpanDetail';
import SessionDetail from './pages/Tracing/SessionDetail';

import Prompts from './pages/Prompts/Prompts';
import PromptDetail from './pages/Prompts/PromptsDetail';
import PromptNew from './pages/Prompts/PromptNew';
import PromptEdit from './pages/Prompts/PromptEdit';

import EvaluationList from './pages/Evaluation/EvaluationList';
import EvaluationDetail from './pages/Evaluation/EvaluationDetail';
import EvaluationNew from './pages/Evaluation/EvaluationNew';
import EvaluationEdit from './pages/Evaluation/EvaluationEdit';

import LLMDashboard from './pages/Dashboard/LLMDashboard';

import SettingsPage from './pages/Settings/SettingsPage';
import General from './pages/Settings/General';
import ApiKeys from './pages/Settings/ApiKeys';
import LLMConnections from "./pages/Settings/LLMConnections";
import Models from './pages/Settings/Models';
import Members from './pages/Settings/Members';

// ---- 임시 플래이스홀더들 (파일이 아직 없거나 빈 페이지일 때 대비) ----
const Placeholder =
  (title: string) =>
  () =>
    <div style={{ color: 'white', padding: 24 }}>{title}</div>;

//const LLMConnections = Placeholder('LLM Connections');
const Scores = Placeholder('Scores (Settings)');
const Integrations = Placeholder('Integrations');
const Exports = Placeholder('Exports');
const AuditLogs = Placeholder('Audit Logs');

const Sessions = Placeholder('Sessions');  // 사이드바 링크용 (/sessions)
const Users = Placeholder('Users');        // 사이드바 링크용 (/users)
const Playground = Placeholder('Playground');  // 사이드바 링크용 (/playground)
const Datasets = Placeholder('Datasets');      // 사이드바 링크용 (/datasets)
const LlmAsAJudge = Placeholder('LLM as a Judge'); // 사이드바 링크용 (/llm-as-a-judge)
const HumanAnnotation = Placeholder('Human Annotation'); // (/human-annotation)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 홈 */}
        <Route index element={<Home />} />

        {/* 사이드바 링크 보완용 라우트들 */}
        <Route path="sessions" element={<Sessions />} />
        <Route path="users" element={<Users />} />
        <Route path="playground" element={<Playground />} />
        <Route path="datasets" element={<Datasets />} />
        <Route path="llm-as-a-judge" element={<LlmAsAJudge />} />
        <Route path="human-annotation" element={<HumanAnnotation />} />

        {/* Tracing */}
        <Route path="tracing" element={<Tracing />} />
        <Route path="tracing/:id" element={<TraceDetail />} />
        <Route path="tracing/:traceId/spans/:spanId" element={<SpanDetail />} />
        <Route path="tracing/:traceId/sessions/:sessionId" element={<SessionDetail />} />

        {/* Prompts */}
        <Route path="prompts" element={<Prompts />} />
        <Route path="prompts/new" element={<PromptNew />} />
        <Route path="prompts/:id" element={<PromptDetail />} />
        <Route path="prompts/:id/edit" element={<PromptEdit />} />

        {/* Evaluation */}
        <Route path="evaluation" element={<EvaluationList />} />
        <Route path="evaluation/new" element={<EvaluationNew />} />
        <Route path="evaluation/:id" element={<EvaluationDetail />} />
        <Route path="evaluation/:id/edit" element={<EvaluationEdit />} />

        {/* Dashboards (복수형으로 맞춤: /dashboards/llm) */}
        <Route path="dashboards/llm" element={<LLMDashboard />} />

        {/* 기타 테스트 */}
        <Route path="cost" element={<div style={{ color: 'white', padding: 24 }}>💰 Cost Page</div>} />
        <Route path="scores" element={<div style={{ color: 'white', padding: 24 }}>🏆 Scores Page</div>} />

        {/* Settings (상대 경로로 선언) */}
        <Route path="settings" element={<SettingsPage />}>
          <Route index element={<General />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="llm-connections" element={<LLMConnections />} />
          <Route path="models" element={<Models />} />
          <Route path="scores" element={<Scores />} />
          <Route path="members" element={<Members />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="exports" element={<Exports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}
