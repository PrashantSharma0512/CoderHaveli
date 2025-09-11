import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name: 'video',
    initialState: {
        videoUrl: null,
    },
    reducers: {
        addVideo: (state, action) => {
            state.videoUrl = action.payload;
        },
        removeVideo: (state) => {
            state.videoUrl = null;
        }
    }
});

export const { addVideo, removeVideo } = videoSlice.actions;
export default videoSlice.reducer;
