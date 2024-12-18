import { createSlice } from '@reduxjs/toolkit';
import { fetchProjectEvents, addProjectEvent } from './projectEventsThunks';

const projectEventsSlice = createSlice({
  name: 'projectEvents',
  initialState: {
    projectEvents: [],
    error: null,
    loading: null
  },
  reducers: {
    resetProjectEventsState: (state) => {
      state.projectEvents = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProjectEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.projectEvents = [...state.projectEvents, action.payload];
      })
      .addCase(addProjectEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.projectEvents = action.payload;
      })
      .addCase(fetchProjectEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
   },
});

// eslint-disable-next-line no-empty-pattern
export const { resetProjectEventsState } = projectEventsSlice.actions;
export const events = (state) => state.projectEvents.projectEvents;
export default projectEventsSlice.reducer;
