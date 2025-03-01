import { del, get, post, put } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface BatchState {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  isdelLoader: boolean;
  batchData: any;
  batchTopic: any;
  SingleBatch: any;
  batchLearner: any;
}

const initialState: BatchState = {
  loading: "idle",
  error: null,
  isLoader: false,
  isdelLoader: false,
  batchData: [],
  batchTopic: [],
  SingleBatch: null,
  batchLearner: null,
};

export const createBatch = createAsyncThunk(
  "createbatch",
  async (body: any) => {
    try {
      const response = await post("batches", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);
export const createBatchTopic = createAsyncThunk(
  "createBatchTopic",
  async (body: any) => {
    console.log("🚀 ~ body:", body);
    try {
      const response = await post(
        `batch-topics/upsert${body?.id ? `?batchId=${body?.id}` : ""}`,
        body?.data
      );
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getBatch = createAsyncThunk("getbatch", async () => {
  try {
    const response = await get(`batches`);
    return response;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const getBatchByLearner = createAsyncThunk(
  "getBatchByLearner",
  async (id: number) => {
    try {
      const response = await get(`batches/learner/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getFilterBatch = createAsyncThunk(
  "getFilterbatch",
  async ({ data }: { data?: string }) => {
    try {
      const response = await get(`batches?${data}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const updateBatch = createAsyncThunk(
  "updateBatch",
  async (data: any) => {
    try {
      const response = await put(`batches/${data?.id}`, data?.data);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteBatchData = createAsyncThunk(
  "/deleteBatchData",
  async (ids: any) => {
    try {
      const response = await del(`batches?ids=${ids}`);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getSingleBatch = createAsyncThunk(
  "getSingleBatch",
  async (id: number) => {
    try {
      const response = await get(`batches/${id}`);
      return response;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);
export const getBatchTopic = createAsyncThunk(
  "getBatchTopic",
  async (id: number) => {
    try {
      const response = await get(`batch-topics?batchId=${id}`);
      return response;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBatch.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteBatchData.pending, (state) => {
        state.isdelLoader = true;
        state.loading = "pending";
      })
      .addCase(deleteBatchData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteBatchData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(createBatchTopic.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createBatchTopic.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createBatchTopic.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getBatch.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.batchData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getBatch.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getFilterBatch.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getFilterBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.batchData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getFilterBatch.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getBatchTopic.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getBatchTopic.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.batchTopic = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getBatchTopic.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getSingleBatch.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.SingleBatch = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleBatch.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getBatchByLearner.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getBatchByLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.batchLearner = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getBatchByLearner.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateBatch.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default batchSlice.reducer;
