import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    Email: "",
    Password: "",
    Errors: {
        Email: "",
        Password: "",
    }
}

const loginFormSlice = createSlice({
    name: "loginForm",
    initialState,
    reducers: {
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
                
                Email: '',
                Password: ""
            };
        }
    }
})

export const { setFullName, setEmail, setPassword, setError ,resetErrors} = loginFormSlice.actions;
export default loginFormSlice.reducer;



