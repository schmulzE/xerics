import { createSlice } from '@reduxjs/toolkit';
import {createTask, fetchTasks, deleteTask, updateTaskDate, updateTaskTitle, updateTaskDesc} from './taskThunk'

const initialState = {
  tasks: [],
  loading: null,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: { 
    resetTasksState: (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    // eslint-disable-next-line no-unused-vars
    .addCase(createTask.fulfilled, (state, action) => {
      state.loading = false;
      // state.tasks = [...state.tasks, action.payload]
    })
    .addCase(createTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload
    })
    .addCase(deleteTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    })
    .addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateTaskTitle.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTaskTitle.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.map(task =>
        task.id === action.payload?.id ? { ...task, title: action.payload.title } : task
      )
    })
    .addCase(updateTaskTitle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateTaskDesc.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTaskDesc.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.map(task =>
        task.id === action.payload?.id ? { ...task, description: action.payload.description } : task
      )
    })
    .addCase(updateTaskDesc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateTaskDate.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTaskDate.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.map(task =>
        task.id === action.payload.id ? { ...task, date: action.payload.date } : task
      )
    })
    .addCase(updateTaskDate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  }
});

// eslint-disable-next-line no-empty-pattern
export const { resetTasksState } = taskSlice.actions;
// export const { addTask, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;