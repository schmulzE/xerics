import supabase from '../lib/supabase.js';
import { useEffect, useState } from 'react';
import Dropdown from '../components/ui/dropdown.jsx';
import { getUser } from '../features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../components/ui/breadcrumbs';
import Modal from '../features/modal/components/modal.jsx';
import { fetchProjects } from '../features/projects/projectThunks';
import SearchInputWithIcon from '../components/shared/searchInput.jsx';
import { closeModal, openModal } from '../features/modal/modalSlice.js';
import { deleteFileMetadata } from '../features/projectsFiles/projectFilesThunks';
import ProjectFileList from '../features/projectsFiles/components/projectFileList';
import DeleteFilesForm from "../features/projectsFiles/components/deleteFilesForm.jsx";
import AddProjectFilesForm from '../features/projectsFiles/components/addProjectFilesForm.jsx';
import { fetchAllProjectFiles, deleteProjectFiles, addProjectFiles, storeFileMetadata } from '../features/projectsFiles/projectFilesThunks';

const Resources = () => {
  const dispatch = useDispatch();
  const [query, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth.user);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const projects = useSelector(state => state.project.projects);
  const loading = useSelector(state => state.projectFiles.loading);
  const projectFiles = useSelector(state => state.projectFiles.projectFiles);
  // const [filteredFiles, setFilteredFiles] = useState(projectFiles);
  const firstModalOpen = useSelector((state) => state.modal.modals?.['addProjectFiles']?.isOpen);
  const secondModalOpen = useSelector((state) => state.modal.modals?.['deleteFiles']?.isOpen);
  const isModalOpen = firstModalOpen || secondModalOpen;
  const modalId = firstModalOpen ? 'addProjectFiles' : 'deleteFiles';

  
  const filteredFiles = projectFiles.filter(file => 
    file.name?.toLowerCase().includes(query.toLowerCase()) &&
    (fileTypeFilter === 'all' || file.type.includes(fileTypeFilter))
  );
  
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
   if(auth?.id && projects?.length > 0) {
    dispatch(fetchAllProjectFiles(auth.id));
   }
  }, [dispatch, projects, auth]);

  // useEffect(() => {
  //   const results = projectFiles.filter(file => 
  //     file.name?.toLowerCase().includes(query.toLowerCase()) &&
  //     (fileTypeFilter === 'all' || file.type.includes(fileTypeFilter))
  //   );
  //   setFilteredFiles(results);
  // }, [projectFiles, query, fileTypeFilter]);

  const buttons = [
    {icon: 'pi pi-upload text-gray-500', class: 'btn-sm btn-ghost btn-circle', onClick: (data) => downloadFile(data)},
    {icon: 'pi pi-trash text-gray-500', class: 'btn-sm btn-ghost btn-circle', openModal: () => removeFileConfirmation()},
  ]

  const removeFile = async (file) => {
    try {
      setIsLoading(true);
      await dispatch(deleteFileMetadata(file.id)).unwrap()
      if (file.name && file.project_id) {
        await dispatch(deleteProjectFiles(file.name, file.project_id)).unwrap()
      }
    } catch (error) {
      throw new Error(error)
    }finally {
      setIsLoading(false)
      closeModal()
    }
  }

  const downloadFile = async (file) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('project_files')
        .download(`${file.project_id}/${file.name}`);

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

  const removeFileConfirmation = () => {
    dispatch(openModal({ 
      id: 'deleteFiles',
      title: 'Delete files',
      // contentType: 'DeleteFilesForm',
        contentProps: {
          id: 'deleteFiles',
          isLoading,
          removeFile,
        }
      })
    )
  }

  const renderFileDeleteConfirmation = () => (
    <DeleteFilesForm 
    removeFile={removeFile} 
    isLoading={loading}
    />
  )
   const renderAddProjectFiles = (contentProps) => (
    <AddProjectFilesForm 
    {...contentProps}
    submitUploadedFiles={submitUploadedFiles} 
    uploadFiles={uploadFiles} 
    isLoading={isLoading}
    />
   )

   const uploadFiles = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => file.size < 5 * 1024 * 1024); // Max 5MB
  
    if (!validFiles.length) {
      alert("File size exceeds 5MB.");
      return;
    }
    setUploadedFiles(validFiles);
  };
  
  
  const submitUploadedFiles = (e) => {
    e.preventDefault();
    const form = e.currentTarget
    const { projectId } = Object.fromEntries(new FormData(form));

    if (typeof projectId === 'string' && projectId.trim().length !== 0) {
      dispatch(addProjectFiles({uploadedFiles, projectId}));
      dispatch(storeFileMetadata({uploadedFiles, projectId}));
    }

  }

  const setQuery = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value) => {
    setFileTypeFilter(value);
  };

  const renderContent = firstModalOpen ? renderAddProjectFiles : renderFileDeleteConfirmation;

  const BreadcrumbLinks = [
    {
      text: 'Dashboard',
      url: '/dashboard',
    },
    {
      text: 'Project Lists',
      url: '/projects',
    },
    {
      text: 'Resources',
      url: '/resources',
    },
  ]

  return (
    <>
      <div className="p-8">
        <div className='flex justify-between'>
          <div>
            <h1 className="text-2xl font-medium">Resources</h1>
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

          <SearchInputWithIcon query={query} setQuery={setQuery} placeholder={'search project files'}/>
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

      { isModalOpen && (
        <Modal 
        id={modalId}
        renderContent={renderContent}
        titleClass={'text-lg font-semibold py-2'} 
        modalClass={'max-w-2xl h-auto p-4 rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'}
        />
      )}
    </>
  )
}

export default Resources;