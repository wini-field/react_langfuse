import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import react from "@vitejs/plugin-react-swc";
import * as path from "node:path";
import viteTsconfigPaths from 'vite-tsconfig-paths'

const  BASE_PATH = process.env.LANGFUSE_BASE_PATH || ""; // 예: "/mybase" | 기본: ""

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                // 🆕 Set-Cookie의 Domain을 로컬호스트로 재작성 (다른 도메인/포트와 충돌 방지)
                cookieDomainRewrite: {"*": "localhost"}, // [ADDED]
                // 🆕 BASE_PATH 환경에서 Path가 '/mybase'로 내려와도 루트에서 쿠키 먹게끔
                cookiePathRewrite: {"*": "/"}, // [ADDED]
                // 🆕 Langfuse가 BASE_PATH를 쓸 때만 API 경로 리라이트
                rewrite: BASE_PATH
                    ? (path) => path.replace(/^\/api(\/.*)?$/, `${BASE_PATH}/api$1`) // [ADDED - 조건부]
                    : undefined,
                // 🆕 스트리밍/롱폴링 대비 타임아웃 여유
                timeout: 600000, // 10m  [ADDED]
                proxyTimeout: 600000, // 10m  [ADDED]
            },
        }
    },
    plugins: [react(), viteTsconfigPaths()],
    resolve: {
        alias: {
            Components: path.resolve(__dirname, './src/Components'),
            // ducks: path.resolve(__dirname, './src/ducks'),
            Library: path.resolve(__dirname, './src/Library'),
            Pages: path.resolve(__dirname, './src/Pages'),
            Communicator: path.resolve(__dirname, './src/Communicator'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    optimizeDeps: {
        // noDiscovery: true,
        // exclude: [...]
    }
})
