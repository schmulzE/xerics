import { useDispatch } from 'react-redux';
import { closeModal } from '../../modal/modalSlice.js';

const AddProjectFilesForm = ({ submitUploadedFiles, uploadFiles, isLoading, id, projects }) => {
  const dispatch = useDispatch();
  return (
    <form onSubmit={submitUploadedFiles} className='bg-base-100'>
      <label className="form-control w-64">
        <div className="label">
          <span className="label-text text-xs">Files</span>
        </div>
        <div className="label">
        <input type="file" name="uploadedFiles" multiple onChange={uploadFiles} className="hidden bg-base-200" />
          <span
          className="label-text-alt text-md btn-ghost text-blue-600 bg-blue-200 p-1 hover:bg-blue-200 rounded-md cursor-pointer"
          >
            Add Files
          </span>
        </div>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text text-xs">Select projects</span>
        </div>
        <select name="projectId" className="select select-bordered select-sm">
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </label>
      <div className='flex justify-end gap-x-2 mt-4'>
        <button type="button" className='btn btn-sm rounded-md' onClick={() => dispatch(closeModal({id}))}>cancel</button>
        <button type="submit" className='btn bg-blue-600 hover:bg-blue-700 text-white btn-sm rounded-md flex justify-center items-center'>
          {isLoading && <span className='pi pi-spin pi-spinner text-lg'></span>}
          confirm
        </button>
      </div>
    </form>
  )
}

export default AddProjectFilesForm
