// /* eslint-disable no-unused-vars */
import Tab from "../components/ui/tab";
import { NavLink, useParams } from "react-router-dom";
import Breadcrumbs from "../components/ui/breadcrumbs";
import Modal from '../features/modal/components/modal';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../features/modal/modalSlice.js';
import TaskBoard from "../features/tasks/components/taskBoard";
import ProjectOverview from "../features/projects/components/projectOverview";
import { useProjectDetails } from '../features/projects/hooks/useProjectDetails';
import DeleteFilesForm from "../features/projectsFiles/components/deleteFilesForm";
import { formatDate, getStatusClasses, getBreadcrumbLinks } from '../features/projects/utils/projectUtils';
import ProjectContributorList from '../features/projectsContributors/components/projectContributorList';

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  
  const {
    state: {
      image,
      loading,
      selectedFiles,
      user,
      project,
      projectFiles,
      filesLoadingState,
      projectEvents,
      projectContributors,
      projectloadingState,
      projectErrorState,
      boardLoadingState,
      boards,
      tasks,
      progressValue,
    },
    actions: {
      setSelectedFiles,
      setProjectEvents,
      setBoards,
      setTasks,
      removeFile,
      downloadFile
    }
  } = useProjectDetails();

  const isOpen = useSelector((state) => state.modal.modals?.['deleteFiles']?.isOpen);

  const removeFileConfirmation = () => {
    dispatch(openModal({ 
      id: 'deleteFiles',
      title: 'Delete files',
      contentType: 'DeleteFilesForm',
      contentProps: {
        id: 'deleteFiles',
        removeFile,
      }
    }));
  };

  const renderFileDeleteConfirmation = () => (
    <DeleteFilesForm removeFile={removeFile} isLoading={loading}/>
  );


  const tabs = [
    { 
      title: 'Overview',
      content: (
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
      ) 
    },
    { 
      title: 'Task',
      content: (
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
      )
    },
  ];

  if(project == null && projectContributors) {
    return (
      <div className='p-8 flex justify-center content-center h-full'>
        <div className='m-auto'>
          <i className="pi pi-spin pi-spinner text-7xl text-gray-400 block"></i>
        </div>
      </div>
    );
  }

  const links = getBreadcrumbLinks(projectId);

  return (
    <>
      <div className="px-4 lg:px-8 overflow-x-auto pb-16 lg:pb-0">
        <div className='flex justify-between'>
          <div>
            <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">Projects</h1>
            <Breadcrumbs links={links}/>
          </div>
          <div className="space-x-2 flex items-center">
            <ProjectContributorList 
              projectContributors={projectContributors} 
              onlineUsers={[]}
            />
            {projectContributors.some(contributor => 
              contributor?.profiles?.id == user.id && contributor.role == 'admin'
            ) && (
              <NavLink 
                to={`/projects/edit/${projectId}`} 
                className='bg-blue-600 hidden lg:flex items-center text-white hover:bg-blue-700 hover:text-white btn capitalize font-normal btn-sm'
              >
                <i className='pi pi-pencil'></i>
                <span>edit project</span>
              </NavLink>
            )}
          </div>
        </div>

        <div className='bg-base-100 my-4 p-4 flex gap-x-4'>
          {image && <img src={image} alt="project image" className="w-32"/>}
          <div>
            <div className="flex items-center">
              <h1 className='text-xl font-medium capitalize mb-4'>{project.name}</h1>
              {projectContributors.some(contributor => 
                contributor?.profiles?.id == user.id && contributor.role == 'admin'
              ) && (
                <NavLink 
                  to={`/projects/edit/${projectId}`} 
                  className='btn-ghost block lg:hidden btn capitalize font-normal btn-xs'
                >
                  <i className='pi pi-pencil'></i>
                </NavLink>
              )}
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
                  <span className={`text-xs p-1 capitalize ${getStatusClasses(project.status)}`}>
                    {project.status}
                  </span>
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
  );
};

export default ProjectDetails;