import { createSlice } from '@reduxjs/toolkit';
import { fetchSubtasks, addSubtasks, deleteSubtasks } from './tasksSubtasksThunks';

const tasksSubtasks = createSlice({
  name: 'tasksSubtasks',
  initialState: {
    subtasks: [],
    error: null,
    loading: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubtasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.loading = false;
        state.subtasks = action.payload;
      })
      .addCase(fetchSubtasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSubtasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubtasks.fulfilled, (state, action) => {
        state.loading = false;
        state.subtasks = [...state.subtasks, action.payload];
      })
      .addCase(addSubtasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubtasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubtasks.fulfilled, (state, action) => {
        state.loading = false;
        state.subtasks = [...state.subtasks, action.payload];
      })
      .addCase(deleteSubtasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
   },
});

// eslint-disable-next-line no-empty-pattern
export const {} = tasksSubtasks.actions;
export const subtasks = (state) => state.tasksSubtasks.subtasks;
export default tasksSubtasks.reducer;
