import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {}
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {

      if (!state.modals) {
        state.modals = {};  // Initialize modals if it doesn't exist
      }
      
      const { id, ...modalData } = action.payload;
      state.modals[id] = { isOpen: true, ...modalData };
    },
    closeModal: (state, action) => {
      const { id } = action.payload;
      if (state.modals[id]) {
        state.modals[id].isOpen = false;
      }
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;