import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from 'react-router-dom';
import { validateProjectForm } from '../utils/validation';
import { ProjectImageApi } from '../services/projectImageApi';
import { createProject, deleteProject } from '../projectThunks';
import { handleError, showSuccess } from '../utils/errorHandler';
import { addProjectFiles, storeFileMetadata } from '../../projectsFiles/projectFilesThunks';
import { addProjectContributor } from '../../projectsContributors/projectContributorThunks';

export const useProjectManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectId = '' } = useParams();
  
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const removeFile = (itemToRemove) => {
    setUploadedFiles(prev => prev.filter(item => item.name !== itemToRemove.name));
  };

  const removeContributor = (id) => {
    setSelectedContributors(prev => prev.filter(contributor => contributor.id !== id));
  };

  const cancelProject = () => {
    dispatch(deleteProject(projectId));
    navigate(`/projects`);
  };

  const handleSubmit = async (formData) => {
    try {
      const validation = validateProjectForm(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }
      
      setFormErrors({});
      setIsLoading(true);

      const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due_date'),
        status: formData.get('status'),
      };
      
      await dispatch(createProject({projectData, projectId})).unwrap();
      
      const contributors = formData.getAll('contributors');
      if (contributors.length > 0) {
        await dispatch(addProjectContributor({
          selectedContributors: contributors, 
          projectId
        })).unwrap();
      }
      
      const files = formData.getAll('files');
      if (files.length > 0) {
        await dispatch(addProjectFiles({files, projectId})).unwrap();
        await dispatch(storeFileMetadata({files, projectId})).unwrap();
      }

      const imageFile = formData.get('image');
      if (imageFile) {
        const imagePath = await ProjectImageApi.uploadImage(projectId, imageFile);
        await ProjectImageApi.updateProjectImage(projectId, imagePath);
      }

      showSuccess(toast, "Your project has been created successfully.");
      setTimeout(() => navigate(`/projects/${projectId}`), 2000);

    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    image,
    content,
    isLoading,
    projectId,
    uploadedFiles,
    selectedFiles,
    formErrors,
    removeFile,
    handleSubmit,
    setImage,
    setContent,
    cancelProject,
    setSelectedFiles,
    removeContributor,
    setUploadedFiles,
    selectedContributors,
    setSelectedContributors,
  };
};