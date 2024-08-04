import { configureStore } from "@reduxjs/toolkit";
import { globalSlice } from './slices';

const store = configureStore({
    reducer: {
        globalSlice: globalSlice
    }
})

export default store;