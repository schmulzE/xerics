/* eslint-disable no-unused-vars */
import Tab from "../components/ui/tab";
import supabase from '../lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import { NavLink, useParams } from "react-router-dom";
import { getUser } from '../features/auth/authThunks';
import Breadcrumbs from "../components/ui/breadcrumbs";
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../features/modal/components/modal';
import { fetchTasks } from "../features/tasks/taskThunk.js";
import { resetTasksState } from '../features/tasks/taskSlice';
import TaskBoard from "../features/tasks/components/taskBoard";
import { fetchBoards } from "../features/boards/boardsSlice.js";
import { fetchUserProfile } from '../features/users/usersThunks';
import { resetProjectState } from '../features/projects/projectSlice';
import { openModal, closeModal } from '../features/modal/modalSlice.js';
import ProjectOverview from "../features/projects/components/projectOverview";
import DeleteFilesForm from "../features/projectsFiles/components/deleteFilesForm";
import { resetProjectFilesState } from '../features/projectsFiles/projectFilesSlice';
import { fetchProjectById, updateProject } from '../features/projects/projectThunks';
import { fetchProjectEvents } from '../features/projectEvents/projectEventsThunks.js';
import { resetProjectEventsState } from '../features/projectEvents/projectEventsSlice';
import { fetchProjectContributors } from '../features/projectsContributors/projectContributorThunks.js';
import { resetProjectContributorState } from '../features/projectsContributors/projectContributorSlice';
import ProjectContributorList from '../features/projectsContributors/components/projectContributorList';
import { deleteProjectFiles, fetchProjectFiles, deleteFileMetadata } from '../features/projectsFiles/projectFilesThunks';

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([]);
  const auth = useSelector((state) => state.auth.user);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
  const [projectEvents, setProjectEvents] = useState([...events]);
  const projectTasks = useSelector(state => state.task.tasks);
  const [boards, setBoards] = useState([...projectBoards]);
  const [tasks, setTasks] = useState([...projectTasks]);
  const isOpen = useSelector((state) => state.modal.modals?.['deleteFiles']?.isOpen);

  
  const fetchProjectThenProjectFiles = async(dispatch, projectId) => {
    await dispatch(fetchProjectById(projectId));
    await dispatch(fetchProjectEvents(projectId));
    await dispatch(fetchProjectFiles(projectId));
    await dispatch(fetchProjectContributors(projectId));
    await dispatch(fetchTasks(projectId));
  };
  
  const fetchBoardsAndUser = async(dispatch) => {
    await dispatch(fetchBoards());
    await dispatch(getUser());
  };

  useEffect(() => {
     // Reset states before fetching new project data
     dispatch(resetProjectState());
     dispatch(resetTasksState());
     dispatch(resetProjectFilesState());
     dispatch(resetProjectEventsState());
     dispatch(resetProjectContributorState());

    fetchProjectThenProjectFiles(dispatch, projectId)
  }, [dispatch, projectId]);

  useEffect(() => {
    fetchBoardsAndUser(dispatch)
  }, [dispatch])

  useEffect(() => {
    setTasks([...projectTasks])
  }, [projectTasks])

  useEffect(() => {
    if(auth) {
      dispatch(fetchUserProfile(auth.id))
    }
  }, [dispatch, auth])

  useEffect(() => {
    // Reset image when project is null or changes
    if (!project?.image) {
      setImage('');
      return;
    }

    if(project?.image){
      const { data } = supabase.storage.from('project_images').getPublicUrl(project?.image)
      setImage(data.publicUrl)
    }
  },[project?.image])

  const removeFile = async (file) => {
    try {
      setLoading(true);
      const isAdmin = projectContributors.some(contributor => contributor.profiles.id == user.id  && contributor.role == 'admin')
      if(isAdmin) {
        await dispatch(deleteFileMetadata(file.id)).unwrap();
        await dispatch(deleteProjectFiles(file.name, projectId)).unwrap();
        setLoading(false)
      }else {
        dispatch(closeModal({ id: 'deleteFiles'}))
        setLoading(false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const removeFileConfirmation = ( ) => {
    // dispatch(openModal({ id: 'deleteFiles'}))
    dispatch(openModal({ 
      id: 'deleteFiles',
      title: 'Delete files',
      contentType: 'DeleteFilesForm',
        contentProps: {
          id: 'deleteFiles',
          // isLoading,
          removeFile,
        }
      })
    )
  }

  const renderFileDeleteConfirmation = () => (
    <DeleteFilesForm removeFile={removeFile} isLoading={loading}/>
  )

  const downloadFile = async(file) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('project_files')
        .download(file.path)

      if (error) {
        throw error;
      }

      // Create a blob from the data
      const blob = new Blob([data], {type: data.type});
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error('Error downloading file:', error);
    }
  }

  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayOfTasksFinished, tasks, arrayOfTasksInReview, arrayOfTasksInProgress]);


  const tabs = [
    { title: 'Overview',
      content: 
      <ProjectOverview
        user={user}
        project={project} 
        error={projectErrorState}
        projectFiles={projectFiles}
        projectEvents={projectEvents}
        selectedFiles={selectedFiles}
        loading={projectloadingState} 
        downloadFile={downloadFile}
        setSelectedFiles={setSelectedFiles}
        filesLoadingState={filesLoadingState}
        projectContributors={projectContributors}
        removeFileConfirmation={removeFileConfirmation}
      /> 
    },
    { title: 'Task',
      content:
      <TaskBoard 
      user={user}
      tasks={tasks}
      boards={boards}
      setTasks={setTasks}
      setBoards={setBoards}
      loading={boardLoadingState}
      setProjectEvents={setProjectEvents} 
      projectContributors={projectContributors} 
      />
    },
  ];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'In Review':
        return 'bg-red-50 text-red-400';
      case 'Done':
        return 'bg-green-50 text-green-400';
      case 'In Progress':
        return 'bg-orange-50 text-orange-400';
      default:
        return 'bg-base-100 text-gray-400';
    }
  };

  if(project == null || projectloadingState && projectContributors) return (
    <div className='p-8 flex justify-center content-center h-full'>
      <div className='m-auto'>
      <i className="pi pi-spin pi-spinner text-7xl text-gray-400 block"></i>
      </div>
    </div>
    )

    const links = [
      {
        text: 'Dashboard',
        url: '/dashboard',
      },
      {
        text: 'Project Lists',
        url: '/projects',
      },
      {
        text: 'Project Details',
        url: '/project/' + projectId,
      },
    ]

  return (
    <>
     <div className="px-4 lg:px-8 overflow-x-auto pb-16 lg:pb-0">
      <div className='flex justify-between'>
        <div>
          <h1 className="text-2xl font-medium">Projects</h1>
          <Breadcrumbs links={links}/>
        </div>
        <div className="space-x-2 flex items-center">
          <ProjectContributorList projectContributors={projectContributors} onlineUsers={onlineUsers}/>
          {projectContributors.some(contributor => contributor?.profiles?.id == user.id  && contributor.role == 'admin') && <NavLink 
          to={`/projects/edit/${projectId}`} 
          className='bg-blue-600 hidden lg:block text-white hover:bg-blue-700 hover:text-white btn capitalize font-normal btn-sm'
          >
            <i className='pi pi-pencil'></i>
            <span>edit project</span>
          </NavLink>}
        </div>
      </div>

      <div className='bg-base-100 my-4 p-4 flex gap-x-4'>
        {image && <img src={image} alt="project image" className="w-32"/>}
        <div>
        <div className="flex items-center">
          <h1 className='text-xl font-medium capitalize mb-4'>{project.name}</h1>
          {projectContributors.some(contributor => contributor?.profiles?.id == user.id  && contributor.role == 'admin') && <NavLink 
          to={`/projects/edit/${projectId}`} 
          className='btn-ghost block lg:hidden btn capitalize font-normal btn-xs'
          >
            <i className='pi pi-pencil'></i>
          </NavLink>}
        </div>
        <div className="flex flex-col lg:flex-row gap-x-4">
          <div className="w-72">
            <div className="flex justify-between items-center">
              <span className="text-sm capitalize">Progress</span>
              <span className="text-xs">{progressValue}%</span>
            </div>
            <progress className="progress progress-warning" value={progressValue} max="100"></progress>
          </div>
          <div className="flex gap-4 lg:gap-x-4">
            <div className="flex flex-col">
              <span className="text-sm capitalize text-gray-400">status</span>
              <span className={`text-xs p-1 capitalize ${getStatusClasses(project.status)}`}>{project.status}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm capitalize text-gray-400">tasks</span>
              <span className="text-xs p-1 capitalize">{tasks.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm capitalize text-gray-400">due date</span>
              <span className="text-xs p-1 capitalize">{formatDate(project.due_date)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm capitalize text-gray-400">created</span>
              <span className="text-xs p-1 capitalize">{formatDate(project.created_at)}</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Tab 
        tabs={tabs} 
        tabClass={''}
        tablistClass={'flex flex-wrap -mb-px'}
        tabContentClass={"tab-content overflow-x-auto"} 
        tabContainerClass={"text-sm text-center text-gray-500 border-b border-base-300 capitalize"} 
        activeTabClass={'inline-block p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active'}
        tabButtonClass={'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'}
      />
    </div>
  
    {isOpen && (
      <Modal
        id='deleteFiles'
        titleClass={'text-lg font-semibold py-2'} 
        renderContent={renderFileDeleteConfirmation}
        modalClass='max-w-2xl h-auto p-4 rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'
      />
    )}
  </>
  )
}

export default ProjectDetails