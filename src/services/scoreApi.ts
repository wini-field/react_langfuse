import { ScoreFormData } from '../pages/Settings/form/NewScoreForm'
import { baseUrl } from '../lib/langfuse'

export interface ApiCategory {
    value: number;
    label: string;
}

export interface ApiScoreConfig {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    dataType: 'NUMERIC' | 'BOOLEAN' | 'CATEGORICAL';
    isArchived: boolean;
    minValue: number | null;
    maxValue: number | null;
    categories: ApiCategory[] | null;
    description: string | null;
}

export interface ApiResponse {
    data: ApiScoreConfig[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export const fetchScoreConfigsAPI = async (page: number, limit: number, base64Credentials: string): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}/api/public/score-configs?page=${page}&limit=${limit}`, {
        headers: {
            'Authorization': `Basic ${base64Credentials}`
        }
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: API 키가 올바른지 확인해주세요.');
        }
        throw new Error('Failed to fetch score configs');
    }
    return response.json();
};

export const createScoreConfigAPI = async (formData: ScoreFormData, base64Credentials: string): Promise<ApiScoreConfig> => {
    const body: any = {
        name: formData.name,
        dataType: formData.dataType,
        description: formData.description || "",
    };

    switch (formData.dataType) {
        case 'NUMERIC':
            body.minValue = formData.minValue ? parseFloat(formData.minValue) : null;
            body.maxValue = formData.maxValue ? parseFloat(formData.maxValue) : null;
            break;
        case 'CATEGORICAL':
            const validCategories = formData.categories?.filter(c => c.label.trim() !== '');
            if (!validCategories || validCategories.length === 0) {
                throw new Error('Please define at least one category with a label.');
            }
            body.categories = validCategories;
            break;
        // <<< START: BOOLEAN일 때 categories를 보내지 않도록 수정 >>>
        case 'BOOLEAN':
            // BOOLEAN 타입은 categories 필드가 필요 없음
            break;
        // <<< END: BOOLEAN일 때 categories를 보내지 않도록 수정 >>>
    }

    const response = await fetch(`${baseUrl}/api/public/score-configs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Credentials}`
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '서버가 JSON이 아닌 응답을 반환했습니다.' }));
        const errorMessage = errorData.message || `Failed to create score config with status: ${response.status}`;
        console.error('--- Server Error Response ---');
        console.error('Status:', response.status);
        console.error('Body:', errorData);
        console.error('---------------------------');
        throw new Error(errorMessage);
    }
    return response.json();
};

export const updateScoreConfigStatusAPI = async (id: string, isArchived: boolean, base64Credentials: string): Promise<Response> => {
    const response = await fetch(`${baseUrl}/api/public/score-configs/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Credentials}`
        },
        body: JSON.stringify({ isArchived: isArchived }),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: API 키가 올바른지 확인해주세요.');
        }
        throw new Error('Failed to update status');
    }
    return response;
};