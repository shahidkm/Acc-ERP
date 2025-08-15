import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "./slices/userRegister";
import LoginReducer from "./slices/userLogin"
import SidebarReducer from "./slices/sidebar"
const store = configureStore({
  reducer: {
    userRegister: RegistrationReducer,
    userLogin:LoginReducer,
    sidebar:SidebarReducer
    
  },
});

export default store;
