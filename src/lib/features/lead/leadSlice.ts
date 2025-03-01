// export default leadSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeadeData } from "@/app/component/Type";
import { del, get, post, postFormData, put } from "@/base";
import axios from "axios";

interface ContactState {
  LeadData: any;
  NoteData: any;
  SingleLead: any;
  loading: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
  isLoader: boolean;
  isdelLoader: boolean;
  meeting: any;
  email: any;
  call: any;
  message: any;
  kanbanAllData: any;
}

const initialState: ContactState = {
  LeadData: null,
  NoteData: null,
  SingleLead: null,
  loading: "idle",
  error: null,
  isLoader: false,
  isdelLoader: false,
  meeting: null,
  email: null,
  call: null,
  message: null,
  kanbanAllData: [],
};

export const getLeadData = createAsyncThunk(
  "getLeadData",
  async (leadStage?: string) => {
    try {
      const response = await axios.get<LeadeData[]>(
        `/api/leads?leadStage=${leadStage}`
      );
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);
export const getSingleLead = createAsyncThunk(
  "getSingleLead",
  async (id: number) => {
    try {
      const response = await axios.get<LeadeData[]>(`/api/leads?id=${id}`);
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

export const getLeadFilter = createAsyncThunk(
  "getLeadFilter",
  async ({ leadStage, data }: { leadStage?: string; data?: string }) => {
    try {
      const response = await axios.get<LeadeData[]>(
        `/api/leads?leadStage=${leadStage}&${data}`
      );
      return response?.data;
    } catch (error: any) {
      // If an error occurs, return the error response data
      throw new Error(error.response.data);
    }
  }
);

export const addLeadData = createAsyncThunk(
  "/addLeadData",
  async (body: any) => {
    try {
      const response = await axios.post("api/leads", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const addAndUpdateKanbanData = createAsyncThunk(
  "/addAndUpdateKanbanData",
  async (body: any) => {
    try {
      const response = await post("leads/kanban", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const updateLeadData = createAsyncThunk(
  "/updateLeadData",
  async (data: any) => {
    try {
      const response = await axios.put(`/api/leads?id=${data?.id}`, data?.data);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteLeadsData = createAsyncThunk(
  "/deleteLeadsData",
  async (ids: any) => {
    try {
      const response = await axios.delete(`/api/leads?ids=${ids}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const addRelatedContactData = createAsyncThunk(
  "/addRelatedContactData",
  async (body: any) => {
    try {
      const response = await post("related-contacts", body);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const addTask = createAsyncThunk("/addTask", async (body: any) => {
  try {
    const response = await axios.post("/api/tasks", body);
    return response;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const addEmail = createAsyncThunk("/addEmail", async (body: any) => {
  try {
    const response = await axios.post("api/email", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const addEmailTemplate = createAsyncThunk(
  "/addEmailTemplate",
  async (body: any) => {
    try {
      const response = await post("email-templates", body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const addMeeting = createAsyncThunk("/addMeeting", async (body: any) => {
  try {
    const response = await axios.post("/api/meeting", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const addCall = createAsyncThunk("/addCall", async (body: any) => {
  try {
    const response = await postFormData("calls", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});
export const addNote = createAsyncThunk("/addNote", async (body: any) => {
  try {
    const response = await axios.post("/api/notes", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const getNote = createAsyncThunk("getNote", async (data?: string) => {
  try {
    const response = await axios.get(`/api/notes${data ? "?" + data : ""}`);
    return response?.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});

export const updateNote = createAsyncThunk("/updateNote", async (data: any) => {
  try {
    const response = await axios.put(`/api/notes?id=${data?.id}`, data?.data);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const deleteNode = createAsyncThunk("/deleteNode", async (ids: any) => {
  try {
    const response = await axios.delete(`/api/notes?id=${ids}`);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const addMessage = createAsyncThunk("/addMessage", async (body: any) => {
  try {
    const response = await axios.post("/api/message", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});
export const addMessageTemplate = createAsyncThunk(
  "/addMessageTemplate",
  async (data: any) => {
    try {
      const response = await axios.post(`api/messageTemplate`, data?.body);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const deleteRelatedContactsData = createAsyncThunk(
  "/deleteRelatedContactsData",
  async (ids: any) => {
    try {
      const response = await del(`related-contacts?ids=${ids}`);
      return response;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
);

export const getMeetingData = createAsyncThunk(
  "getMeetingData",
  async (id?: number) => {
    try {
      const response = await get(`meetings/lead/${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);
export const getMeeting = createAsyncThunk(
  "getMeeting",
  async (data?: string) => {
    try {
      const response = await axios.get(`/api/meeting?${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getEmail = createAsyncThunk("getEmail", async (id?: number) => {
  try {
    const response = await get(`emails/lead/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
});
export const getEmails = createAsyncThunk(
  "getEmails",
  async (data?: string) => {
    try {
      const response = await axios.get(`/api/email?${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getLogCall = createAsyncThunk(
  "getLogCall",
  async (phone?: number) => {
    try {
      const response = await get(`calls?phoneNo=${phone}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getMessage = createAsyncThunk(
  "getMessage",
  async ({ type, id }: { type?: string; id?: number }) => {
    try {
      const response = await get(`messages?type=${type}&leadId=${id}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const getMessages = createAsyncThunk(
  "getMessages",
  async ({ type, data }: { type?: string; data?: string }) => {
    try {
      const response = await axios.get(`api/message?type=${type}&${data}`);
      return response?.data;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

export const aksAI = createAsyncThunk("/aksAI", async (body: any) => {
  try {
    const response = await axios.post("/api/ask-ai", body);
    return response;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response.data));
  }
});

export const callsConnect = createAsyncThunk(
  "/callsConnect",
  async (body: any) => {
    try {
      const response = await post("calls/connect", body);
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);
export const getKanban = createAsyncThunk(
  "getKanbanData",
  async (name?: string) => {
    try {
      const response = await get(
        `leads/kanban/all${name ? `?name=${name}` : ""}`
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response.data);
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNote.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteNode.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteNode.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteNode.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getNote.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getNote.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.NoteData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getNote.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getLeadData.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getLeadData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.LeadData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getLeadData.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getLeadFilter.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getLeadFilter.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.LeadData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getLeadFilter.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getSingleLead.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getSingleLead.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.SingleLead = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getSingleLead.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addLeadData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addLeadData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addLeadData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addAndUpdateKanbanData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addAndUpdateKanbanData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addAndUpdateKanbanData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(updateLeadData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateLeadData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateLeadData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addRelatedContactData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addRelatedContactData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addRelatedContactData.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteLeadsData.pending, (state) => {
        state.loading = "pending";
        state.isdelLoader = true;
      })
      .addCase(deleteLeadsData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteLeadsData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(deleteRelatedContactsData.pending, (state) => {
        state.loading = "pending";
        state.isdelLoader = true;
      })
      .addCase(deleteRelatedContactsData.fulfilled, (state, action) => {
        state.isdelLoader = false;
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteRelatedContactsData.rejected, (state, action) => {
        state.isdelLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addEmail.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addEmail.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addEmail.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addEmailTemplate.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addEmailTemplate.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addEmailTemplate.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addMeeting.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addMeeting.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addCall.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addCall.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addCall.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addMessage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(addMessageTemplate.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addMessageTemplate.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(addMessageTemplate.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getMeetingData.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getMeetingData.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.meeting = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getMeetingData.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getMeeting.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getMeeting.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.meeting = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getMeeting.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getEmail.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getEmail.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.email = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getEmail.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getEmails.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getEmails.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.email = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getEmails.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getLogCall.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getLogCall.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.call = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getLogCall.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getMessage.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.message = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(aksAI.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(aksAI.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(aksAI.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(callsConnect.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(callsConnect.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(callsConnect.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload as string;
      })
      .addCase(getKanban.pending, (state) => {
        state.loading = "pending";
        state.isLoader = true;
      })
      .addCase(getKanban.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.kanbanAllData = action.payload;
        state.error = null;
        state.isLoader = false;
      })
      .addCase(getKanban.rejected, (state, action) => {
        state.isLoader = false;
        state.loading = "rejected";
        state.error = action.payload as string;
      });
  },
});

export default leadSlice.reducer;
