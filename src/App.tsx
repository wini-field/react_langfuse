import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import React from 'react';
import Main from "Pages/Main";
import MainLayout from './components/layout/MainLayout';

import SettingsPage from './features/settings/SettingsPage';
import EvaluationPage from './features/evaluation/EvaluationPage';

function App() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BrowserRouter>
                <Routes>
                    <Route element = { <MainLayout /> }>
                        <Route path="/" element={<Main />} />
                        <Route path = "/evaluation" element={<EvaluationPage />} />
                        <Route path = "/settings" element={<SettingsPage />}>
                        { /* 여기에 Settings 서브 페이지 정의
                            <Route path = "general" element = {<GeneralSettings />} />
                            <Route path = "api-keys" element = {<ApiKeysSettings />} />
                        */ }
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
