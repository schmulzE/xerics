// src/app/store.js
/* eslint-disable no-unused-vars */
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';
import usersReducer from '../features/users/usersSlice';
import modalReducer from '../features/modal/modalSlice';
import boardReducer from '../features/boards/boardsSlice';
import projectReducer from '../features/projects/projectSlice';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tasksLabelReducer from '../features/tasksLabel/tasksLabelSlice';
import projectFilesReducer from '../features/projectsFiles/projectFilesSlice';
import tasksSubtasksReducer from '../features/tasksSubtasks/tasksSubtasksSlice';
import projectEventsReducer from '../features/projectEvents/projectEventsSlice';
import projectContributorReducer from '../features/projectsContributors/projectContributorSlice';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'; 
import projectTransactionsReducer from '../features/projectsTransactions/projectTransactionsSlice';

// Define a transform function to exclude specific slices
const excludeTransform = (inboundState, key) => {
  if (key === 'task' || key === 'tasksLabel' || key === 'tasksSubtasks' || key === 'modal') {
    return {}; // Exclude these slices from persistence
  }
  return inboundState;
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transform: [excludeTransform]
};

const reducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  project: projectReducer,
  projectFiles: projectFilesReducer,
  projectEvents: projectEventsReducer,
  projectContributor: projectContributorReducer,
  projectTransactions: projectTransactionsReducer,
  task: taskReducer,
  tasksLabel: tasksLabelReducer,
  tasksSubtasks: tasksSubtasksReducer,
  board: boardReducer,
  user: usersReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer, 
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      immutableCheck: false,
      serializableCheck: false,
    })
});

export default store;
