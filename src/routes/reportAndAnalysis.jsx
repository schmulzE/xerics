import { useEffect } from "react"; 
import ProjectTable from '../features/projects/components/projectTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectThunks';
import ProjectBarChart from '../features/projects/charts/projectbarChart';
import ProjectTasksStat from "../features/projects/charts/projectTasksStat";
import PriorityLevelStat from '../features/projects/charts/priorityLevelStat';

const ReportAndAnalysis = () => {
  const dispatch = useDispatch();
  const Projects = useSelector(state => state.project.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className={`px-4 pb-32 lg:pb-0 lg:p-8 space-y-4 lg:space-y-8`}>
      <h1 className='text-2xl font-medium first-letter:uppercase'>report and analysis</h1> 
      <ProjectBarChart projects={Projects}/>
      <div className="flex justify-between flex-col gap-y-4 lg:gap-y-0 lg:flex-row">
        <ProjectTasksStat/>
        <PriorityLevelStat/>
      </div>
      <ProjectTable/>
    </div>
  )
}

export default ReportAndAnalysis;