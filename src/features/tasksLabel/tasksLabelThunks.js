import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTaskLabels = createAsyncThunk(
  'tasksLabel/fetchTaskLabels',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('task_id', taskId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addTasksLabel = createAsyncThunk(
  'tasksLabel/addTasksLabel',
  async (labelData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('labels').insert(labelData);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteTasksLabel = createAsyncThunk(
  'tasksLabel/deleteTasksLabel',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('labels').delete().eq('id', taskId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
