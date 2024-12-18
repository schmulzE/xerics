/* eslint-disable no-unused-vars */
import { convert } from 'html-to-text';
import ProjectComments from './projectComments';
import ProjectTimeline from './projectTimeline';
import CardWrapper from '../../../components/ui/cardWrapper';
import ProjectFileList from '../../projectsFiles/components/projectFileList';
import ProjectBudget from '../../projectsTransactions/components/projectBudget';
const ProjectOverview = ({ 
  project, 
  projectFiles, 
  filesLoadingState,
  handleToggleModal, 
  removeFileConfirmation, 
  downloadFile,
  selectedFiles,
  setSelectedFiles,
  user,
  projectContributors
}) => {

  const buttons = [
    {icon: 'pi pi-upload text-gray-500', class: 'btn-sm btn-ghost btn-circle' , onClick: (data) => downloadFile(data)},
    {icon: 'pi pi-trash text-gray-500', class: 'btn-sm btn-ghost btn-circle', openModal:() => removeFileConfirmation()}
  ]
  const options = {
    wordwrap: 130,
    // ...
  };
  const html = '<ol><li>hello</li></ol>';
  const text = convert(html, options);

  return (
    <>
      <div className="grid lg:grid-flow-col grid-cols-1 lg:grid-cols-12 lg:gap-x-4 my-4">
        <div className="col-span-8 p-2 h-auto space-y-8">
          <div className='bg-base-100'>
            <CardWrapper title={'About Project'} containerClass="p-4 rounded-md capitalize">
              <p className="text-sm lowercase">{project.description}</p>
            </CardWrapper>
            <CardWrapper title={'Attachment'} icon={selectedFiles.length != 0 ? 'pi-trash': ''} containerClass="my-2 font-medium w-full">
              <ProjectFileList 
                buttons={buttons} 
                files={projectFiles} 
                icon={'pi pi-ellipsis-v'}
                loading={filesLoadingState}
                selectedFiles={selectedFiles} 
                setSelectedFiles={setSelectedFiles}
                projectContributors={projectContributors}
              />
            </CardWrapper>
          </div>
          <ProjectTimeline/>
        </div>
        <div className="col-span-8 lg:col-span-4 p-2 w-full lg:max-w-lg space-y-8">
          <ProjectBudget handleToggleModal={handleToggleModal} user={user} projectContributors={projectContributors}/>
          <ProjectComments/>
        </div>
      </div>
    </>
  )
}

export default ProjectOverview
