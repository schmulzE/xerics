import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import CardWrapper from '../../../components/ui/cardWrapper.jsx';
import { fetchProjectEvents } from '../../projectEvents/projectEventsThunks.js';


const ProjectTimeline = () => {
  const dispatch = useDispatch()
  const events = useSelector(state => state.projectEvents.projectEvents);

  const { projectId } = useParams();

  useEffect(() => {
   dispatch(fetchProjectEvents(projectId));
  }, [dispatch, projectId])

  function timeElapsed(timeStr) {
    const timeObj = new Date(timeStr);
    const currentTime = new Date();
    const timeDifference = currentTime - timeObj;

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));

    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  }


  return (
    <CardWrapper title="Project Timeline" classes={'w-full '}>           
      {events.length > 0 ? <ol className="relative border-s border-gray-200">                  
       {events.filter(projectEvent => projectEvent != null).slice(0, 5).map((projectEvent, index) => 
        (<li className="ms-4 space-y-6" key={index}>
          <div className="absolute w-3 h-3 bg-blue-200 rounded-full mt-1.5 -start-1.5 border border-blue-200"></div>
          <div className="flex gap-x-6 justify-between items-center">
            <div>
           {
            projectEvent.eventType == 'INSERT' ? 
            <h6 className="text-sm font-medium">new task added</h6> : <h6 className="text-sm font-medium">task status changed</h6>
            }
            {projectEvent.eventType == 'UPDATE' ? 
              <h3 className="text-xs"><span className="captalize text-blue-500">{projectEvent.user}</span> moved task <span className='text-blue-500'>{projectEvent.taskname}</span> to <span className='text-blue-500'>{projectEvent.board}</span> board</h3> 
              : <h3 className="text-xs"><span className="captalize text-blue-500">{projectEvent.user}</span> created new task <span className='text-blue-500'>{projectEvent.taskname}</span></h3>
              }  
            </div>
          <span className="text-xs text-gray-500 lowercase">{timeElapsed(projectEvent.timestamp)}</span>
          </div>
        </li>)
        ) }
      </ol>: <li className="capitalize flex justify-center text-sm">no timeline updates</li>}
    </CardWrapper>
  )
}

export default ProjectTimeline
