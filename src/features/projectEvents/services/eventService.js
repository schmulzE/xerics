import supabase from "../../../lib/supabase";

export const EventService = {
  async fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data.map(event => ({
      id: event.id,
      title: event.title,
      date: event.due_date.split('T')[0],
    }));
  },

  async createEvent(title, description, dueDate, userId) {
    const { error } = await supabase
      .from('events')
      .insert([{ title, description, due_date: dueDate, user_id: userId }]);
    if (error) throw error;
  },

  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    if (error) throw error;
  },

  subscribeToEvents(callback) {
    const subscription = supabase
      .channel('events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
      }, callback)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }
};