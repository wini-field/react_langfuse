import './App.css';
import { BrowserRouter, createBrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom';
import React from 'react';
import Main from "Pages/Main";

function App() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
