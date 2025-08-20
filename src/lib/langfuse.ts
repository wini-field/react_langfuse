import { Langfuse } from "langfuse";

const publicKey = import.meta.env.VITE_LANGFUSE_PUBLIC_KEY;
const secretKey = import.meta.env.VITE_LANGFUSE_SECRET_KEY;
const baseUrl = import.meta.env.VITE_LANGFUSE_BASE_URL;

if (!publicKey || !secretKey || !baseUrl) {
  console.error("Langfuse environment variables are not set. Please check your .env file.");
}

// Langfuse SDK 인스턴스 (기존과 동일)
export const langfuse = new Langfuse({
  publicKey,
  secretKey,
  baseUrl,
});

// API 직접 호출을위한 헬퍼 객체
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Basic ${ btoa(`${ publicKey }:${ secretKey }`) }`);

// GET, POST, DELETE 등 API 호출을 위한 함수 모음
export const langfuseApi = {
    get: async <T>(endpoint: string):Promise<T> => {
        const response = await fetch(`${ baseUrl }${ endpoint }`, {
            method: 'GET',
            headers,
        });
        if (!response.ok) throw new Error(`API Error: ${ response.status } ${ response.statusText }`);
        return response.json() as Promise<T>;
    },
    post: async <T>(endpoint: string, body: unknown):Promise<T> => {
        const response = await fetch(`${ baseUrl }${ endpoint }`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`API Error: ${ response.status } ${ response.statusText }`);
        return response.json() as Promise<T>;
    },
    delete: async (endpoint: string, body: { publicKey: string }): Promise<Response> => {
        const response = await fetch(`${ baseUrl }${ endpoint }`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`API Error: ${ response.status } ${ response.statusText }`);
        return response;
    },
};