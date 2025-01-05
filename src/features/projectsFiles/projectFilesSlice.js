import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line no-unused-vars
import { 
  fetchAllProjectFiles, 
  fetchProjectFiles, 
  addProjectFiles,
  updateFileMetadata,
  storeFileMetadata, 
  deleteFileMetadata, 
  deleteMultipleFileMetadata 
} from './projectFilesThunks';

const projectFilesSlice = createSlice({
  name: 'projectFiles',
  initialState: {
    projectFiles: [],
    selectedProjectFiles: null,
    error: null,
    loading: null
  },
  reducers: {
    resetProjectFilesState: (state) => {
      state.projectFiles = [],
      state.selectedProjectFiles = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjectFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.projectFiles = action.payload;
      })
      .addCase(fetchAllProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //fetch project Files
      .addCase(fetchProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProjectFiles = action.payload;
      })
      .addCase(fetchProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //add project files
      .addCase(addProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.projectFiles = [...state.projectFiles, action.payload];
      })
      .addCase(addProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //store file metadata
      .addCase(storeFileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.projectFilesMetaData =  action.payload;
      })
      .addCase(storeFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //update file metadata
      .addCase(updateFileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.projectFilesMetaData.findIndex(
          (file) => file.id === action.payload.id
        );
        state.projectFilesMetaData[updatedIndex] = action.payload;
      })
      .addCase(updateFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete project file
      .addCase(deleteFileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.projectFilesMetaData = state.projectFilesMetaData.filter(filesMetadata => filesMetadata.id !== action.payload);
      })
      .addCase(deleteFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMultipleFileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMultipleFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.projectFilesMetaData = state.projectFilesMetaData.reduce((acc, item) => (!action.payload.includes(item) ? acc.concat(item) : acc), []);
      })
      .addCase(deleteMultipleFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   },
});

// eslint-disable-next-line no-empty-pattern
export const { resetProjectFilesState } = projectFilesSlice.actions;
export const projectsFiles = (state) => state.projectFiles.projectsFiles;
export const selectedProjectFiles = (state) => state.projectFiles.selectedProjectFiles;
export default projectFilesSlice.reducer;
