/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import supabase from '../../../lib/supabase';
import { getUser } from '../../auth/authThunks.js';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from "../../boards/boardsSlice.js";
import { fetchUserProfile } from '../../users/usersThunks.js';
import { fetchTasks } from "../../tasks/taskThunk.js";
import { resetTasksState } from '../../tasks/taskSlice.js';
import { fetchProjectById } from '../projectThunks';
import { resetProjectState } from '../projectSlice.js';
import { fetchProjectEvents } from '../../projectEvents/projectEventsThunks.js';
import { resetProjectFilesState } from '../../projectsFiles/projectFilesSlice.js';
import { resetProjectEventsState } from '../../projectEvents/projectEventsSlice.js';
import { fetchProjectContributors } from '../../projectsContributors/projectContributorThunks.js';
import { resetProjectContributorState } from '../../projectsContributors/projectContributorSlice.js';
import { fetchProjectFiles, deleteFileMetadata, deleteProjectFiles } from '../../projectsFiles/projectFilesThunks';

export const useProjectDetails = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Selectors
  const auth = useSelector((state) => state.auth.user);
  const user = useSelector(state => state.user.selectedUser);
  const project = useSelector(state => state.project.selectedProject);
  const projectFiles = useSelector(state => state.projectFiles.selectedProjectFiles);
  const filesLoadingState = useSelector(state => state.projectFiles.loading);
  const events = useSelector(state => state.projectEvents.projectEvents);
  const projectContributors = useSelector(state => state.projectContributor.contributors);
  const projectloadingState = useSelector(state => state.project.loading);
  const projectErrorState = useSelector(state => state.project.error);
  const projectBoards = useSelector(state => state.board.boards);
  const boardLoadingState = useSelector(state => state.board.loading);
  const projectTasks = useSelector(state => state.task.tasks);
  
  // Local state
  const [projectEvents, setProjectEvents] = useState([...events]);
  const [boards, setBoards] = useState([...projectBoards]);
  const [tasks, setTasks] = useState([...projectTasks]);

  // Fetch functions
  const fetchProjectThenProjectFiles = async() => {
    await Promise.all([
      dispatch(fetchProjectById(projectId)),
      dispatch(fetchProjectEvents(projectId)),
      dispatch(fetchProjectFiles(projectId)),
      dispatch(fetchProjectContributors(projectId)),
      dispatch(fetchTasks(projectId)),
    ]);

  };

  const fetchBoardsAndUser = async() => {
    await Promise.all([
      dispatch(fetchBoards()),
      dispatch(getUser())
    ]);
  };

  // Effects
  useEffect(() => {
    // Reset states before fetching new project data
    dispatch(resetProjectState());
    dispatch(resetTasksState());
    dispatch(resetProjectFilesState());
    dispatch(resetProjectEventsState());
    dispatch(resetProjectContributorState());

    fetchProjectThenProjectFiles();
  }, [dispatch, projectId]);

  useEffect(() => {
    fetchBoardsAndUser();
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(projectTasks) && projectTasks.length > 0) {
      setTasks([...projectTasks]);
    }
  }, [projectTasks]);

  useEffect(() => {
    if(auth) {
      dispatch(fetchUserProfile(auth.id));
    }
  }, [dispatch, auth]);

  useEffect(() => {
    // Reset image when project is null or changes
    if (!project?.image) {
      setImage('');
      return;
    }

    if(project?.image){
      const { data } = supabase.storage.from('project_images').getPublicUrl(project?.image);
      setImage(data.publicUrl);
    }
  }, [project?.image]);

  // File operations
  const removeFile = async (file) => {
    try {
      setLoading(true);
      const isAdmin = projectContributors.some(
        contributor => contributor.profiles.id == user.id && contributor.role == 'admin'
      );
      
      if(isAdmin) {
        await dispatch(deleteFileMetadata(file.id)).unwrap();
        await dispatch(deleteProjectFiles(file.name, projectId)).unwrap();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(error);
    }
  };

  const downloadFile = async(file) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('project_files')
        .download(file.path);

      if (error) throw error;

      const blob = new Blob([data], {type: data.type});
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Error downloading file:', error);
    }
  };

  // Task calculations
  const filterTasksByBoard = (tasks, boards, boardTitle) => {
    const board = boards.find(board => board.title === boardTitle);
    if (!board) return [];
    return tasks.filter(task => task?.board_id === board.id);
  };

  const calculateProgressPercentage = (finishedTasks, totalTasks) => {
    if (!totalTasks.length || !finishedTasks.length) return 0;
    const percentage = (finishedTasks.length / totalTasks.length) * 100;
    return Math.min(Math.floor(percentage), 100);
  };

  const arrayOfTasksFinished = filterTasksByBoard(tasks, boards, 'done');
  const arrayOfTasksInReview = filterTasksByBoard(tasks, boards, 'in review');
  const arrayOfTasksInProgress = filterTasksByBoard(tasks, boards, 'in progress');
  
  const progressValue = useMemo(() => {
    return calculateProgressPercentage(arrayOfTasksFinished, tasks);
  }, [arrayOfTasksFinished, tasks, arrayOfTasksInReview, arrayOfTasksInProgress]);

  return {
    state: {
      image,
      loading,
      selectedFiles,
      auth,
      user,
      project,
      projectFiles,
      filesLoadingState,
      events,
      projectContributors,
      projectloadingState,
      projectErrorState,
      projectBoards,
      boardLoadingState,
      projectEvents,
      projectTasks,
      boards,
      tasks,
      progressValue,
      arrayOfTasksFinished,
      arrayOfTasksInReview,
      arrayOfTasksInProgress
    },
    actions: {
      setSelectedFiles,
      setProjectEvents,
      setBoards,
      setTasks,
      removeFile,
      downloadFile
    }
  };
};