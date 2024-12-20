import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../modal/modalSlice';

const UserProfileForm = ({ id, profile, updateUserProfile }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
   
  const cancelProfileUpdate = () => {
    dispatch(closeModal( { id }))
  }

  const submitUserProfile = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const { firstname, lastname, bio } = Object.fromEntries(new FormData(form));
    if( typeof firstname === 'string' && firstname.trim().length !== 0  && typeof lastname === 'string' && lastname.trim().length !== 0) {
      setTimeout(() => {
        updateUserProfile({firstname, lastname, bio});
        setIsLoading(false);
        dispatch(closeModal({ id }))
      }, 2000)
    }
  }

  return (
    <form className='p-2 w-80 bg-base-100' onSubmit={submitUserProfile}>
       <div className='flex justify-between flex-wrap'>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">First Name</span>
          </div>
          <input 
          type="text"
          name='firstname'
          defaultValue={profile.firstname}
          className="input input-bordered w-full max-w-xs"
          required
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Last Name</span>
          </div>
          <input 
          type="text" 
          name='lastname'
          defaultValue={profile.lastname}
          className="input input-bordered w-full max-w-xs"
          required 
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Bio</span>
          </div>
          <input 
          type="text"
          name='bio'
          defaultValue={profile.bio}
          className="input input-bordered w-full"
          required
          />
        </label>
      </div>
      <div className='flex items-center mt-4 justify-end'>
        <button disabled={isLoading} type="submit" className='btn bg-base-300 uppercase p-2 ml-2'>
        {isLoading ? <span className="pi pi-spinner pi-spin block px-4 text-lg"></span> : <span>submit</span>}
        </button>
        <button onClick={cancelProfileUpdate} type="button" className='btn uppercase btn-info text-base-content p-2 ml-2'>
          cancel
        </button>
      </div>
    </form>
  )
}

export default UserProfileForm
