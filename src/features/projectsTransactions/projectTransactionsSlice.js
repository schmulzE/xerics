import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllProjectTransactions,
  fetchProjectTransactionById,
  addProjectTransactions,
} from './projectTransactionsThunks';

const initialState = {
  transactions: [],
  selectedTransaction: [],
  error: null,
  loading: null,
};

const projectTransactionsSlice = createSlice({
  name: 'projectTransactions',
  initialState,
  reducers: {
    resetProjectTransactionsState: (state) => {
      state.selectedTransaction = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Project Transactions
    builder
      .addCase(fetchAllProjectTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjectTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllProjectTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Project Transaction by ID
    builder
      .addCase(fetchProjectTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchProjectTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Project Transactions
    builder
      .addCase(addProjectTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = [...state.transactions, action.payload];
      })
      .addCase(addProjectTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProjectTransactionsState } = projectTransactionsSlice.actions;
export const selectTransactions = (state) => state.projectTransactions.transactions;
export const selectSelectedTransaction = (state) => state.projectTransactions.selectedTransaction;

export default projectTransactionsSlice.reducer;