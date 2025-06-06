import { useSelector, useDispatch } from 'react-redux';
import CardWrapper from '../components/ui/cardWrapper';
import { useSettings } from '../hooks/useSettings.js';
import Modal from '../features/modal/components/modal.jsx';
import { openModal } from '../features/modal/modalSlice.js';
import Avatar from '../features/users/components/avatar.jsx';
import { useThemeSettings } from '../hooks/useThemeSettings';
import UserProfileForm from '../features/users/components/userProfileForm.jsx';

const Settings = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.modals['profile']?.isOpen);
  
  const {
    state: { user, profile },
    actions: { handleFileChange, updateUserProfileHandler }
  } = useSettings();

  const {
    theme,
    handleThemeChange
  } = useThemeSettings();

  const renderProfile = (contentProps) => (
    <UserProfileForm 
      {...contentProps} 
      profile={profile}
      updateUserProfile={updateUserProfileHandler}
    />
  );
  
  return (
    <>
    <div className="px-4 lg:px-8 pb-24 lg:pb-8">
      <h1 className="capitalize text-2xl lg:text-3xl mb-4 font-medium lg:font-bold">settings</h1>
      <div className='grid grid-col-1 lg:grid-cols-3 gap-4 lg:gap-8'>
        <CardWrapper
        containerClass={'lg:col-span-2'}
        title={'General Settings'}
        titleClass={'text-xl font-semibold'}
        subtitle={'update your contact and how people can contact you down below'}
        subtitleClass={'lowercase text-sm'}
        >
          <hr className='block mt-4'/>
          <div className='flex my-6 items-center gap-3'>
            <Avatar avatar={profile.avatar_url} firstname={profile.firstname} className={'w-14'} backgroundClass={'p-4'}/>
            <div className='flex-1'>
              <p>{profile?.firstname} {profile?.lastname}</p>
              <p className='text-xs text-gray-400'>{profile.bio}</p>
              <p className='text-xs text-gray-400'>{profile.email}</p>
            </div>
            <label htmlFor='avatar' className='text-sm text-blue-400 cursor-pointer'>Edit</label>
            <input type="file" id='avatar' className='w-0 h-0' onChange={handleFileChange} accept="image/*" />
          </div> 
          <div className='my-6'>
            <div className='flex justify-between items-center'>
              <h1 className='text-lg font-semibold'>Profile details</h1>
              <button className='btn-ghost text-blue-400 btn-sm hover:bg-transparent' onClick={() => dispatch(openModal({
                id: 'profile',
                title: 'Update Profile',
                contentProps: {
                  id: 'profile',
                  theme
                }
              }))}
              >Edit</button>
            </div>
            <div className='flex justify-between flex-wrap'>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input type="text" placeholder="Type here" defaultValue={profile.firstname} className="input input-bordered text-base-content w-full max-w-xs" disabled/>
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input type="text" placeholder="Type here" defaultValue={profile.lastname} className="input input-bordered text-base-content w-full max-w-xs" disabled/>
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Email address</span>
                </div>
                <input type="text" placeholder="Type here" defaultValue={user.email} className="input input-bordered w-full text-base-content" disabled/>
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Bio</span>
                </div>
                <input type="text" placeholder="Type here" defaultValue={profile.bio} className="input input-bordered text-base-content w-full" disabled/>
              </label>
            </div>
          </div>
          <div className='my-8'>
            <h1 className='text-lg font-semibold capitalize'>languages</h1>
            <div className='flex justify-between my-2 items-center'>
              <p className='text-sm'>English</p>
              <button className='btn-outline p-1 btn-ghost btn-sm hover:bg-transparent border-gray-400 text-gray-500 hover:text-black hover:border-gray-400'>Change</button>
            </div>
          </div>
          <div className='my-8'>
            <h1 className='text-lg font-semibold capitalize'>app appearance</h1>
            <div className='flex'>
              <label className="label cursor-pointer">
                <input 
                type="radio" 
                name="radio-10" 
                className="radio radio-xs checked:radio-info" 
                value="light"
                checked={theme === 'light'}
                onChange={handleThemeChange}
                />
                <span className="label-text mx-2">light mode</span> 
              </label>
              <label className="label cursor-pointer">
                <input 
                type="radio" 
                name="radio-10" 
                className="radio radio-xs checked:radio-info" 
                value="dark"
                checked={theme === 'dark'}
                onChange={handleThemeChange}
                />
                <span className="label-text mx-2">dark mode</span> 
              </label>
              <label className="label cursor-pointer">
                <input 
                type="radio" 
                name="radio-10" 
                className="radio radio-xs checked:radio-info"
                value="system"
                checked={theme === 'system'}
                onChange={handleThemeChange}
                />
                <span className="label-text mx-2">system preference</span> 
              </label>
            </div>
          </div>
        </CardWrapper>
        <CardWrapper
        containerClass={'h-fit text-sm'}
        >
          <h2 className='text-base font-medium'>Help and Support</h2>
          <div className='my-2'>
            <p>looking for something else?</p>
            <a className='text-info text-xs'>Learn more</a>
          </div>
          <div>
            <h2 className='text-base font-medium'>Need something else?</h2>
            <a className='text-info text-xs inline-block my-1.5'>contact support</a>
          </div>
        </CardWrapper>
       </div>
    </div>

      { isOpen && (
        <Modal 
        id='profile'
        renderContent={renderProfile}
        titleClass={'text-lg font-semibold py-2'} 
        modalClass={'max-w-2xl h-auto p-4 rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'}
        />
      )}
    
    </>
  )
}

export default Settings;