import { createSlice } from '@reduxjs/toolkit';

const coderHaveliSlice = createSlice({
  name: 'coderHaveli',
  initialState: [],
  reducers: {
    addCode: (state, action) => {
      state.push(action.payload);
    },
    removeCode: (state, action) => {
      return state.filter((code) => code.id !== action.payload);
    },
    updateCode: (state, action) => {
      const { id, code } = action.payload;
      const existingCode = state.find((item) => item.id === id);
      if (existingCode) {
        existingCode.code = code;
      }
    },
  },
});

export const { addCode, removeCode, updateCode } = coderHaveliSlice.actions;
export default coderHaveliSlice.reducer;
