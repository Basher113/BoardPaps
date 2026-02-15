import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
console.log(import.meta.env.VITE_SERVER_URL_DEV)
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL_PROD : import.meta.env.VITE_NGROK_SERVER_URL ? import.meta.env.VITE_NGROK_SERVER_URL : "http://localhost:8000/",
  credentials: "include",
})
export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['User', 'Project', 'ProjectMember', 'Board', 'Dashboard', 'Invitation', 'Settings'],
  endpoints: () => ({}),
});
