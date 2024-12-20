import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubtasks = createAsyncThunk(
  'subtasks/fetchTaskSubtasks',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
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


export const addSubtasks = createAsyncThunk(
  'subtasks/addSubtasks',
  async (subtaskData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('subtasks').insert(subtaskData).maybeSingle();
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteSubtasks = createAsyncThunk(
  'subtasks/deleteSubtasks',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('subtasks').delete().eq('id', taskId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubtasks = createAsyncThunk(
  'subtasks/deleteSubtasks',
  async ({ completed, id }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('subtasks').update({ completed }).eq('id', id);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

