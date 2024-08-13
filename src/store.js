import { configureStore } from "@reduxjs/toolkit";
// import inputReducer from './slice'; // Adjust path if necessary
import inputReducer from "./Slice/redux";

const store = configureStore({
  reducer: {
    inputs: inputReducer,
  },
});

export default store;
// const editapi = "https://shaktidham-backend.vercel.app/seats/update/:id";
// const deleteapi = "https://shaktidham-backend.vercel.app/seats/delete/:id";
// const addapi = "https://shaktidham-backend.vercel.app/seats/create";
// const searchapi = "https://shaktidham-backend.vercel.app/seats/search";
// const readapi = "https://shaktidham-backend.vercel.app/seats/read";
