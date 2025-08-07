import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import React from 'react';
import HomePage from './Pages/HomePage';
import MainLayout from './components/layout/MainLayout';

import EvaluationPage from './features/evaluation/EvaluationPage';
import SettingsPage from './features/settings/SettingsPage';
import General from './features/settings/components/General';
import ApiKeys from './features/settings/components/ApiKeys';
import LLMConnections from './features/settings/components/ApiKeys';
import Models from './features/settings/components/Models';
import Scores from './features/settings/components/ApiKeys';
import Members from './features/settings/components/Members';
import Integrations from './features/settings/components/ApiKeys';
import Exports from './features/settings/components/ApiKeys';
import AuditLogs from './features/settings/components/ApiKeys';

function App() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BrowserRouter>
                <Routes>
                    <Route element = { <MainLayout /> }>
                        <Route path="/" element = {<HomePage />} />
                        <Route path = "/evaluation" element = {<EvaluationPage />} />
                        <Route path = "/settings" element = {<SettingsPage />}>
                            <Route index element = {<General />} />
                            <Route path = "/settings/api-keys" element = {<ApiKeys />} />
                            <Route path = "/settings/llm-connections" element = {<LLMConnections />} />
                            <Route path = "/settings/models" element = {<Models />} />
                            <Route path = "/settings/scores" element = {<Scores />} />
                            <Route path = "/settings/members" element = {<Members />} />
                            <Route path = "/settings/integrations" element = {<Integrations />} />
                            <Route path = "/settings/exports" element = {<Exports />} />
                            <Route path = "/settings/audit-logs" element = {<AuditLogs />} />
                            <Route path = "/" element = {<ApiKeys />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
