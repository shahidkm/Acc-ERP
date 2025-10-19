// sidebarSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SubModule: null,
  MainModule: null,
  expandedModules: { Dashboard: true }
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSubModule: (state, action) => {
      state.SubModule = action.payload;
    },
    setMainModule: (state, action) => {
      state.MainModule = action.payload;
    },
    setActiveModules: (state, action) => {
      const { mainModule, subModule } = action.payload;
      state.MainModule = mainModule;
      state.SubModule = subModule;
    },
    setExpandedModules: (state, action) => {
      state.expandedModules = action.payload;
    },
    toggleModule: (state, action) => {
      const moduleLabel = action.payload;
      // Toggle whether that module is expanded
      state.expandedModules[moduleLabel] = !state.expandedModules[moduleLabel];
    }
  }
});

export const {
  setSubModule,
  setMainModule,
  setActiveModules,
  setExpandedModules,
  toggleModule
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
