import { useState } from "react";
import { Card } from "@/components/ui/card";
import listPlugin from "@fullcalendar/list";
import AddEventForm from "./addEventForm.jsx";
import FullCalendar from "@fullcalendar/react";
import Modal from "../../modal/components/modal";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from "@fullcalendar/core/index.js";
import interactionPlugin from "@fullcalendar/interaction";
import { closeModal, openModal } from '../../modal/modalSlice.js';

export const ProjectEventCalendar = ({showEvent = false, events, setEvents, onAddEvent, onDeleteEvent, loading}) => {
  const [ selected, setSelected ] = useState();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.modals?.['addEvent']?.isOpen);


  const handleDateClick = (selected) => {
    setSelected(selected);
    dispatch(openModal({
      id: 'addEvent',
      title: 'Add Event',
      // contentType: 'AddEventForm',
      contentProps: {
        id: 'addEvent'
      }
    }));
  };

  const renderEventForm = () => (
    <AddEventForm 
    handleSubmit={handleSubmit}
    selected={selected}
    />
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget;
    const { title, description } = Object.fromEntries(new FormData(form));
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (typeof title === 'string' && title.trim().length !== 0) {
      form.reset();
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
      const formattedEvents = {
        id: `${selected.dateStr}-${title}`,
        title: title,
        date: selected.startStr, // Just take the date part
      };
      setEvents(prev => [...prev, formattedEvents])
      onAddEvent( title, description, selected.startStr );
    }
    dispatch(closeModal({id: 'addEvent'}))
  }

  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      selected.event.remove();
      setEvents(prevEvents => prevEvents.filter(event => event.id != selected.event.id))
      onDeleteEvent(selected.event.id)
    }
  };

  return (
    <div className="relative">
    <Card className="bg-base-100 border-base-300">
      <div className="flex justify-between flex-col lg:flex-row col-reverse">
        {/* CALENDAR SIDEBAR */}
       {showEvent && <div 
          className={`p-4 border-r-0 flex-1 flex-shrink-0 flex-grow-0 basis-1/5 bg-base-100`} >
          <h5 className="text-lg font-semibold mb-4 text-base-content">Events</h5>
          <ul>
            {!loading ? events.map((event) => (
              <li key={event.id} className={`bg-green-500 my-2.5 rounded`}>
                <div className="p-2">
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm">
                    {formatDate(event.date, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </li>
            )): <div className="text-gray-500 text-center">loading...</div>}
          </ul>
        </div>}

        {/* CALENDAR */}
        <Card className="flex-1 flex-shrink-0 flex-grow-0 basis-full p-2 bg-base-100 text-base-content border-base-300">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={showEvent && {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={events}
          />
        </Card>
      </div>
    </Card>
      {isOpen && (
        <Modal
        id='addEvent'
        renderContent={renderEventForm}
        titleClass={'text-lg font-semibold p-2'}
        modalClass={'w-80 h-auto fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]  shadow-md'}
        />
      )}
    </div>
  );
};