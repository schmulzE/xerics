import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../lib/supabase';

export const fetchProjectContributors = createAsyncThunk(
  'projectContributors/fetchProjectContributors',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_participants')
        .select(`project_id, role, profiles(*)`)
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

export const fetchAllProjectContributors = createAsyncThunk(
  'projectContributors/fetchAllProjectContributors',
  async ({ rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('project_participants')
        .select(`project_id, role, profiles(*)`)

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProjectContributor = createAsyncThunk(
  'projectContributors/addProjectContributor',
  async ({selectedContributors, projectId}, { rejectWithValue }) => {
    try {

      const contributors = selectedContributors.map((contributor) => ({
        project_id: projectId,
        profile_id: contributor,
        role: 'member',
      }));

      const { data, error } = await supabase.from('project_participants').insert(contributors);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectContributors = createAsyncThunk(
  'projectContributors/updateProjectContributors',
  async ({selectedContributors, projectId}, { rejectWithValue }) => {
    try {
      // First, delete existing contributors for the project
      const { error: deleteError } = await supabase
        .from('project_participants')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) {
        return rejectWithValue(deleteError.message);
      }

      // Then insert new contributors
      const contributors = selectedContributors.map((contributor) => ({
        project_id: projectId,
        profile_id: contributor,
        role: 'member',
      }));

      const { data, error } = await supabase
      .from('project_participants')
      .insert(contributors);

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjectContributors = createAsyncThunk(
  'projectContributors/deleteProjectContributor',
  async (selectedContributor, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
      .from('project_participants')
      .delete()
      .eq('profile_id', selectedContributor);

      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
