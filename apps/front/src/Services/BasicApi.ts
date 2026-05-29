// src/api/BasicApi.ts

const BASE_URL = 'http://localhost:4000';

interface ApiResponse<T> {
  data: T;
  status: number;
}

const getToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = () => {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

export const getAPI = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('GET API Error:', error);
    throw error;
  }
};

export const postAPI = async <T>(endpoint: string, payload: unknown): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('POST API Error:', error);
    throw error;
  }
};
