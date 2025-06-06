import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../components/ui/dropdown.jsx';
import { getUser } from '../features/auth/authThunks';
import Breadcrumbs from '../components/ui/breadcrumbs';
import Modal from '../features/modal/components/modal.jsx';
import { openModal } from '../features/modal/modalSlice.js';
import { fetchProjects } from '../features/projects/projectThunks';
import SearchInputWithIcon from '../components/ui/searchInput.jsx';
import { useProjectFiles } from '../features/projectsFiles/hooks/useProjectFiles';
import ProjectFileList from '../features/projectsFiles/components/projectFileList';
import DeleteFilesForm from "../features/projectsFiles/components/deleteFilesForm.jsx";
import AddProjectFilesForm from '../features/projectsFiles/components/addProjectFilesForm.jsx';

const Resources = () => {
  const dispatch = useDispatch();
  const firstModalOpen = useSelector((state) => state.modal.modals?.['addProjectFiles']?.isOpen);
  const secondModalOpen = useSelector((state) => state.modal.modals?.['deleteFiles']?.isOpen);
  const isModalOpen = firstModalOpen || secondModalOpen;
  const modalId = firstModalOpen ? 'addProjectFiles' : 'deleteFiles';

  const {
    state: {
      query,
      isLoading,
      selectedFiles,
      fileTypeFilter,
      loading,
      filteredFiles,
      projects
    },
    actions: {
      setQuery,
      setSelectedFiles,
      removeFile,
      downloadFile,
      uploadFiles,
      submitUploadedFiles,
      handleFilterChange
    }
  } = useProjectFiles();

  // Initialize projects and user data
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(getUser());
  }, [dispatch]);

  const buttons = [
    {
      icon: 'pi pi-upload text-gray-500', 
      class: 'btn-sm btn-ghost btn-circle', 
      onClick: (file) => downloadFile(file)
    },
    {
      icon: 'pi pi-trash text-gray-500', 
      class: 'btn-sm btn-ghost btn-circle', 
      onClick: (file) => removeFileConfirmation(file)
    },
  ];

  const removeFileConfirmation = (file) => {
    dispatch(openModal({ 
      id: 'deleteFiles',
      title: 'Delete files',
      contentProps: {
        id: 'deleteFiles',
        isLoading: loading,
        removeFile,
        file
      }
    }));
  };

  const renderFileDeleteConfirmation = (contentProps) => (
    <DeleteFilesForm {...contentProps} />
  );

  const renderAddProjectFiles = (contentProps) => (
    <AddProjectFilesForm 
      {...contentProps}
      submitUploadedFiles={submitUploadedFiles} 
      uploadFiles={uploadFiles} 
      isLoading={isLoading}
    />
  );

  const renderContent = firstModalOpen ? renderAddProjectFiles : renderFileDeleteConfirmation;

  const BreadcrumbLinks = [
    { text: 'Dashboard', url: '/dashboard' },
    { text: 'Project Lists', url: '/projects' },
    { text: 'Resources', url: '/resources' },
  ];

  return (
    <>
      <div className="p-8 lg:px-8 lg:py-2">
        <div className='flex justify-between'>
          <div>
            <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">Resources</h1>
            <Breadcrumbs links={BreadcrumbLinks}/>
          </div>
          <div>
            <button 
              className='bg-blue-600 hover:bg-blue-700 text-white btn-sm btn capitalize space-x-1 font-normal' 
              onClick={() => dispatch(openModal({ 
                id: 'addProjectFiles',
                title: 'Add files',
                contentProps: {
                  id: 'addProjectFiles',
                  projects,
                }
              }))}
            >
              <i className='pi pi-plus'></i>
              <span>add files</span>
            </button>
          </div>
        </div>
        
        <div className='flex justify-between items-center mt-4'>
          <SearchInputWithIcon 
            query={query} 
            setQuery={setQuery} 
            placeholder={'search project files'}
          />
          <Dropdown 
            type="filter"
            options={[
              { value: "all", label: "All types" },
              { value: "image", label: "Images" },
              { value: "application/pdf", label: "PDFs" },
              { 
                value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                label: "Word Documents" 
              },
              { 
                value: "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
                label: "Excel Sheets" 
              },
              { value: "text/csv", label: "CSV" }
            ]}
            activeFilter={fileTypeFilter}
            onSelect={handleFilterChange}
          />
        </div> 

        <h1 className='capitalize text-xl my-4'>files</h1>
        <ProjectFileList
          files={filteredFiles} 
          buttons={buttons} 
          selectedFiles={selectedFiles} 
          setSelectedFiles={setSelectedFiles}
          loading={loading}
          icon={'pi pi-ellipsis-v'}
        />
      </div>

      {isModalOpen && (
        <Modal 
          id={modalId}
          renderContent={renderContent}
          titleClass={'text-lg font-semibold py-2'} 
          modalClass={'max-w-2xl h-auto p-4 rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'}
        />
      )}
    </>
  );
};

export default Resources;