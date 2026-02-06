import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { type, title, message, duration = 5000 } = action.payload;
      state.toasts.push({
        id: ++toastId,
        type,
        title,
        message,
        duration,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

// Selectors
export const selectToasts = (state) => state.toast.toasts;

// Helper action creators for common toast types
export const showSuccessToast = (title, message) => 
  addToast({ type: 'success', title, message });

export const showErrorToast = (title, message) => 
  addToast({ type: 'error', title, message });

export const showWarningToast = (title, message) => 
  addToast({ type: 'warning', title, message });

export default toastSlice.reducer;
