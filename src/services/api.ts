import { langfuse } from '../lib/langfuse'

export interface Project {
    id: string;
    name: string;
    createdAt: string;
}

interface ProjectsResponse {
    data: Project[];
}

export interface ApiKey {
    id: string;
    createdAt: string;
    note: string | null;
    publicKey: string;
    secretKey?: string;
    displaySecretKey: string;
}

interface ApiKeysListResponse {
    data: ApiKey[];
}

interface LangfuseApiMethods {
    projectsList(): Promise<ProjectsResponse>;
    apiKeysList(args: { projectId: string }): Promise<ApiKeysListResponse>;
    apiKeysCreate(args: { projectId: string; note: string | null }): Promise<ApiKey>;
    apiKeysDelete(args: { projectId: string; publicKey: string }): Promise<void>;
}

const api = langfuse.api as unknown as LangfuseApiMethods;

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.projectsList();
    return response.data;
};

export const getApiKeys = async (projectId: string): Promise<ApiKey[]> => {
    const response = await api.apiKeysList({ projectId });
    return response.data;
};

export const createApiKey = async (projectId: string, note: string | null = null): Promise<ApiKey> => {
    const response = await api.apiKeysCreate({ projectId, note });
    return response;
}

export const deleteApiKey = async (projectId: string, publicKey: string): Promise<void> => {
    await api.apiKeysDelete({ projectId, publicKey });
}