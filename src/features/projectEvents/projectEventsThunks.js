import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjectEvents = createAsyncThunk(
  'projectEvents/fetchProjectEvents',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', projectId)
        .limit(5);
      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProjectEvent = createAsyncThunk(
  'projectEvents/addProjectEvent',
  async (event, { rejectWithValue }) => {
    console.log(event)
    try {
      const { data, error } = await supabase.from('project_timeline').insert(event);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
