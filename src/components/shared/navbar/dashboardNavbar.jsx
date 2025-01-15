import { Link } from 'react-router-dom';
import supabase from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import Notifications from '../notifications.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../features/auth/authThunks.js';
import { useTheme } from "../../../../context/themeContext";
import { clearUser } from '../../../features/auth/authSlice';
import Modal from '../../../features/modal/components/modal';
import Avatar from '../../../features/users/components/avatar';
import { openModal } from '../../../features/modal/modalSlice.js';
import { fetchUserProfile } from '../../../features/users/usersThunks';

const DashboardNavbar = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const profile = useSelector(state => state.user.selectedUser);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const isOpen = useSelector((state) => state.modal.modals?.['notifications']?.isOpen);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if(user) {
      dispatch(fetchUserProfile(user.id))
    }
  }, [dispatch, user])

  useEffect(() => {
    // check localStorage on component mount;
    const storedFlag = localStorage.getItem('hasNewNotification');
    if (storedFlag) {
      setHasNewNotification(JSON.parse(storedFlag));
    }
  }, []);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const { data } = await supabase
        .from('notifications')
        .select()
        .eq('profile_id', profile.id);

        setNotifications(data);

      } catch (error) {
        throw new Error(error.message);
      }
    }
    getNotifications();
  }, [profile.id]);

  useEffect(() => {
    const subscription =  supabase
       .channel(`notifications:profile_id=eq.${user.id}`)
       .on('postgres_changes',
       {
         event: 'INSERT',
         schema: 'public',
       }, (payload) =>  {
        setNotifications(current => [...current, payload.new]);
        const newHasNewNotification = payload.new.length > 0;
        setHasNewNotification(newHasNewNotification);
        localStorage.setItem('hasNewNotification', JSON.stringify(newHasNewNotification));
       })
       .subscribe()
 
     return () => supabase.removeChannel(subscription)
   }, [user.id]);

   const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      throw new Error('Error marking notification as read:', error);
    } else {
      setNotifications(current =>
        current.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const logOut = async() => {
    // eslint-disable-next-line no-unused-vars
    const { error } = await supabase.auth.signOut()
    if(error) {
      throw new Error('Error logging out:', error.message);
    }
    dispatch(clearUser());
  }

  const renderNotifications = (contentProps) => (
    <Notifications {...contentProps}/>
  )
  
  return (
    <>
      <div className="navbar px-4">
        <div className="navbar-start">
          <Link to={'/settings'} className='block lg:hidden'>
            <i className='pi pi-cog text-xl'></i>
          </Link>
        </div>
        <div className="navbar-end gap-x-3">
          <button 
          type="button" 
          className="z-[1000] relative"
          onClick={() => dispatch(openModal({
            id: 'notifications',
            title: 'Notifications',
            contentType: 'Notifications',
            contentProps: {
              notifications,
              markAsRead
            }
          }))}>
            {hasNewNotification ? <span className="h-2 w-2 bg-red-600 absolute right-0 rounded-full"></span> : null}
            <i className="pi pi-bell text-xl"></i>
          </button>
          <ul className="menu menu-horizontal px-1 z-50">
            <li className="lg:mr-8 mr-16">
              <details>
                <summary>
                  <Avatar avatar={profile?.avatar_url} firstname={profile.firstname} className={'w-6 text-xs'} backgroundClass={'p-1'}/>
                  <span className='capitalize lg:block'>{ profile.firstname } { profile.lastname }</span>
                </summary>
                <ul className="p-1 rounded-sm lg:w-48 w-44">
                  <li>
                    <button onClick={toggleTheme}>
                      {theme === 'dark' ? <i className='pi pi-sun'></i>: <i className='pi pi-moon'></i>}
                      {theme === 'dark' ? 'light theme' : 'dark theme'}
                    </button>
                  </li>
                  <li>
                    <a onClick={logOut}><span className="pi pi-sign-out text-lg"></span>Sign out</a>    
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      { isOpen && (
        <Modal 
        id='notifications'
        renderContent={renderNotifications}
        titleClass={'text-sm p-2'} 
        modalClass={'w-72 min-w-xl h-fit fixed top-56 -right-12 lg:top-56 lg:-right-4 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'}
        />
      )}
    </>
  )
}

export default DashboardNavbar