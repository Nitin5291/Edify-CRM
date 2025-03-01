import { del, get, post } from '@/base';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface AuthState {
    homeData: any;
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
    isLoader: boolean,
}

const initialState: AuthState = {
    homeData: null,
    loading: 'idle',
    error: null,
    isLoader: false,
};


export const getHome = createAsyncThunk(
    "/getHome", async () => {
        try {
            const response = await get(`leads/statistics`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHome.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(getHome.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.homeData = action.payload;
                state.error = null;
            })
            .addCase(getHome.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })

    }
});


export default homeSlice.reducer;
