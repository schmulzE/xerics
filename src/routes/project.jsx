import supabase from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../features/auth/authThunks';
import Breadcrumbs from '../components/ui/breadcrumbs';
import { fetchProjects } from '../features/projects/projectThunks';
import { setRates, setCounts } from '../features/projects/projectSlice';
import InfiniteScrollWithTab from '../components/ui/infiniteScrollWithTab';
import ProjectStatusOverview from "../features/projects/charts/projectStatusOverview";

const Project = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const loading = useSelector(state => state.project.loading);
  const projects = useSelector(state => state.project.projects);

  const user = useSelector((state) => state.auth.user);
  const projectCounts = useSelector(state => state.project.counts);
  const increaseRates = useSelector(state => state.project.rates);
  
    useEffect(() => {
      dispatch(getUser());
    }, [dispatch])
      
  useEffect(() => {
    if (user?.id) {
      fetchProjects();
      const subscription = supabase
        .channel(`projects:profile_id=eq.${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public' }, fetchProjects)
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

    useEffect(() => {
    const getProjects = async () => {
      const data = await dispatch(fetchProjects()).unwrap();
      updateProjectCounts(data);
    }
    getProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
    const prevCounts = useSelector(state => state.projects?.counts ?? {
      'in progress': 0,
      done: 0,
      'in review': 0,
      todo: 0,
      'total projects': 0
    });
  
  const updateProjectCounts = (projectsData) => {
    const newCounts = projectsData.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      acc['total projects']++;
      return acc;
    }, { 'in progress': 0, done: 0, 'in review': 0, todo: 0, 'total projects': 0 });
  
    const rates = {};
    for (const status in newCounts) {
      const current = newCounts[status];
      const previous = prevCounts[status] ?? 0;
      rates[status] = previous === 0
        ? (current > 0 ? 100 : 0)
        : parseFloat(((current - previous) / previous * 100).toFixed(2));
    }
  
    dispatch(setCounts(newCounts));
    dispatch(setRates(rates));
  };


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
    
  if(projects == null && loading) return (
    <div className='flex justify-center items-center'>
      <span className="pi pi-spin pi-spinner text-5xl"></span> 
    </div>
  )

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
    <div className='lg:px-8 lg:py-2 p-4 pb-16 lg:pb-0'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">Projects</h1>
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
      {/* <ProjectStatusOverview filteredStatus={'total projects'} showIcons={false}/> */}
       <ProjectStatusOverview 
      filteredStatus={'total projects'} 
      projectCounts={projectCounts} 
      increaseRates={increaseRates} 
      showIcons={false}
      />
      <div className='flex flex-col my-8 relative'>
        <InfiniteScrollWithTab/>
      </div>
    </div>
  )
}

export default Project;