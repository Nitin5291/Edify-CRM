import { del, get, post, put } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CampaignState {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  campaignData: any;
  singleCampaignData: any;
  isdelLoader: boolean;
}

const initialState: CampaignState = {
  loading: "idle",
  error: null,
  isLoader: false,
  campaignData: [],
  singleCampaignData: null,
  isdelLoader: false,
};

export const createCampaign = createAsyncThunk(
  "createCampaign",
  async (body: any) => {
    try {
      const response = await axios.post("/api/campaigns", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getCampaign = createAsyncThunk("getCampaign", async () => {
  try {
    const response = await axios.get(`/api/campaigns`);
    return response?.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const getFilterCampaign = createAsyncThunk(
  "getFilterCampaign",
  async ({ data }: { data?: string }) => {
    try {
      const response = await axios.get(`/api/campaigns?${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  "updateCampaign",
  async (data: any) => {
    try {
      const response = await axios.put(`/api/campaigns?id=${data?.id}`, data?.data);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteCampaignData = createAsyncThunk(
  "/deleteCampaignData",
  async (ids: any) => {
    try {
      const response = await axios.delete(`/api/campaigns?ids=${ids}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getSingleCampaign = createAsyncThunk(
  "getSingleCampaign",
  async (id: number) => {
    try {
      const response = await axios.get(`/api/campaigns?id=${id}`);
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getCampaign.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getCampaign.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.campaignData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getCampaign.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getFilterCampaign.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getFilterCampaign.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.campaignData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getFilterCampaign.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getSingleCampaign.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleCampaign.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.singleCampaignData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleCampaign.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateCampaign.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteCampaignData.pending, (state) => {
        state.isdelLoader = true;
        state.loading = "pending";
      })
      .addCase(deleteCampaignData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteCampaignData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default campaignSlice.reducer;
