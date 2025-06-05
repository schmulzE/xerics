import supabase from '../../../lib/supabase';
import { NavLink, } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '../../../../context/themeContext';


const replaceSpacesWithHyphen = (text) => text.replace(/\s/g, "-");

const DashboardFooter = () => {
  const { toast } = useToast();
  const { theme } =  useTheme();
  const navigate = useNavigate();
  
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
      name: 'add project', 
      icon: 'pi-plus'
    },
    {
      name: 'report and analysis', 
      icon: 'pi-chart-line'
    },
    { 
      name:'calendar', 
      icon: 'pi-calendar'
    },
  ];


  const handleCreateProject = async () => {
    try {
      const { data } = await supabase.rpc('create_project').maybeSingle();

      if (data) {
        navigate(`/add-project/${data.id}`)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while creating the project.',
      })
    }
  }

  return (
    <>
      <div className='lg:hidden bg-base-100 fixed h-18 bottom-0 right-0 block z-50 w-full'>
        <ul className="text-gray-500 capitalize space-y-2 p-4 flex justify-between items-center w-full">
          {links.map((link, index) => (
            <li key={index} className=''>
              {link.name === 'add project' ? (
                <button 
                  onClick={handleCreateProject}
                  className={`
                    ${
                      theme === 'dark'
                        ? 'hover:bg-[#191E24] text-gray-500 hover:text-blue-500'
                        : 'text-gray-500 hover:text-blue-500'
                    }
                    rounded-full
                  `}
                >
                  <i className={'pi text-xl block ' + link.icon}></i>
                </button>
              ) : (
                <NavLink
                  to={`/${replaceSpacesWithHyphen(link.name)}`}
                  className={({ isActive }) =>
                    [
                      isActive
                        ? `${
                            theme === 'dark'
                              ? 'bg-[#191E24] hover:bg-[#191E24] text-blue-500 hover:text-blue-500'
                              : '  text-blue-500 hover:text-blue-500 '
                          } text-blue-500 p-2`
                        : `${
                            theme === 'dark'
                              ? 'hover:bg-[#191E24] text-gray-500 hover:text-blue-500'
                              : ' text-gray-500 hover:text-blue-500'
                          }`,
                      'rounded-ful',
                    ].join(' ')
                  }
                >
                  <i className={'pi text-xl block ' + link.icon}></i>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default DashboardFooter;