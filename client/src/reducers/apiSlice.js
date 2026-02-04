import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL_DEV : 'http://localhost:8000',
  credentials: "include",
});


// CHECK OUT FOR REVIEW: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
 
  if (result.error && result.error.originalStatus === 401) {
    // try to get a new token
    const refreshResult = await baseQuery({url: 'auth/refreshToken', method: "POST"}, api, extraOptions); // backend change the cookies for access token if the refresh token is still valid
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log(refreshResult.error);
    }
  };

  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Project', 'Board'],
  endpoints: () => ({}),
});
