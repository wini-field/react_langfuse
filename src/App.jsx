import React, { useState, useEffect } from 'react'; // useState와 useEffect를 import 해야 합니다.
import {Routes, Route, Navigate} from 'react-router-dom';
import Layout from './layouts/Layout';

import Login from './pages/Login/LoginPage'

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
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    // 앱이 처음 실행될 때 딱 한 번만 실행됨
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();

                // 응답 데이터에 내용이 있으면(로그인 상태이면) session 상태에 저장
                if (data && Object.keys(data).length > 0) {
                    setSession(data);
                }
            } catch (error) {
                console.error("세션 확인 실패:", error);
            } finally {
                // 확인이 끝나면 로딩 상태를 false로 변경
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // 로딩 중일 때는 아무것도 안 보여주거나 로딩 스피너를 보여줌
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>

            {/* 로그인 */}
            <Route path="/login" element={!session ? <Login/> : <Navigate to="/" />}/>

            <Route path="/" element={session ? <Layout/> : <Navigate to="/login"/>}>
                {/* 홈 */}
                <Route index element={<Home/>}/>

                {/* Tracing */}
                <Route path="sessions" element={<Sessions/>}/>

                {/* Prompts */}
                <Route path="prompts" element={<Prompts/>}/>
                <Route path="prompts/:id" element={<PromptsDetail/>}/>
                <Route path="prompts/new" element={<PromptsNew/>}/>

                {/* Playground */}
                <Route path="playground" element={<Playground/>}/>

                {/* 실제 페이지로 교체 */}
                <Route path="llm-as-a-judge" element={<JudgePage/>}/>
                <Route path="llm-as-a-judge/new" element={<JudgePageNew/>}/>
                <Route path="datasets" element={<DatasetsList/>}/>

                {/* 구 /evaluation 경로 호환 */}
                <Route path="evaluation" element={<Navigate to="/scores" replace/>}/>
                <Route path="evaluation/new" element={<Navigate to="/scores/new" replace/>}/>
                <Route path="evaluation/:id" element={<Navigate to="/scores/:id" replace/>}/>
                <Route path="evaluation/:id/edit" element={<Navigate to="/scores/:id/edit" replace/>}/>

                {/* Dashboards */}
                <Route path="dashboards" element={<Dashboards/>}/>
                <Route path="dashboards/new" element={<DashboardNew/>}/>
                <Route path="dashboards/widgets/new" element={<WidgetNew/>}/>
                <Route path="dashboards/:dashboardId" element={<DashboardDetail/>}/>

                {/* Settings (상대 경로로 선언) */}
                <Route path="settings" element={<SettingsPage/>}>
                    <Route index element={<General/>}/>
                    <Route path="api-keys" element={<ApiKeys/>}/>
                    <Route path="llm-connections" element={<LLMConnections/>}/>
                    <Route path="models" element={<Models/>}/>
                    <Route path="scores" element={<Scores/>}/>
                    <Route path="members" element={<Members/>}/>
                </Route>
            </Route>
        </Routes>
    );
}
