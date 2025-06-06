/* eslint-disable no-unused-vars */
import Breadcrumbs from '../components/ui/breadcrumbs';
import ProjectForm from '../features/projects/components/projectForm';
import { useProjectManagement } from '../features/projects/hooks/useProjectManagement';

const EditProjectPage = () => {
  const {
    image,
    project,
    isLoading,
    uploadedFiles,
    selectedFiles,
    selectedContributors,
    setImage,
    setSelectedFiles,
    setSelectedContributors,
    removeFile,
    removeContributor,
    handleSubmit,
    handleReset
  } = useProjectManagement();

  const buttons = [{
    icon: 'pi pi-times text-gray-500',
    onClick: (fileName) => removeFile(fileName)
  }];

  const breadcrumbLinks = [
    { text: 'Dashboard', url: '/dashboard' },
    { text: 'Project Lists', url: '/projects' },
    { text: 'Edit Project', url: `/edit-project/${project.id}` }
  ];

  return (
    <div className="px-8 lg:py-2 relative">
      <div className='flex justify-between mx-3'>
        <div>
          <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">Projects</h1>
          <Breadcrumbs links={breadcrumbLinks}/>
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
  );
};

export default EditProjectPage;