import Editor from "./projectDescriptionEditor/editor";
import ProjectImageUploader from "./projectImageUploader";
import CardWrapper from "../../../components/ui/cardWrapper";
import ProjectFileUpload from "../../projectsFiles/components/projectFileUpload";
import ContributorSelector from '../../projectsContributors/components/contributorSelector';


const ProjectForm = ({ 
  onSubmit, 
  isLoading, 
  project, 
  cancelProject, 
  selectedContributors, 
  setSelectedContributors, 
  removeContributor,
  selectedFiles,
  setSelectedFiles,
  buttons,
  image,
  setImage,
  uploadedFiles,
  setUploadedFiles,
  removeFile,
  setContent,
  content
}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (image) {
      formData.append('image', image);
    }
    if (selectedContributors.length > 0 ) {
      const contributors = selectedContributors.map(contributor => contributor.id);
      formData.append('contributors', contributors);
    }
    if (content) {
      formData.append('description', content);
    }
    onSubmit(formData);
  };



  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-flow-col lg:grid-cols-12 lg:gap-x-4 my-8">
    <div className="lg:col-span-8 p-2 h-auto space-y-4 lg:space-y-8">
      <CardWrapper title="Recent Project" classes={'w-full'}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-xs">Project name</span>
          </div>

          <input 
          type="text" 
          id="name" 
          name="name" 
          defaultValue={project?.name}
          placeholder="Type project title here" 
          className="input input-sm w-full bg-base-200" 
          required
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-xs">Description</span>
          </div>
          <Editor content={content} setContent={setContent}/>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-xs">Due Date</span>
          </div>
            <input 
            type="date" 
            placeholder="Type project title here" 
            name="due_date"
            defaultValue={project?.due_date}
            className="w-full input input-sm  bg-base-200" 
            />
        </label>
      </CardWrapper>

      <ProjectFileUpload 
      buttons={buttons}
      removeFile={removeFile} 
      selectedFiles={selectedFiles} 
      uploadedFiles={uploadedFiles} 
      setUploadedFiles={setUploadedFiles}
      setSelectedFiles={setSelectedFiles} 
      />
      
      <CardWrapper title="Add Contributors" classes={'w-full'}>
        <div className="border border-base-300 p-4">
          <ContributorSelector 
          selected={selectedContributors} 
          setSelected={setSelectedContributors} 
          removeContributor={removeContributor}
          />
        </div>
      </CardWrapper>
    </div>
    <div className="lg:col-span-4 p-2 max-w-lg space-y-4">
      <ProjectImageUploader onImageChange={setImage}/>
      
      <CardWrapper title="Select Status" classes={'w-full'}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-xs">Project status</span>
          </div>
          <select 
          name="status" 
          required 
          className="select select-bordered select-sm"
          >
            <option disabled defaultValue={project?.status}></option>
            <option value={'todo'}>Todo</option>
            <option value={'in progress'}>In Progress</option>
            <option value={'in review'}>In Review</option>
            <option value={'done'}>Done</option>
          </select>
        </label>
      </CardWrapper>
    </div>
    <div className="space-x-2 mt-2 lg:mt-0 relative flex justify-end lg:absolute lg:top-0 lg:right-10">
      <button 
      type='button' 
      onClick={cancelProject} 
      className='btn lg:btn-sm bg-base-100 align-middle rounded-md border capitalize font-normal border-gray-300 btn-md'
      >
        <span>Cancel</span>
      </button>
      <button 
      disabled={isLoading} 
      type="submit"
      className='btn lg:btn-sm btn-md bg-blue-600 text-white hover:bg-blue-700 hover:text-white capitalize font-normal disabled:bg-slate-600 disabled:text-white'
      >
        {isLoading && <i className='pi pi-spin pi-spinner'></i>}
        <span>add project</span>
      </button>
    </div>
  </form>
  )
}

export default ProjectForm
