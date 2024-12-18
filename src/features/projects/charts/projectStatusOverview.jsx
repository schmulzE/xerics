import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { getUser } from '../../auth/authThunks';
import { useToast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from "../../../../context/themeContext";
import CardWrapper from "../../../components/ui/cardWrapper";

function ProjectStatusOverview({ filteredStatus, showIcons = true }) {
  const { toast } = useToast()
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [projectCounts, setProjectCounts] = useState({
    'in progress': 0,
    done: 0,
    'in review': 0,
    todo: 0,
    'total projects': 0
  });

  const [increaseRates, setIncreaseRates] = useState({
    'in progress': 0,
    done: 0,
    'in review': 0,
    todo: 0,
    'total projects': 0
  });

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

  const updateProjectCounts = (projectsData) => {
    const newCounts = projectsData.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      acc['total projects']++;
      return acc;
    }, { 'in progress': 0, done: 0, 'in review': 0, todo: 0, 'total projects': 0 });

    setProjectCounts(prevCounts => {
      const rates = {};
      for (const status in newCounts) {
        const currentCount = newCounts[status];
        const previousCount = prevCounts[status];
        rates[status] = previousCount === 0
          ? (currentCount > 0 ? 100 : 0)
          : parseFloat(((currentCount - previousCount) / previousCount * 100).toFixed(2));
      }
      setIncreaseRates(rates);
      return newCounts;
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      'total projects': 'pi-book text-blue-400',
      'in review': 'pi-stopwatch text-red-400',
      'done': 'pi-check-circle text-green-400',
      'todo': 'pi-list text-gray-400',
      'in progress': 'pi-sync text-orange-400'
    };

    return [{
      icon: `pi ${icons[status]}`,
      class: `${theme === 'light' ? `bg-${status.split(' ')[0]}-50` : 'bg-[#191E24]'} py-1 px-2 rounded-sm`
    }];
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(projectCounts)
        .filter(([status]) => status.toLowerCase() != filteredStatus)
        .map(([status, count]) => (
          <li key={status}>
            <CardWrapper 
              subtitle={status} 
              containerClass="w-full capitalize h-40 lg:h-auto"
              text={count.toString()}
              buttons={showIcons ? getStatusIcon(status) : undefined}
            >
              <span className="text-sm text-muted-foreground">
                {increaseRates[status] > 0 ? '+' : ''}{increaseRates[status]}% increase
              </span>
            </CardWrapper>
          </li>
        ))}
    </ul>
  );
}

export default ProjectStatusOverview;