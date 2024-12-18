// src/features/projectFiles/projectFilesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProjectContributors, fetchAllProjectContributors, addProjectContributor, updateProjectContributors } from './projectContributorThunks';

const projectContributorSlice = createSlice({
  name: 'projectContributors',
  initialState: {
    contributors: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetProjectContributorState: (state) => {
      state.contributors = [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectContributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectContributors.fulfilled, (state, action) => {
        state.loading = false;
        state.contributors = action.payload;
      })
      .addCase(fetchProjectContributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProjectContributor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectContributor.fulfilled, (state, action) => {
        state.loading = false;
        state.contributors.push(action.payload); // Assuming the response contains the newly added contributor
      })
      .addCase(addProjectContributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProjectContributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjectContributors.fulfilled, (state, action) => {
        state.loading = false;
        state.contributors = action.payload; // Assuming the response contains the newly added contributor
      })
      .addCase(fetchAllProjectContributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProjectContributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectContributors.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.contributors.findIndex(
          (contributor) => contributor.id === action.payload.id
        );
        state.contributors[updatedIndex] = action.payload;
      })
      .addCase(updateProjectContributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetProjectContributorState, setLoading, setError } = projectContributorSlice.actions;

export default projectContributorSlice.reducer;
