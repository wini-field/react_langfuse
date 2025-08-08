import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import LLMConnections from './pages/Settings/ApiKeys';
import Models from './pages/Settings/Models';
import Scores from './pages/Settings/ApiKeys';
import Members from './pages/Settings/Members';
import Integrations from './pages/Settings/ApiKeys';
import Exports from './pages/Settings/ApiKeys';
import AuditLogs from './pages/Settings/ApiKeys';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 홈 */}
          <Route index element={<Home />} />

          {/* Tracing */}
          <Route path="tracing" element={<Tracing />} />
          <Route path="tracing/:id" element={<TraceDetail />} />
          <Route path="tracing/:traceId/spans/:spanId" element={<SpanDetail />} />
          <Route path="tracing/:traceId/sessions/:sessionId" element={<SessionDetail />} />

          {/* Prompts */}
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/:id" element={<PromptDetail />} />
          <Route path="prompts/new" element={<PromptNew />} />
          <Route path="prompts/:id/edit" element={<PromptEdit />} />

          {/* evaluation */}
          <Route path="evaluation" element={<EvaluationList />} />
          <Route path="evaluation/new" element={<EvaluationNew />} />
          <Route path="evaluation/:id" element={<EvaluationDetail />} />
          <Route path="evaluation/:id/edit" element={<EvaluationEdit />} />

          {/* dashboard */}
          <Route path="dashboard/llm" element={<LLMDashboard />} />

          {/* 기타 테스트용 */}
          <Route path="cost" element={<div>💰 Cost Page</div>} />
          <Route path="scores" element={<div>🏆 Scores Page</div>} />

          {/* Settings */}
          <Route path = "/settings" element = {<SettingsPage />}>
            <Route index element = {<General />} />
            <Route path = "api-keys" element = {<ApiKeys />} />
            <Route path = "llm-connections" element = {<LLMConnections />} />
            <Route path = "models" element = {<Models />} />
            <Route path = "scores" element = {<Scores />} />
            <Route path = "members" element = {<Members />} />
            <Route path = "integrations" element = {<Integrations />} />
            <Route path = "exports" element = {<Exports />} />
            <Route path = "audit-logs" element = {<AuditLogs />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
