import { useEffect, useState } from "react";
import { getUser } from "../../auth/authThunks";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from "../../boards/boardsSlice";
import { fetchProjects } from "../../projects/projectThunks";
import { ProjectImageApi } from "../../projects/services/projectImageApi";
import { EventService } from "../../projectEvents/services/eventService";

export const useDashboardData = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const boards = useSelector(state => state.board.boards);
  const projects = useSelector(state => state.project.projects);
  const [recentProjectImage, setRecentProjectImage] = useState(null);

  // User data
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Boards and projects
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchBoards()),
        dispatch(fetchProjects())
      // eslint-disable-next-line no-unused-vars
      ]).catch(error => {
        toast({
          variant: "destructive",
          description: "Failed to fetch boards or projects. Please try again.",
        });
      });
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Events data with real-time subscription
  useEffect(() => {
    const fetchInitialEvents = async () => {
      try {
        const events = await EventService.fetchEvents();
        setEvents(events);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to fetch events. Please try again.",
        });
      }
    };

    fetchInitialEvents();
    const unsubscribe = EventService.subscribeToEvents(fetchInitialEvents);
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recent project image
  useEffect(() => {
    const getRecentProjectImage = async () => {
      const recentProject = projects[projects.length - 1];
      if (recentProject?.image) {
        const imageUrl = await ProjectImageApi.getImageUrl(recentProject.image);
        setRecentProjectImage(imageUrl);
      }
    };
    getRecentProjectImage();
  }, [projects]);

  // Project status calculations
  const getProjectsByStatus = () => {
    const finishedProjects = projects.filter(p => p.status === 'done').length;
    const inProgressProjects = projects.filter(p => p.status === 'in progress').length;
    const unfinishedProjects = projects.filter(p => p?.status === 'in review').length;

    return { finishedProjects, inProgressProjects, unfinishedProjects };
  };

  // Calculate project progress
  const calculateProgress = (project) => {
    if (!project || !boards) return 0;
    
    const board = boards.find(b => b.title === 'done');
    const completedTasks = board ? project.tasks?.filter(t => t.board_id === board.id) : [];
    const totalTasks = project.tasks?.length || 0;
    
    return totalTasks > 0 ? Math.floor((completedTasks.length / totalTasks) * 100) : 0;
  };

  // Event handlers
  const handleCreateEvent = async (title, description, dueDate) => {
    try {
      await EventService.createEvent(title, description, dueDate, user.id);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Create event failed. Please try again.",
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await EventService.deleteEvent(eventId);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Delete event failed. Please try again.",
      });
    }
  };

  return {
    user,
    boards,
    projects,
    events,
    recentProjectImage,
    getProjectsByStatus,
    calculateProgress,
    handleCreateEvent,
    handleDeleteEvent,
  };
};