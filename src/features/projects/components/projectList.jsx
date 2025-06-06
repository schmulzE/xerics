import { useEffect } from "react";
import ProjectCard from "./projectCard.jsx";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards } from "../../boards/boardsSlice.js";

const ProjectList = ({projects}) => {

  const dispatch = useDispatch();
  const boards = useSelector(state => state.board.boards);
  
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);


  const calculateProgressValue = (project) => {
    const board = boards.find(board => board.title === 'done');
    const completedTasks = board ? project.tasks.filter(task => task.board_id === board.id) : [];
    const totalTasks = project.tasks.length;
    return totalTasks > 0 ? Math.floor((completedTasks.length / totalTasks) * 100) : 0;
  };
  

  return (
    <ul className='grid grid-col-1 md:grid-cols-3 lg:grid-col-3 w-full gap-8 mt-16'>
      {projects.map((project) => ( project &&
        <li className="w-80" key={project.id}>
        <ProjectCard
          id={project.id}
          name={project.name} 
          imagePath={project.image}
          status={project.status}
          classes={'rounded-sm h-full'}
          description={project.description}
          statusClass={''}
          icon="pi-ellipsis-v"
          progressValue={calculateProgressValue(project)}
        />
        </li>
      ))}  
    </ul>
  )
}

export default ProjectList
