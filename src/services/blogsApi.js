import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      async queryFn() {
        try {
          const blogRef = collection(db, "blogs");
          const querySnapshot = await getDocs(blogRef);
          let blogs = [];
          querySnapshot?.forEach((doc) => {
            blogs.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return { data: blogs };
        } catch (err) {
          return { error: err };
        }
      },
    }),
    addBlog: builder.mutation({
      async queryFn(data) {
        try {
          await addDoc(collection(db, "blogs"), {
            ...data,
            timestamp: serverTimestamp(),
          });
          return { data: "ok" };
        } catch (err) {
          return { error: err };
        }
      },
    }),
    deleteBlog: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, "blogs", id));
          return { data: "ok" };
        } catch (err) {
          return { error: err };
        }
      },
    }),
  }),
});

export const { useFetchBlogsQuery, useAddBlogMutation, useDeleteBlogMutation } = blogApi;
