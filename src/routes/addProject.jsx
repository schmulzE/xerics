/* eslint-disable no-unused-vars */
import Breadcrumbs from "../components/ui/breadcrumbs";
import ProjectForm from '../features/projects/components/projectForm';
import { useProjectManagement } from '../features/projects/hooks/useProjectManagement';
import { BREADCRUMB_LINKS, FILE_ACTION_BUTTONS } from '../features/projects/constants/projectConstants';

const AddProject = () => {
  const {
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
  } = useProjectManagement();

  const buttons = FILE_ACTION_BUTTONS(removeFile);
  const breadcrumbLinks = BREADCRUMB_LINKS(projectId);

  return (
    <div className="px-2 lg:px-8 lg:py-2 pb-16 lg:pb-0 relative">
      <div className='flex justify-between mx-3'>
        <div>
          <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">Projects</h1>
          <Breadcrumbs links={breadcrumbLinks}/>
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
        errors={formErrors}
      />
    </div>
  );
};

export default AddProject;