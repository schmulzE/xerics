import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';

const initialState = {
  boards: [],
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {/*Define reducers here */},
  extraReducers: (builders) => {
    builders
    .addCase(fetchBoards.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBoards.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = action.payload
    })
    .addCase(fetchBoards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
  }
});

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('boards').select('*').order('created_at', { ascending: true});
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// eslint-disable-next-line no-empty-pattern
export const { /* Define action creators here */} = boardSlice.actions;
export const boards = (state) => state.boards.boards;
export default boardSlice.reducer;