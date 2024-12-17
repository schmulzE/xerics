/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Breadcrumbs from '../components/ui/breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,useNavigate } from 'react-router-dom';
import ProjectForm from '../features/projects/components/projectForm';
import { fetchProjectById, updateProject } from '../features/projects/projectThunks';
import { 
  deleteProjectContributors, 
  fetchProjectContributors, 
  updateProjectContributors 
} from '../features/projectsContributors/projectContributorThunks';
import { 
  updateProjectFiles, 
  updateFileMetadata, 
  deleteProjectFiles, 
  deleteFileMetadata, 
  fetchProjectFiles 
} from '../features/projectsFiles/projectFilesThunks';


const AddProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { projectId } = useParams();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const selectedProject = useSelector(state => state.project.selectedProject);
  const projectFiles = useSelector(state => state.projectFiles.selectedProjectFiles);
  const projectContributors = useSelector(state => state.projectContributor.contributors);
  const [uploadedFiles, setUploadedFiles] = useState(projectFiles);
  const [project, setProject] = useState({...selectedProject});
  const [selectedContributors, setSelectedContributors] = useState(projectContributors);

  const fetchProjectThenProjectFiles = async(dispatch, projectId) => {
    await dispatch(fetchProjectById(projectId));
    await dispatch(fetchProjectFiles(projectId));
    await dispatch(fetchProjectContributors(projectId));
  };

  useEffect(() => {
    fetchProjectThenProjectFiles(dispatch, projectId)
  }, [dispatch, projectId]);

  useEffect(() => {
    console.log(uploadedFiles);
  }, [uploadedFiles]);

  const removeFile = (itemToRemove) => {
    const filteredItems = uploadedFiles.filter(item => item.name !== itemToRemove.name);
    setUploadedFiles(filteredItems);
    dispatch(deleteFileMetadata(itemToRemove.id))
    dispatch(deleteProjectFiles(itemToRemove.name, itemToRemove.project_id))
  }

  useEffect(() => {
    const { data } = supabase.storage.from('project_image').getPublicUrl(project?.image)
    setImage(data.publicUrl)
  },[project?.image])
  
  async function updateProjectImageStorage(file) {
    if(!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}.${fileExt}`;
  
    const { data, error } = await supabase.storage
      .from('project_images')
      .update(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
  
    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  
    return data.path;
  }
  
  async function updateProjectImage(imagePath) {
    const { error } = await supabase
      .from('projects')
      .update({ image: imagePath })
      .eq('id', projectId);
  
    if (error) {
      throw new Error(`Error updating project image: ${error.message}`);
    }
  }

  const handleReset = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleSubmit = async (formData) => {
    
    try {
      // Set loading state
      setIsLoading(true);

      const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due_date'),
        status: formData.get('status')
      };

      // Update project data
      await dispatch(updateProject({projectData, projectId})).unwrap();
      
      // Update project contributors
      await dispatch(updateProjectContributors({selectedContributors: formData.getAll('contributors'), projectId})).unwrap();
      
      // Update files if any
      const files = formData.getAll('files');
      if (files.length > 0) {
        await dispatch(updateProjectFiles({files, projectId})).unwrap();
        await dispatch(updateFileMetadata({files, projectId})).unwrap();
      }

      const imagePath = await updateProjectImageStorage(formData.get('image'));
      await updateProjectImage(imagePath);

      // Show success message
      toast({
        title: "Project updated",
        variant: "success",
        description: "Project updated successfully!"
      });

      // Navigate after a short delay to allow user to see the success message
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);

    } catch (error) {
      // Handle errors
      // throw new Error("Error updating project:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while updating the project. Please try again.",
      });
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
};

  const buttons = [
    {
      icon: 'pi pi-times text-gray-500',
      onClick: (fileName) => removeFile(fileName)
    }
  ]

  const removeContributor = (id) => {
    setSelectedContributors((contributors) => contributors.filter(contributor => contributor.id !== id))
    dispatch(deleteProjectContributors(id));
  }

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
      text: 'Edit Project',
      url: '/edit-project/' + projectId,
    },
  ]

  return (
    <div className="px-8 relative">
      <div className='flex justify-between mx-3'>
        <div>
          <h1 className="text-2xl font-medium">Projects</h1>
          <Breadcrumbs links={BreadcrumbLinks}/>
        </div>
      </div>
      <ProjectForm
      image={image}
      project={project}
      buttons={buttons}
      setImage={setImage}
      isLoading={isLoading}
      onSubmit={handleSubmit} 
      cancelProject={handleReset}
      uploadedFiles={uploadedFiles}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles} 
      removeContributor={removeContributor}
      selectedContributors={selectedContributors}
      setSelectedContributors={setSelectedContributors}
      />
    </div>
  )
}

export default AddProject;