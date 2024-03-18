/* eslint-disable no-unused-vars */
import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards } from "../features/boards/boardsSlice.js";
import { fetchTasks } from "../features/tasks/taskThunk";
import Progressbar from "./progressbar";
import { Link } from "react-router-dom";

const ProjectCard = ({id, image, title, description, status, icon, classes}) => {

  const dispatch = useDispatch()
  const tasks = useSelector(state => state.task.tasks);
  const boards = useSelector(state => state.board.boards);
  

  useEffect(() => {
    dispatch(fetchBoards())
  }, [dispatch])
  
  useEffect(() => {
    dispatch(fetchTasks(id))
  }, [dispatch, id])

  
  
  const filterTasksByBoard = (tasks, boards, boardTitle) => {
    const board = boards.find(board => board.title === boardTitle);
    if (!board) return [];
    return tasks.filter(task => task.board_id === board.id);
  };

  const calculateProgressPercentage = (finishedTasks, totalTasks) => {
    if (!totalTasks || !finishedTasks) return 0;
    const percentage = (finishedTasks.length / totalTasks.length) * 100;
    return Math.min(Math.floor(percentage), 100);
  };
  
  const arrayOfFinishedTasks = filterTasksByBoard(tasks, boards, 'Finished');
  const arrayOfUnfinishedTasks = filterTasksByBoard(tasks, boards, 'Unfinished');
  const arrayOfTasksInProgress = filterTasksByBoard(tasks, boards, 'In Progress');
  
  const progressValue = useMemo(() => {
    return calculateProgressPercentage(arrayOfFinishedTasks, tasks);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayOfFinishedTasks, tasks, arrayOfUnfinishedTasks, arrayOfTasksInProgress]);
  
  const changeStatusColor = () => {
    let statusClass;
    switch (status) {
      case 'Unfinished':
        statusClass = 'bg-red-50 text-red-400'
        break;
      case 'Finished':
        statusClass = 'bg-green-50 text-green-400'
        break;
      case 'In Progress':
        statusClass = 'bg-orange-50 text-orange-400'
        break;
      
      default:
        statusClass = 'bg-gray-100 text-gray-400'
        break;
    }
    return statusClass;
  }
  return (
    <Link to={`/projects/${id}`} className={`bg-base-100 p-4 block ${classes}`}>
      <div className="flex justify-between">
      <div>
        {image && <img src={image} alt={title} className="card-image text-xs" />}
        <h2 className="capitalize font-medium">{title}</h2>
      </div>
      <div className="mb-4">
        <span className={changeStatusColor(status) + ' rounded-md text-xs p-2'}>{status}</span>
        <button>
          <i className={`pi ${icon}`}></i>
        </button>
      </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 line-clamp-3">{description}</p>
        <Progressbar progressValue={progressValue} title={'progress'}/>
        {/* <div className="flex justify-between">
          <span className="text-md capitalize">progress</span>
          <span className="text-xs align-bottom items-baseline">70%</span>
        </div>
        <progress className="progress progress-warning " value="70" max="100"></progress> */}
        {/* <div className="avatar-group -space-x-3 rtl:space-x-reverse">
          {contributors.map(contributor => contributor && (
            <>
              <div className="avatar" key={contributor.id}>
                <div className="w-6">
                  <img src={contributor.avatar} />
                </div>
              </div>
              <div className="avatar placeholder">
                <div className="w-6 bg-neutral text-neutral-content">
                  <span className="text-xs">+4</span>
                </div>
              </div>
            </>
          ))}
      </div> */}
      </div>
    </Link>
  )
}

export default ProjectCard