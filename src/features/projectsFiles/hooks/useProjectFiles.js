import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../../../lib/supabase';
import { 
  fetchAllProjectFiles, 
  deleteFileMetadata, 
  deleteProjectFiles,
  addProjectFiles,
  storeFileMetadata
} from '../projectFilesThunks';
import { resetProjectFilesState } from '../projectFilesSlice';

export const useProjectFiles = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  
  const auth = useSelector((state) => state.auth.user);
  const projects = useSelector(state => state.project.projects);
  const loading = useSelector(state => state.projectFiles.loading);
  const projectFiles = useSelector(state => state.projectFiles.projectFiles);

  // Filter files based on query and file type
  const filteredFiles = projectFiles.filter(file => 
    file.name?.toLowerCase().includes(query.toLowerCase()) &&
    (fileTypeFilter === 'all' || file.type.includes(fileTypeFilter))
  );

  // Initialize files data
  useEffect(() => {
    dispatch(resetProjectFilesState());
    if(auth?.id && projects?.length > 0) {
      dispatch(fetchAllProjectFiles(auth.id));
    }
  }, [dispatch, projects, auth]);

  // File operations
  const removeFile = async (file) => {
    try {
      setIsLoading(true);
      await dispatch(deleteFileMetadata(file, file.project_id)).unwrap();
      await dispatch(deleteProjectFiles(file, file.project_id)).unwrap();
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('project_files')
        .download(`${file.project_id}/${file.name}`);

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

  const uploadFiles = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => file.size < 5 * 1024 * 1024);
    
    if (!validFiles.length) {
      alert("File size exceeds 5MB.");
      return;
    }
    setUploadedFiles(validFiles);
  };

  const submitUploadedFiles = (projectId) => {
    if (typeof projectId === 'string' && projectId.trim().length !== 0) {
      dispatch(addProjectFiles({uploadedFiles, projectId}));
      dispatch(storeFileMetadata({uploadedFiles, projectId}));
    }
  };

  const handleFilterChange = (value) => {
    setFileTypeFilter(value);
  };

  return {
    state: {
      query,
      isLoading,
      uploadedFiles,
      selectedFiles,
      fileTypeFilter,
      loading,
      projectFiles,
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
  };
};