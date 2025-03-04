import { del, get, post, postFormData, put, putFormData } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface TrainerState {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  trainerData: any;
  singleTrainerData: any;
  batchesTrainerData: any;
  isdelLoader: boolean;
}

const initialState: TrainerState = {
  loading: "idle",
  error: null,
  isLoader: false,
  trainerData: [],
  singleTrainerData: null,
  batchesTrainerData: null,
  isdelLoader: false,
};

export const createTrainer = createAsyncThunk(
  "createtrainer",
  async (body: any) => {
    try {
      const response = await axios.post("/api/trainers", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getTrainer = createAsyncThunk("gettrainer", async () => {
  try {
    const response = await axios.get(`/api/trainers`);
    return response?.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const getFilterTrainer = createAsyncThunk(
  "getFiltertrainer",
  async ({ data }: { data?: string }) => {
    try {
      const response = await axios.get(`/api/trainers?${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getBatchesTrainer = createAsyncThunk(
  "getBatchesTrainer",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/trainers/batches?id=${id}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const updateTrainer = createAsyncThunk(
  "updateTrainer",
  async (data: any) => {
    try {
      const response = await axios.put(`/api/trainers?id=${data?.id}`, data?.data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteTrainersData = createAsyncThunk(
  "/deleteTrainersData",
  async (ids: any) => {
    try {
      const response = await axios.delete(`/api/trainers?ids=${ids}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getSingleTrainers = createAsyncThunk(
  "getSingleTrainers",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/trainers?id=${id}`);
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTrainer.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createTrainer.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getTrainer.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getTrainer.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.trainerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getTrainer.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getFilterTrainer.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getFilterTrainer.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.trainerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getFilterTrainer.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getSingleTrainers.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleTrainers.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleTrainerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleTrainers.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getBatchesTrainer.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getBatchesTrainer.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.batchesTrainerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getBatchesTrainer.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateTrainer.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateTrainer.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteTrainersData.pending, (state) => {
        state.isdelLoader = true;
        state.loading = "pending";
      })
      .addCase(deleteTrainersData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteTrainersData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default trainerSlice.reducer;
