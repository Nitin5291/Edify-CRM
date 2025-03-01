import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    LeadStatus: false,
    OpportunityStatus: false,
    Greeting: false
};

export const navbarSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        CreateLeadeStatus: (state, action) => {
            state.LeadStatus = action.payload;
        },
        CreateOpportunityStatus: (state, action) => {
            state.OpportunityStatus = action.payload;
        },
        GreetingStatus: (state, action) => {
            state.Greeting = action.payload;
        },
    },
});

export const { CreateLeadeStatus, CreateOpportunityStatus, GreetingStatus } = navbarSlice.actions

export default navbarSlice.reducer;