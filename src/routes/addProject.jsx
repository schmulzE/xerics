/* eslint-disable no-unused-vars */
import { useState } from "react";
import supabase from '../lib/supabase';
import { useDispatch } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import Breadcrumbs from "../components/ui/breadcrumbs";
import { useParams,useNavigate } from 'react-router-dom';
import ProjectForm from '../features/projects/components/projectForm';
import { createProject, deleteProject } from '../features/projects/projectThunks';
import { addProjectFiles, storeFileMetadata } from '../features/projectsFiles/projectFilesThunks';
import { addProjectContributor } from '../features/projectsContributors/projectContributorThunks';


const AddProject = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { projectId } = useParams();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  
  const removeFile = (itemToRemove) => {
    const filteredItems = uploadedFiles.filter(item => item.name !== itemToRemove.name);
    setUploadedFiles(filteredItems);
  }

  const buttons = [
    {
      icon: 'pi pi-times text-gray-500',
      onClick: (fileName) => removeFile(fileName)
    }
  ]

  const removeContributor = (id) => {
    setSelectedContributors((contributors) => contributors.filter(contributor => contributor.id !== id))
  }

  const cancelProject = () => {
    dispatch(deleteProject(projectId));
    navigate(`/projects`);
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {

      
      const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due_date'),
        status: formData.get('status'),
      };
      
      await dispatch(createProject({projectData, projectId})).unwrap();
      await dispatch(addProjectContributor({selectedContributors: formData.getAll('contributors'), projectId})).unwrap();
      
      const files = formData.getAll('files');
      if (files.length > 0) {
        await dispatch(addProjectFiles({files, projectId})).unwrap();
        await dispatch(storeFileMetadata({files, projectId})).unwrap();
      }

      const imagePath = await uploadImageToStorage(formData.get('image'));
      await updateProjectImage(imagePath);

      toast({
        title: "Project created",
        variant: "success",
        description: "Your project has been created successfully.",
      });

      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);

    } catch (error) {
      // console.error("Error creating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the project. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadImageToStorage(file) {
    if(!file) return null;

    const fileExt = file?.name?.split('.').pop();
    const fileName = `${projectId}.${fileExt}`;
  
    const { data, error } = await supabase.storage
      .from('project_images')
      .upload(fileName, file);
  
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
    
    toast({
      variant: "success",
      description: "Project image updated successfully!"
    });
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
      text: 'Add Project',
      url: '/add-project/' + projectId,
    },
  ]

  return (
    <div className="px-2 lg:px-8 pb-16 lg:pb-0 relative">
      <div className='flex justify-between mx-3'>
        <div>
          <h1 className="text-2xl font-medium">Projects</h1>
          <Breadcrumbs links={BreadcrumbLinks}/>
        </div>
      </div>
      <ProjectForm
      image={image}
      buttons={buttons}
      content={content}
      setImage={setImage}
      isLoading={isLoading} 
      setContent={setContent}
      onSubmit={handleSubmit} 
      cancelProject={cancelProject}
      selectedFiles={selectedFiles}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      setSelectedFiles={setSelectedFiles} 
      removeContributor={removeContributor}
      selectedContributors={selectedContributors}
      setSelectedContributors={setSelectedContributors}
      />
    </div>
  )
}

export default AddProject;