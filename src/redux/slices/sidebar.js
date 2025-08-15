import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    SubModule: "",


}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
                setSubModule: (state, action) => {
            state.SubModule = action.payload;
        },
    }
})

export const {setSubModule} = sidebarSlice.actions;
export default sidebarSlice.reducer;



