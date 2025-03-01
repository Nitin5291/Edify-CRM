import { getpy } from '@/base';
import { RootState } from '@/lib/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface AuthState {
    data: any;
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
    isLoader: boolean,
}

const initialState: AuthState = {
    data: null,
    loading: 'idle',
    error: null,
    isLoader: false,
};


export const getCalendar = createAsyncThunk(
    "/calendar", async () => {
        try {
            const response = await getpy(`calendar`);
            return response;
        } catch (error: any) {
            throw new Error(JSON.stringify(error.response.data));
        }
    }
);

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCalendar.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(getCalendar.fulfilled, (state, action) => {
                state.loading = 'fulfilled';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getCalendar.rejected, (state, action) => {
                state.loading = 'rejected';
                state.error = action.payload as string;
            })

    }
});

export const selectCalendar = (state: RootState) => state.calendar;


export default calendarSlice.reducer;
