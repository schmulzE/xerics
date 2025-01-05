import supabase from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../components/ui/breadcrumbs';
import { fetchProjects } from '../features/projects/projectThunks';
import InfiniteScrollWithTab from '../components/ui/infiniteScrollWithTab';
import ProjectStatusOverview from "../features/projects/charts/projectStatusOverview";

const Project = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const loading = useSelector(state => state.project.loading);
  const projects = useSelector(state => state.project.projects);


  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.rpc('create_project').maybeSingle()
      
      if (error) {
        toast({
          variant : 'destructive', 
          description : `An error occured: ${error.message}`
        })
        return
      }

      if (data) {
        setIsLoading(false)
        navigate(`/add-project/${data.id}`)
      }
    } catch (error) {
      throw new Error(error);
    }
  }
    
  if(projects == null && loading) return <div className='flex justify-center items-center'><span className="pi pi-spin pi-spinner text-5xl"></span> </div>

  const BreadcrumbLinks = [
    {
      text: 'Dashboard',
      url: '/dashboard',
    },
    {
      text: 'Project Lists',
      url: '/projects',
    }
  ]

  return (
    <div className='lg:p-8 p-4 pb-16 lg:pb-0'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className="text-3xl font-medium">Projects</h1>
          <Breadcrumbs links={BreadcrumbLinks}/>
        </div>
        <div>
          <button 
          disabled={isLoading} 
          onClick={handleCreateProject} 
          className='btn-sm btn hidden lg:block space-x-1 bg-blue-600 text-white hover:bg-blue-700 hover:text-white capitalize font-normal disabled:bg-slate-600 disabled:text-white'
          >
           {isLoading ? <i className='pi pi-spin pi-spinner'></i> : <i className='pi pi-plus'></i>}
            <span>add project</span>
          </button>
        </div>
      </div>
      <ProjectStatusOverview filteredStatus={'total projects'} showIcons={false}/>
      <div className='flex flex-col my-8 relative'>
        <InfiniteScrollWithTab/>
      </div>
    </div>
  )
}

export default Project;