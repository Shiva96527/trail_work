import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  srfDropdownOptions: {},
  menuItems: [],
  toggleNonStandard: false,
  digitalizeQuoteId: null,
};

const { reducer, actions } = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, userInfo: action.payload };
    },
    setMenuItems: (state, action) => {
      const menuItems = action.payload || [];

      // Adding ED Quotation if not already in the list
      if (!menuItems.some((item) => item.MenuName === "EdQuotation")) {
        menuItems.push({
          MenuID: menuItems.length + 1,
          MenuName: "EdQuotation",
          MenuLevel: 1, // Top-level menu
          MenuParent: 0, // Parent menu (0 for top-level)
          MenuURL: "/edquotation",
          MenuOrder: menuItems.length + 1,
          MenuActive: "Active",
          CreatedBy: "Admin",
          CreatedDate: new Date().toLocaleDateString(),
        });
      }
      return { ...state, menuItems: action.payload };
    },

    // New action to delete a menu item by MenuID
    deleteMenuItem: (state, action) => {
      // Filter out the item to delete based on MenuID
      const updatedMenuItems = state.menuItems.filter(
        (item) => item.MenuID !== action.payload
      );
      return { ...state, menuItems: updatedMenuItems };
    },

    setSrfDropdownOptions: (state, action) => {
      console.log(action.payload);
      return { ...state, srfDropdownOptions: action.payload };
    },

    // Corrected toggleNonStandard reducer (no payload needed)
    toggleNonStandard: (state) => {
      state.toggleNonStandard = !state.toggleNonStandard; // Toggle the state
    },

    setDigitalizeQuoteId: (state, action) => {
      state.digitalizeQuoteId = action?.payload?.digitalizeQuoteId;
    },

    setToggleNonStandard: (state, action) => {
      state.toggleNonStandard = action?.payload; // Toggle the state
    },
  },
});

export const {
  setUserInfo,
  setSrfDropdownOptions,
  setMenuItems,
  toggleNonStandard,
  setDigitalizeQuoteId,
  setToggleNonStandard,
} = actions;

export default reducer;
