import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  {getUser} from '../features/auth/authThunks';

const DashboardNavbar = () => {
  const [username, setUsername] = useState('')
 const dispatch = useDispatch();
 const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if(user) {
      let username = user.user_metadata.username;
      setUsername(username)
    }
  }, [user])

  
  return (
    <div className="navbar px-4">
      <div className="navbar-start"></div>
      <div className="navbar-end gap-x-3">
        <button type="button" className="">
          <i className="pi pi-bell"></i>
        </button>
        <ul className="menu menu-horizontal px-1 z-50">
          <li className="mr-8">
            <details>
              <summary>
                <div className="avatar">
                  <div>
                    <span className="pi pi-user w-6 h-6"></span>
                  </div>
                </div>
                <span className="">{ username }</span>
              </summary>
              <ul className="p-1 rounded-sm w-40">
                <li>
                  <a className="flex justify-between">
                    <span>Dark mode</span>
                    <input type="checkbox" className="toggle toggle-sm" id='toggle'/>
                  </a> 
                </li>
                <li>
                  <a><span className="pi pi-sign-out text-lg"></span>Sign out</a>    
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DashboardNavbar