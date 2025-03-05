import { del, get, post, put } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface MainTaskState {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  mainTaskData: any;
  singleMainTaskData: any;
  isdelLoader: boolean;
}

const initialState: MainTaskState = {
  loading: "idle",
  error: null,
  isLoader: false,
  mainTaskData: [],
  singleMainTaskData: null,
  isdelLoader: false,
};

export const createMainTask = createAsyncThunk(
  "createMainTask",
  async (body: any) => {
    try {
      const response = await axios.post("/api/mainTask", body);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getMainTask = createAsyncThunk("getMainTask", async () => {
  try {
    const response = await axios.get(`/api/mainTask`);
    return response?.data?.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const getFilterMainTask = createAsyncThunk(
  "getFilterMainTask",
  async ({ data }: { data?: string }) => {
    try {
      const response = await axios.get(`/api/mainTask?${data}`);
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const updateMainTask = createAsyncThunk(
  "updateMainTask",
  async (data: any) => {
    try {
      const response = await axios.put(`/api/mainTask?id=${data?.id}`, data?.data);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteMainTaskData = createAsyncThunk(
  "/deleteMainTaskData",
  async (ids: any) => {
    try {
      const response = await axios.delete(`/api/mainTask?ids=${ids}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getSingleMainTask = createAsyncThunk(
  "getSingleMainTask",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/mainTask?id=${id}`);
      return response?.data?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

const mainTaskSlice = createSlice({
  name: "mainTask",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMainTask.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createMainTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createMainTask.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getMainTask.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getMainTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.mainTaskData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getMainTask.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getFilterMainTask.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getFilterMainTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.mainTaskData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getFilterMainTask.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getSingleMainTask.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleMainTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleMainTaskData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleMainTask.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateMainTask.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateMainTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateMainTask.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteMainTaskData.pending, (state) => {
        state.isdelLoader = true;
        state.loading = "pending";
      })
      .addCase(deleteMainTaskData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteMainTaskData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default mainTaskSlice.reducer;
