import { del, get, postFormData, putFormData } from "@/base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CoursesState {
  CoursesData: any;
  SingleCourses: any;
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
}

const initialState: CoursesState = {
  CoursesData: null,
  loading: "idle",
  error: null,
  isLoader: false,
  SingleCourses: null,
};

export const getCourses = createAsyncThunk("/getCourses", async () => {
  try {
    const response = await get("courses");
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});
export const getCoursesID = createAsyncThunk(
  "/getCoursesID",
  async (id: number) => {
    try {
      const response = await get(`courses/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const addCoursesData = createAsyncThunk(
  "/addCoursesData",
  async (body: any) => {
    try {
      const response = await postFormData("courses", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);
export const updateCoursesData = createAsyncThunk(
  "/updateCoursesData",
  async (data: any) => {
    try {
      const response = await putFormData(`courses/${data?.id}`, data?.body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteCoursesData = createAsyncThunk(
  "/deleteCoursesData",
  async (data: any) => {
    try {
      const response = await del(
        `courses${!data?.data ? `/${data?.ids}` : `?ids=${data?.ids}`}`
      );
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.isLoader = true;
        state.loading = "pending";
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoader = false;
        state.loading = "fulfilled";
        state.CoursesData = action.payload;
        state.error = null;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getCoursesID.pending, (state) => {
        state.isLoader = true;
        state.loading = "pending";
      })
      .addCase(getCoursesID.fulfilled, (state, action) => {
        state.isLoader = false;
        state.loading = "fulfilled";
        state.SingleCourses = action.payload;
        state.error = null;
      })
      .addCase(getCoursesID.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addCoursesData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addCoursesData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.CoursesData = action.payload;
        state.error = null;
      })
      .addCase(addCoursesData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateCoursesData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateCoursesData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.CoursesData = action.payload;
        state.error = null;
      })
      .addCase(updateCoursesData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteCoursesData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCoursesData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteCoursesData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default coursesSlice.reducer;
