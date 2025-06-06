/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import supabase from '../lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { getUser } from '../features/auth/authThunks';
import { useTheme } from "../../context/themeContext";
import CardWrapper from "../components/ui/cardWrapper";
import { useSelector, useDispatch } from 'react-redux';
import ProjectCard  from "../features/projects/components/projectCard";
import { setRates, setCounts } from '../features/projects/projectSlice';
import { ProjectRevenue } from "../features/projects/charts/projectRevenue";
import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";
import { DASHBOARD_HEADER } from "../features/dashboard/constants/dashboardConstants";
import { ProjectProgressChart } from "../features/projects/charts/projectProgressChart";
import ProjectStatusOverview from "../features/projects/charts/projectStatusOverview";
import ProjectEventCalendar from "../features/projectEvents/components/projectEventCalendar";

const Dashboard = () => {
  const { theme } = useTheme();
  const {
    projects,
    events,
    recentProjectImage,
    getProjectsByStatus,
    calculateProgress,
    handleCreateEvent,
    handleDeleteEvent,
  } = useDashboardData();

  const { toast } = useToast()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const recentProject = projects[projects.length - 1];
  const { 
    finishedProjects, 
    inProgressProjects, 
    unfinishedProjects 
  } = getProjectsByStatus();

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
    
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
  
      if (error) {
        toast({
          variant: 'destructive', 
          description: `Error fetching projects. Please try again!`
        });
      } else if (data) {
        updateProjectCounts(data);
      }
    };

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


  return (
    <div className="px-4 lg:px-8 pb-24 lg:pb-8">
      <div className="flex justify-between items-center mb-4 lg:mb-0">
        <div>
          <h1 className="text-2xl font-semibold lg:text-3xl lg:font-bold">{DASHBOARD_HEADER.title}</h1>
          <p className="my-2">{DASHBOARD_HEADER.description}</p>
        </div>
      </div>

      <ProjectStatusOverview 
      filteredStatus={'todo'} 
      projectCounts={projectCounts} 
      increaseRates={increaseRates} 
      />
      
      <div className="flex lg:gap-8 gap-6 flex-wrap lg:flex-nowrap">
        <ProjectRevenue />
        <ProjectProgressChart 
          finishedProjects={finishedProjects}
          projectsInProgress={inProgressProjects}
          projectsUnfinished={unfinishedProjects}
        />
      </div>

      <div className="mt-8 flex flex-wrap lg:flex-nowrap lg:gap-8 gap-6">
        <CardWrapper 
          title="Recent Project" 
          containerClass={'lg:w-1/2 w-full'}
        >
          {recentProject ? (
            <ProjectCard 
              name={recentProject.name} 
              status={recentProject.status} 
              classes={'border border-base-300 p-2'}
              description={recentProject.description}
              imagePath={recentProjectImage}
              statusClass={'mt-2 mr-2'}
              id={recentProject.id}
              progressValue={calculateProgress(recentProject)}
            />
          ) : (
            <div className="flex justify-center content-center h-full">
              <p className="m-auto">No recent project</p>
            </div>
          )}
        </CardWrapper>

        <CardWrapper 
          title="Daily activities" 
          icon="pi-ellipsis-v" 
          containerClass={'lg:w-1/2 w-full h-60 overflow-auto'}
        >
          <ProjectEventCalendar 
            showEvent={false} 
            events={events} 
            onAddEvent={handleCreateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </CardWrapper>
      </div>
    </div>
  );
};

export default Dashboard;