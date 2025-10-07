import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "./slices/userRegister";
import LoginReducer from "./slices/userLogin"
import SidebarReducer from "./slices/sidebar"
import VoucherReducer from "./slices/voucher"
const store = configureStore({
  reducer: {
    userRegister: RegistrationReducer,
    userLogin:LoginReducer,
    sidebar:SidebarReducer,
    voucher:VoucherReducer
  },
});

export default store;
