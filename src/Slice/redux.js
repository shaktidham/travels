import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Tablemanuplation: {
    seatnumber: null,
    date: null,
    openpop: false,
    msgdata: [],
  },
};
const InputSlice = createSlice({
  name: "inputs",
  initialState,
  reducers: {
    setSeatNumber: (state, action) => {
      state.Tablemanuplation.seatnumber = action.payload;
    },
    setDate: (state, action) => {
      state.Tablemanuplation.date = action.payload;
    },
    setPopbox: (state, action) => {
      state.Tablemanuplation.date = action.payload;
    },
    setMsgdata: (state, action) => {
      state.Tablemanuplation.msgdata = action.payload;
    },
  },
});

// Export actions
export const { setSeatNumber, setDate, setPopbox, setMsgdata } =
  InputSlice.actions;

// Export reducer
export default InputSlice.reducer;
