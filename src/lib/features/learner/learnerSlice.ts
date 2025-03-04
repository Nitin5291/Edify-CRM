import { del, get, post, put, putFormData } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface LearnerState {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  isdelLoader: boolean;
  learnerData: any;
  trainerData: any;
  SingleLearner: any;
  learnerBatch: any;
}

const initialState: LearnerState = {
  loading: "idle",
  error: null,
  isLoader: false,
  isdelLoader: false,
  learnerData: [],
  trainerData: [],
  SingleLearner: null,
  learnerBatch: null,
};

export const createLearner = createAsyncThunk(
  "createLearner",
  async (body: any) => {
    try {
      const response = await axios.post("/api/learners", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const createLearnerCourse = createAsyncThunk(
  "createLearnerCourse",
  async (body: any) => {
    try {
      const response = await post("learners/courses", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getTrainer = createAsyncThunk("getTrainer", async (id: any) => {
  try {
    const response = await axios.get(`/api/learners/trainers?id=${id}`);
    return response?.data;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

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

export const getLearner = createAsyncThunk("getLearner", async () => {
  try {
    const response = await axios.get(`/api/learners`);
    return response?.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const getFilterLearner = createAsyncThunk(
  "getFilterLearner",
  async ({ data }: { data?: string }) => {
    try {
      const response = await axios.get(`/api/learners?${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const updateLearner = createAsyncThunk(
  "updateLearner",
  async (data: any) => {
    try {
      const response = await axios.put(
        `/api/learners?id=${data?.id}`,
        data?.data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteLearnerData = createAsyncThunk(
  "/deleteLearnerData",
  async (ids: any) => {
    try {
      const response = await axios.delete(`/api/learners?ids=${ids}`);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getSingleLearner = createAsyncThunk(
  "getSingleLearner",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/learners?id=${id}`);
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);
export const getLearnerBatch = createAsyncThunk(
  "getLearnerBatch",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/learners/batches?id=${id}`);
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

const learnerSlice = createSlice({
  name: "learners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLearner.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createLearner.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(createLearnerCourse.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createLearnerCourse.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createLearnerCourse.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteLearnerData.pending, (state) => {
        state.isdelLoader = true;
        state.loading = "pending";
      })
      .addCase(deleteLearnerData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteLearnerData.rejected, (state, action) => {
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
      .addCase(getLearner.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.learnerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getLearner.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getFilterLearner.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getFilterLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.learnerData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getFilterLearner.rejected, (state, action) => {
        state.isLoader = false;
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
      .addCase(getSingleLearner.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.SingleLearner = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleLearner.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getLearnerBatch.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getLearnerBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.learnerBatch = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getLearnerBatch.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateLearner.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateLearner.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateLearner.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default learnerSlice.reducer;
