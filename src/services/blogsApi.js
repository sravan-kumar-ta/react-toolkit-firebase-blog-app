import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      queryFn() {
        return { data: "ok" };
      },
    }),
  }),
});

export const { useFetchBlogsQuery } = blogApi;
