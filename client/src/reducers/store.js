import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import navigationReducer from "./slices/navigation/navigation.slice";
import issueReducer from "./slices/issue/issue.slice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    navigation: navigationReducer,
    issue: issueReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});