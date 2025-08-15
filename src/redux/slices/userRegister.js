import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FullName: "",
  Email: "",
  Password: "",
  Errors: {
    FullName: "",
    Email: "",
    Password: "",
  },
};

const formSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    setFullName: (state, action) => {
      state.FullName = action.payload;
    },
    setEmail: (state, action) => {
      state.Email = action.payload;
    },
    setPassword: (state, action) => {
      state.Password = action.payload;
    },
    setError: (state, action) => {
      const { field, message } = action.payload;
      state.Errors[field] = message;
    },
    resetErrors: (state) => {
      state.Errors = {
        FullName: '',
        Email: '',
        Password: '',
      };
    },
  },
});

export const {
  setFullName,
  setEmail,
  setPassword,
  setError,
  resetErrors,
} = formSlice.actions;

export default formSlice.reducer;
