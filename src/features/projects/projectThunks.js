import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createProject = createAsyncThunk(
  'project/createProject',
  async ({projectData, projectId}, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('projects').update(projectData).eq('id', projectId);

      if (error) {
        return rejectWithValue(error.message);
      }

      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('projects').select(`*, tasks(*)`);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      if (error) {
        return rejectWithValue(error.message);
      }
 
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ updatedData, projectId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedData)
        .eq('id', projectId);

      if (error) {

        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'project/updateProjectStatus',
  async ({ status, projectId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId)
        .select('*')
        .maybeSingle()

      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {

      const { error: dbError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

      if (dbError) {
        return rejectWithValue(dbError.message);
      }

      // const { error: storageError } = await supabase
      // .storage
      // .from('avatars')
      // .remove([imagePath])

      // if (storageError) {
      //   return rejectWithValue(storageError.message);
      // }

      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjectImageFromStorage = createAsyncThunk(
  'project/deleteProjectImage',
  async (imagePath, { rejectWithValue }) => {
    try {
      const { error } = await supabase
      .storage
      .from('avatars')
      .remove([imagePath])

      if (error) {
        return rejectWithValue(error.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const createProjectImage = createAsyncThunk(
//   'project/createProjectImage',
//   async ({path, file}, { rejectWithValue }) => {
//     try {
//       const { data, error } = await supabase.storage.from('images').upload(path, file, { cacheControl: '3600', upsert: true });
//       if (error) {
//         return rejectWithValue(error.message);
//       }
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );




// export const downloadProjectImage = createAsyncThunk(
//   'project/fetchProjects',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data, error } = await supabase.from('projects').select('*');
//       if (error) {
//         return rejectWithValue(error.message);
//       }
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
