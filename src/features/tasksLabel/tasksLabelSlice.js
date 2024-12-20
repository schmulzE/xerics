import { createSlice } from '@reduxjs/toolkit';
import { fetchTaskLabels, addTasksLabel, deleteTasksLabel } from './tasksLabelThunks';

const tasksLabel = createSlice({
  name: 'tasksLabel',
  initialState: {
    labels: [],
    error: null,
    loading: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskLabels.fulfilled, (state, action) => {
        state.loading = false;
        state.labels = action.payload;
      })
      .addCase(fetchTaskLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTasksLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTasksLabel.fulfilled, (state, action) => {
        state.loading = false;
        state.labels = [...state.labels, action.payload];
      })
      .addCase(addTasksLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTasksLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTasksLabel.fulfilled, (state, action) => {
        state.loading = false;
        // state.labels = [...state.labels, action.payload];
        state.labels = state.labels.filter(label => label.id !== action.payload);
      })
      .addCase(deleteTasksLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
   },
});

// eslint-disable-next-line no-empty-pattern
export const {} = tasksLabel.actions;
export const labels = (state) => state.tasksLabels.labels;
export default tasksLabel.reducer;
