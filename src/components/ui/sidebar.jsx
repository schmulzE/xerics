import { Link } from 'react-router-dom';
import { Kanban } from 'lucide-react';
import supabase from '../../lib/supabase';
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useTheme } from '../../../context/themeContext';
import { clearUser } from '../../features/auth/authSlice';

const Sidebar = () => {
  const { theme } =  useTheme();
  const dispatch = useDispatch();

  const links = [
    {
      name:'dashboard',
      icon: 'pi-th-large',
    }, 
    {
      name: 'projects', 
      icon: 'pi-list'
    }, 
    {
      name: 'report and analysis', 
      icon: 'pi-chart-line'
    },
    { 
      name:'calendar', 
      icon: 'pi-calendar'
    },
    {
      name: 'resources', 
      icon: 'pi-folder'
    },
    {
      name: 'settings', 
      icon: 'pi-cog'
    }
  ];

  function replaceSpacesWithHyphen(text) {
    return text.replace(/\s/g, "-");
  }


  const logOut = async() => {
    // eslint-disable-next-line no-unused-vars
    const { error } = await supabase.auth.signOut();
    if(error) {
      throw new Error('An error occured while logging out:', error.message)
    }
    dispatch(clearUser());
  }

  return (
    <>
      <div className='hidden sticky top-0 left-0 h-screen lg:flex flex-col justify-between content-center z-50 w-64 text-center'>
        <div className="mt-4">
        {/* <img src={ theme  === 'dark' ? DarkModeLogo :Logo } className='w-32 py-4 mx-auto'/> */}
        <div className="flex justify-center mx-auto mt-2 mb-6 items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Kanban className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            xerics
          </span>
        </div>
          <ul className="menu w-64 text-gray-500 capitalize space-y-2">
          {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={`/${replaceSpacesWithHyphen(link.name)}`}
                  className={({ isActive }) =>
                    [
                      isActive
                        ? `${
                            theme === 'dark'
                              ? 'bg-[#191E24] hover:bg-[#191E24] text-blue-500 hover:text-blue-500'
                              : 'bg-base-300 hover:bg-base-300 text-blue-500 hover:text-blue-500 '
                          } border-l-4 border-blue-500 bg-base-300 text-blue-500`
                        : `${
                            theme === 'dark'
                              ? 'hover:bg-[#191E24] text-gray-500 hover:text-blue-500'
                              : 'hover:bg-base-100 text-gray-500 hover:text-blue-500'
                          }`,
                      'rounded-none',
                    ].join(' ')
                  }
                >
                  <i className={'pi text-lg block ' + link.icon}></i>
                  {link.name}
                </NavLink>
              </li>
            ))}         
          </ul>
        </div>
        <ul className="menu w-64 rounded-box self-end item-end text-gray-600">
          <li>
            <Link to='/settings'>
            <i className='pi pi-question-circle text-lg block'></i>
            help & support
            </Link>
          </li>
          <li>
            <button onClick={logOut}>
            <i className='pi pi-sign-out text-lg block'></i>
            logout
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar