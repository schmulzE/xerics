import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const { user, error } = await supabase.auth.signUp({ email, password, options: {
        data: {
          username,
        },
      } });
      if (error) {
        return rejectWithValue(error.message);
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const resetPassword = createAsyncThunk('auth/resetPassword', async (newPassword, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data: {user}, error } = await supabase.auth.getUser();
      if (error) {
        return rejectWithValue(error.message);
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
