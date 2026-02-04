import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import navigationReducer from "./slices/navigation/navigation.slice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});