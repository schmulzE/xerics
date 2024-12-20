import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('profiles').select();
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const uploadUserAvatar = createAsyncThunk(
  'users/uploadUserAvatar',
  async ({file, userId}, { rejectWithValue }) => {
    try {
      const filePath = `${userId}/${file.name}`;
      let error = await supabase.storage.from('avatars').upload(filePath, file)
      if (error) rejectWithValue(error.message);

    } catch (error) {
      if(error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const downloadUserAvater = createAsyncThunk(
  'users/downloadUserAvater',
  async ({path}, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) rejectWithValue(error.message);
      // src.value = URL.createObjectURL(data)
      return data;
    } catch (error) {
      if(error instanceof Error){
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'project/fetchUserProfile',
  async ( userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
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

export const updateUserProfile = createAsyncThunk(
  'project/updateUserProfile',
  async ({ userProfile, userId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userProfile)
        .eq('id', userId)
        .single()

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

