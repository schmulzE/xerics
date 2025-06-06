import supabase from '../../lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('tasks')
      .insert(taskData)
      .select()
      .maybeSingle();
      if (error) {
        return rejectWithValue(error.message);
      }
      // return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
      .from('tasks')
      .select(`*, labels!labels_task_id_fkey(*), subtasks(*)`)
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

export const updateTaskTitle = createAsyncThunk(
  'tasks/updateTaskTitle',
  async ({taskTitle, taskId}, { rejectWithValue }) => {
    try {   
      const { error } = await supabase.from('tasks')
      .update({ title: taskTitle })
      .select()
      .eq('id', taskId)

      if(error) { 
        rejectWithValue(error.message)
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateTaskDate = createAsyncThunk(
  'tasks/updateTaskDate',
  async ({taskDate, taskId}, { rejectWithValue }) => {
    try {
      const {error} =  await supabase
      .from('tasks')
      .update({
        date: taskDate
      })
      .match({
        id: taskId
      })
      if(error) {
        return rejectWithValue(error.message);
      }
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateTaskDesc = createAsyncThunk(
  'tasks/updateTaskDesc',
  async ({description, id}, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('tasks')
      .update({ description: description })
      .eq('id', id)

      if(error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const updateTaskBoard = createAsyncThunk(
  'tasks/updateTaskBoard',
  async ({overId, activeId}, { rejectWithValue }) => {
    try {
      const { error } = await supabase
      .from('tasks')
      .update({
        board_id: overId,
      })
      .match({
        id: activeId,
      })

      if(error) {
        return rejectWithValue(error.message);
      }
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)