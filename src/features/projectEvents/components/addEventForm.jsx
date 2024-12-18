import { useDispatch } from 'react-redux';
import { closeModal } from '../../modal/modalSlice.js';


const AddEventForm = ({handleSubmit, selected, id}) => {
  const dispatch = useDispatch();
  return (
  <form onSubmit={handleSubmit} className="p-4 space-y-4">
    <input type='text' name="title" placeholder='type your title...' className="w-full input input-bordered"/>
    <textarea className="textarea textarea-bordered w-full" name="description" placeholder="type your description..."></textarea>
    <input type="date" defaultValue={selected.startStr} className="w-full input input-bordered"/>
    <div className="space-x-4">
      <button type="submit" className="btn">submit</button>
      <button type="button" className="btn btn-error" onClick={() => dispatch(closeModal({id}))}>cancel</button>
    </div>
  </form>
  )
}

export default AddEventForm;
