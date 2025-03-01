import { getUserToken } from "@/assets/utils/auth.util";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const axiosApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const axiosApipy = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PY_API_BASE_URL,
});

export const defaultHeaders: { contentType: string } = {
    contentType: "application/json",
};
export const axiosInstance = axiosApi;

export async function get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApi.get(url, { params: config.params, headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getpy<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApipy.get(url, { params: config.params, headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function patch<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T | undefined> {
    try {
        const response: AxiosResponse<T> = await axiosApi.patch(url, data, config);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return undefined; // Return undefined when there's an error
        } else {
            throw error; // Rethrow the error if it's not an AxiosError
        }
    }
}

export async function post(url: string, data: any, config = {}) {
    return new Promise((resolve, reject) => {
        axiosApi
            .post(url, data , { ...config, headers: authHeader() })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export async function postpy(url: string, data: any, config = {}) {
    return new Promise((resolve, reject) => {
        axiosApipy.post(url, { ...data }, { ...config})
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


export async function postFormData<T>(url: string, data: FormData, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApi.post(url, data, {
            ...config,
            headers: authHeader({
                ...defaultHeaders,
                contentType: "multipart/form-data",
            }),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function put<T>(url: string, data: any, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApi.put(url, data, { ...config, headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function putFormData<T>(url: string, data: FormData, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApi.put(url, data, {
            ...config,
            headers: authHeader({
                ...defaultHeaders,
                contentType: "multipart/form-data",
            }),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function del<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axiosApi.delete(url, { ...config, headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const authHeader = (header: { contentType?: string } = defaultHeaders): any => {
    let headers: { [key: string]: string } = {
        "Content-Security-Policy": "default-src 'self',frame-src 'self'",
        "ngrok-skip-browser-warning": "true",
    };
    if (header.contentType) {
        headers["Content-Type"] = header.contentType;
    }
    const token = getUserToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};


export const thunkHandler = async (asyncFn: any, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
        const response = await asyncFn;
        return response.data;
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            // If the error contains a message in the response data
            return thunkAPI.rejectWithValue(err.response.data.message);
        } else if (err.message) {
            // If the error has a message property
            return thunkAPI.rejectWithValue(err.message);
        } else {
            // If no message is found, return a generic error
            return thunkAPI.rejectWithValue("An error occurred");
        }
    }
};


// Type guard to check if the error is an AxiosError
function isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError !== undefined;
}


export const generateCompletion = async (text: string) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant.",
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${process.env.NEXT_PUBLIC_API_OPENAI_KEY}`,
                },
            }
        );
        return response
    } catch (error) {
        console.error("Error:", error);
        return error
    }
};