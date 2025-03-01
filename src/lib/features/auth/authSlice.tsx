import { del, get, post, put } from '@/base';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
    user: any;
    allUser: any;
    singleUser: any;
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
    isLoader: boolean,
    isdelLoader: boolean;
}

const initialState: AuthState = {
    user: null,
    allUser: null,
    singleUser: null,
    loading: 'idle',
    error: null,
    isLoader: false,
    isdelLoader: false,
};

interface LoginResponse {
    data: any; // Replace 'any' with the actual type of your response data
}

export const authLogin = createAsyncThunk(
    "/authLogin", async (body: any) => {
        try {
            const response = await post('users/login', body) as LoginResponse;
            return response.data;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

export const createUser = createAsyncThunk(
    "/createUser", async (body: any) => {
        try {
            const response = await post('users/register', body);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data: any) => {
    try {
      const response = await put(`users/${data?.id}`, data?.data);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getUser = createAsyncThunk(
    "/getUser", async (userId?: string) => {
        try {
            const response = await axios.get(`/api/user${userId ? `?userId=${userId}` : ''}`);
            return response?.data;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

export const roleWiseGetUser = createAsyncThunk(
    "/roleWiseGetUser", async (role: string) => {
        try {
            const response = await get(`users?role=${role}`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

export const deleteUser = createAsyncThunk(
    "/deleteUser", async (id: string) => {
        try {
            const response = await del(`users/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);
export const getSingleUser = createAsyncThunk(
    "/getSingleUser", async (id: string) => {
        try {
            const response = await axios.get(`/api/user?userId=${id}`);
            return response?.data;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(authLogin.pending, (state) => {
                state.loading = 'pending';
                state.isLoader = true;
            })
            .addCase(authLogin.fulfilled, (state, action) => {
                state.isLoader = false;
                state.loading = 'fulfilled';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(authLogin.rejected, (state, action) => {
                state.isLoader = false;
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getSingleUser.pending, (state) => {
                state.loading = 'pending';
                state.isLoader = true;
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.isLoader = false;
                state.loading = 'fulfilled';
                state.singleUser = action.payload;
                state.error = null;
            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.isLoader = false;
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.allUser = action.payload;
                state.error = null;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(roleWiseGetUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(roleWiseGetUser.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.allUser = action.payload;
                state.error = null;
            })
            .addCase(roleWiseGetUser.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = 'pending';
                state.isdelLoader = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.error = null;
                state.isdelLoader = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
                state.isdelLoader = false;
            });
    }
});


export default authSlice.reducer;
