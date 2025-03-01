import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TaskRowData } from '@/app/component/Type';
import { del, get, post } from '@/base';
import axios from 'axios';
interface TaskState {
    taskData: any;
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
    isLoader: boolean,
}

const initialState: TaskState = {
    taskData: null,
    loading: 'idle',
    error: null,
    isLoader: false
};


export const getTaskData = createAsyncThunk(
    "getTaskData",
    async (data: any) => {
        try {
            const response = await axios.get(`/api/tasks?${data}`);
            return response?.data;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }
);

export const getTaskIdData = createAsyncThunk(
    "getTaskIdData",
    async (id: any) => {
        try {
            const response = await get(`tasks/lead/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(error.response.data);
        }
    }
);


export const addTaskData = createAsyncThunk(
    "/addTaskData", async (body: any) => {
        try {
            const response = await post('tasks', body);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

export const deleteTaskData = createAsyncThunk(
    "/deleteTaskData", async (ids: any) => {
        try {
            const response = await del(`tasks?ids=${ids}`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);
export const deleteSingleTaskData = createAsyncThunk(
    "/deleteSingleTaskData", async (id: any) => {
        try {
            const response = await del(`tasks/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTaskData.pending, (state) => {
                state.loading = 'pending';
                state.isLoader = true;
            })
            .addCase(getTaskData.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.taskData = action.payload;
                state.error = null;
                state.isLoader = false;
            })
            .addCase(getTaskData.rejected, (state, action) => {
                state.isLoader = false;
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getTaskIdData.pending, (state) => {
                state.loading = 'pending';
                state.isLoader = true;
            })
            .addCase(getTaskIdData.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.taskData = action.payload;
                state.error = null;
                state.isLoader = false;
            })
            .addCase(getTaskIdData.rejected, (state, action) => {
                state.isLoader = false;
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(deleteTaskData.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(deleteTaskData.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteTaskData.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(deleteSingleTaskData.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(deleteSingleTaskData.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.error = null;
            })
            .addCase(deleteSingleTaskData.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
    },
});

export default taskSlice.reducer;