import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllProjectFiles = createAsyncThunk(
  'projectFiles/fetchAllProjectFiles',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('added_by', userId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectFiles = createAsyncThunk(
  'projectFiles/fetchProjectFiles',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add other async thunks for adding, updating, and deleting project files
export const addProjectFiles = createAsyncThunk(
  'projectFiles/addProjectFile',
  async ({files, projectId}, { rejectWithValue }) => {
    try {
      const uploadedFiles = [];
      for (const file of files) {
      const filePath = `${projectId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);
  
      if (error) {
         rejectWithValue(error.message);
        continue; // Skip to next file on error
      }     
      uploadedFiles.push(data);
    }
    return uploadedFiles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);

export const updateProjectFiles = createAsyncThunk(
  'projectFiles/updateProjectFiles',
  async ({files, projectId}, { rejectWithValue }) => {
    try {
      const uploadedFiles = [];
      for (const file of files) {
      const filePath = `${projectId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('project_files')
        .update(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
  
      if (error) {
         rejectWithValue(error.message);
        continue; // Skip to next file on error
      }     
      uploadedFiles.push(data);
    }
    return uploadedFiles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);

export const deleteProjectFiles = createAsyncThunk(
  'projectFiles/deleteProjectFiles',
  async ({files, projectId}, { rejectWithValue }) => {
    try {
      const uploadedFiles = files.map(file => `${projectId}/${file.name}`);
      const { error } = await supabase
      .storage
      .from('project_files')
      .remove(uploadedFiles);
  
      if (error) {
        rejectWithValue(error.message);
      }     
    return uploadedFiles;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);

export const storeFileMetadata = createAsyncThunk(
  'projectFiles/storeFileMetadata',
  async ({uploadedFiles, projectId}, { rejectWithValue }) => {
    try {
      const metadataToSave = uploadedFiles.map((file) => ({
        project_id: projectId,
        name: file.name,
        size: file.size,
        type: file.type,
        path: `${projectId}/${file.name}`
      }));
    
      const { data, error } = await supabase
        .from('project_files')
        .insert(metadataToSave);
    
      if (error) {
        return rejectWithValue(error.message);
      }
    
      return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);
export const updateFileMetadata = createAsyncThunk(
  'projectFiles/updateFileMetadata',
  async ({uploadedFiles, projectId}, { rejectWithValue }) => {
    try {

       // First, delete existing contributors for the project
       const { error: deleteError } = await supabase
       .from('project_participants')
       .delete()
       .eq('project_id', projectId);

     if (deleteError) {
       return rejectWithValue(deleteError.message);
     }

      const metadataToSave = uploadedFiles.map((file) => ({
        project_id: projectId,
        name: file.name,
        size: file.size,
        type: file.type,
        path: `${projectId}/${file.name}`
      }));
    
      const { data, error } = await supabase
        .from('project_files')
        .update(metadataToSave)
        .eq('project_id', projectId)
    
      if (error) {
        return rejectWithValue(error.message);
      }
    
      return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);

export const deleteFileMetadata = createAsyncThunk(
  'projectFiles/deleteFileMetadata',
  async ({files, projectId}, { rejectWithValue }) => {
    try {
      const filesId = files.map(file => file.id);
      const { data, error } = await supabase
        .from('project_files')
        .delete()
        .in('id', filesId )
        .eq('project_id', projectId);
    
      if (error) {
        return rejectWithValue(error.message);
      }
    
      return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);


export const deleteMultipleFileMetadata = createAsyncThunk(
  'projectFiles/deleteMultipleFileMetadata',
  async ({files}, { rejectWithValue }) => {
    try {
      const metadataToDelete = files.map((file) => file.id);
    
      const { data, error } = await supabase
        .from('project_files')
        .delete()
        .match({ id: metadataToDelete });
    
      if (error) {
        return rejectWithValue(error.message);
      }
    
      return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
  }
);


