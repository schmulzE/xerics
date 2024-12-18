import { createSlice } from '@reduxjs/toolkit';
import { createProject, fetchProjects, fetchProjectById, updateProject, deleteProject } from './projectThunks';

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    resetProjectState: (state) => {
      state.selectedProject = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        // Handle successful project creation
        state.loading = false;
        state.projects = [...state.projects, action.payload]
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        state.projects[updatedIndex] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        // Remove the deleted project from the state
        state.loading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const { resetProjectState } = projectSlice.actions;
export const projects = (state) => state.projects.projects;
export const selectedProject = (state) => state.projects.selectedProject;
export default projectSlice.reducer;