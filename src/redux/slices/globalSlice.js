import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userInfo: null,
    srfDropdownOptions: {},
    menuItems: []
};

const { reducer, actions } = createSlice({
    name: 'globalSlice',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            return { ...state, userInfo: action.payload }
        },
        setMenuItems: (state, action) => {
            return { ...state, menuItems: action.payload }
        },
        setSrfDropdownOptions: (state, action) => {
            console.log(action.payload);
            return { ...state, srfDropdownOptions: action.payload }
        }
    }
})
export const { setUserInfo, setSrfDropdownOptions, setMenuItems } = actions;
export default reducer;