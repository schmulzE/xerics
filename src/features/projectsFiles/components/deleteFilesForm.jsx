import { useDispatch } from 'react-redux';
import { closeModal } from '../../modal/modalSlice.js';

const DeleteFilesForm = ({ id, file, removeFile, isLoading }) => {
  const dispatch = useDispatch();

  const deleteFileHandler = async (e) => {
    e.preventDefault();
    
    await removeFile(file);
    dispatch(closeModal({id}));
  }

  return (
    <form onSubmit={deleteFileHandler}>
      <p className='my-4'>Are you sure you want to delete this file!</p>
      <div className='flex justify-end gap-x-2'>
        <button type="submit" className='btn btn-sm rounded-md flex justify-center items-center'>
          {isLoading && <span className='pi pi-spin pi-spinner text-lg'></span>}
          confirm
        </button>
        <button type="button" className='btn btn-error btn-sm rounded-md' onClick={() => dispatch(closeModal({id}))}>cancel</button>
      </div>
    </form>
  )  
}

export default DeleteFilesForm;
