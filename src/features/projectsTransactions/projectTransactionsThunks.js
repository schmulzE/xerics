import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';

export const fetchAllProjectTransactions = createAsyncThunk(
  'projectTransactions/fetchAllProjectTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_transactions')
        .select('*');

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching project transactions:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectTransactionById = createAsyncThunk(
  'projectTransactions/fetchProjectTransactionById',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_transactions')
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


export const addProjectTransactions = createAsyncThunk(
  'projectTransactions/addProjectTransactions',
  async (transaction, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('project_transactions').insert(transaction);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
