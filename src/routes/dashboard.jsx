/* eslint-disable no-unused-vars */
import supabase from "../lib/supabase";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/themeContext";
import { getUser } from "../features/auth/authThunks";
import { useSelector, useDispatch } from 'react-redux';
import CardWrapper from "../components/ui//cardWrapper";
import { fetchBoards } from "../features/boards/boardsSlice";
import { fetchProjects } from "../features/projects/projectThunks";
import ProjectStats from "../features/projects/charts/projectStats";
import ProjectCard from "../features/projects/components/projectCard";
import { ProjectProgressChart } from "../features/projects/charts/projectProgressChart";
import { ProjectRevenue } from "../features/projects/charts/projectRevenue";
import { ProjectEventCalendar } from "../features/projectEvents/components/projectEventCalendar";


const Dashboard = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [image, setImage] = useState();
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const boards = useSelector(state => state.board.boards);
  const projects = useSelector(state => state.project.projects);

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    // Fetch initial events
    fetchEvents();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`events`)
      .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
      }, (payload) => {
        fetchEvents();
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error('Error fetching events:', error);
    } else {
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        date: event.due_date.split('T')[0], // Just take the date part
      }));
      setEvents(formattedEvents);
    }
  };

  const createEvent = async (title, description, dueDate) => {
    const { error } = await supabase
      .from('events')
      .insert([
        { title, description, due_date: dueDate, user_id: user.id }
      ]);

    if (error) {
      throw new Error('Error creating event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);


    if (error) {
      throw new Error('Error deleting event:', error);
    }
  };

  const recentProjects =  projects[projects.length - 1];

  const fetchBoardsAndProjects = async (dispatch) => {
    await dispatch(fetchBoards());
    await dispatch(fetchProjects());
  }

  useEffect(() => {
    fetchBoardsAndProjects(dispatch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  
  const finishedProjects = projects.filter(project => {
    if(project != null) {
      project.status == 'Done'
    }
  });

  const projectsInProgress = projects.filter(project => {
    if(project != null) {
      project.status == 'In Progress'
    }
  })

  const projectsUnfinished = projects.filter(project => {
    if(project != null ){
      project.status == 'In Review' && project.status == 'Todo'
    }
  })

  
  const calculateProgressValue = (project) => {
    const board = boards.find(board => board.title === 'Done');
    const completedTasks = board ? project.tasks.filter(task => task.board_id === board.id) : [];
    const totalTasks = project.tasks.length;
    return totalTasks > 0 ? Math.floor((completedTasks.length / totalTasks) * 100) : 0;
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    const { data } = supabase.storage.from('project_images').getPublicUrl(recentProjects?.image)
    setImage(data.publicUrl)
  },[recentProjects?.image])

  return (
    <div className="px-4 lg:px-8 pb-24 lg:pb-8">
      <div className="flex justify-between items-center mb-4 lg:mb-0">
        <div>
          <h1 className="text-3xl font-medium">Dashboard</h1>
          <p className="my-2">Take your view of activity</p>
        </div>
      </div>
      <ProjectStats filteredStatus={'todo'}/>
      <div className="flex lg:gap-8 gap-6 flex-wrap lg:flex-nowrap">
        <ProjectRevenue/>
        <ProjectProgressChart 
        finishedProjects={finishedProjects.length}
        projectsInProgress={projectsInProgress.length}
        projectsUnfinished={projectsUnfinished.length}
        />
      </div>
      <div className="mt-8 flex flex-wrap lg:flex-nowrap lg:gap-8 gap-6">
        <CardWrapper title="Recent Project" containerClass={'lg:w-1/2 w-full'}>
          {recentProjects && 
          (<ProjectCard 
          name={recentProjects.name} 
          status={recentProjects.status} 
          classes={'border border-base-300 p-2'}
          description={recentProjects.description}
          imagePath={recentProjects.image}
          statusClass={'mt-2 mr-2'}
          id={recentProjects.id}
          progressValue={calculateProgressValue(recentProjects)}
          />)}
        </CardWrapper>
        <CardWrapper title="Daily activities" icon="pi-ellipsis-v" containerClass={'lg:w-1/2 w-full h-60 overflow-auto'}>
          <ProjectEventCalendar 
          showEvent={false} 
          events={events} 
          setEvents={setEvents} 
          onAddEvent={createEvent}
          onDeleteEvent={deleteEvent}
          />
        </CardWrapper>
      </div>
    </div>
  )
}

export default Dashboard;