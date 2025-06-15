import { createSlice } from '@reduxjs/toolkit';

const coderHaveliSlice = createSlice({
  name: 'coderHaveli',
  initialState: [],
  reducers: {
    addCode: (state, action) => {
      state.push(action.payload);
    },
    removeCode: (state, action) => {
      return state.filter((code) => code.quesId !== action.payload.quesId);
    },
    updateCode: (state, action) => {
      const index = state.findIndex((code) => code.quesId === action.payload.quesId);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    updateSubmissionStatus: (state, action) => {
      const index = state.findIndex((code) => code.quesId === action.payload.quesId);
      if (index !== -1) {
        state[index].status = action.payload.status;
      }
    },
  },
});

export const { addCode, removeCode, updateCode, updateSubmissionStatus } = coderHaveliSlice.actions;
export default coderHaveliSlice.reducer;
