import { useEffect } from "react"; 
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../features/projects/projectThunks';
import ProjectTable from '../features/projects/components/projectTable';
import ProjectBarChart from '../features/projects/charts/projectBarChart';
import ProjectTasksStat from "../features/projects/charts/projectTasksStat";
import PriorityLevelStat from '../features/projects/charts/priorityLevelStat';

const ReportAndAnalysis = () => {
  const dispatch = useDispatch();
  const Projects = useSelector(state => state.project.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const BreadcrumbLinks = [
    {
      text: 'Dashboard',
      url: '/dashboard',
    },
    {
      text: 'Report and Analysis',
      url: '/report-and-analysis',
    }
  ]

  return (
    <div className={`px-4 pb-32 lg:pb-0 lg:px-8 lg:py-2 space-y-4 lg:space-y-8`}>
      <div>
        <h1 className='text-2xl font-semibold lg:text-3xl lg:font-bold first-letter:uppercase'>report and analysis</h1> 
        <Breadcrumbs links={BreadcrumbLinks}/>
      </div>
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