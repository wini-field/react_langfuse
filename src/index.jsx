import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


const viewPort = document.getElementById('root');
const root = createRoot(viewPort);
root.render(
    <App/>
);