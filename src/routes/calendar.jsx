import supabase from "../lib/supabase";
import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from  "../features/auth/authThunks";
import { ProjectEventCalendar } from "../features/projectEvents/components/projectEventCalendar";
function Calendar() {
  const dispatch =  useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLooading] = useState(false);

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
      // eslint-disable-next-line no-unused-vars
      }, (payload) => {
        fetchEvents();
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchEvents = async () => {
    try {  
      setLooading(true);
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
    } catch (error) {
      console.log(error);
    }finally {
      setLooading(false);
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

  return (
    <div className="lg:p-8 px-4 pb-28 lg:pb-0">
      <h1 className="text-3xl font-medium">Calendar</h1>
      <h4 className="my-2">Full Calendar Interactive Page</h4>
      <div className="max-w-2xl lg:max-w-[850px]">
       {isMobile ? 
       <ProjectEventCalendar
        loading={loading}
        events={events}
        showEvent={false} 
        setEvents={setEvents} 
        onAddEvent={createEvent}
        onDeleteEvent={deleteEvent}
        /> :  
        <ProjectEventCalendar
        loading={loading}
        events={events}
        showEvent={true} 
        setEvents={setEvents} 
        onAddEvent={createEvent}
        onDeleteEvent={deleteEvent}
        />}
      </div>
    </div>
  );
}
export default Calendar;