import { Pie } from 'react-chartjs-2';
import CardWrapper from '../../../components/ui/cardWrapper';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


export function ProjectProgressChart({projectsUnfinished, projectsInProgress, finishedProjects}) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: false
      },
    },
  };
  
  const data = {
    labels: ['In Progress', 'Done', 'In Review'],
    datasets: [
      {
        label: '# of Projects',
        data: [ projectsInProgress, finishedProjects, projectsUnfinished],
        backgroundColor: [
         'rgb(232,196,104)',
         'rgb(42,157,144)',
         'rgb(244,162,97)',
        ],
        borderColor: [
          'rgb(232,196,104)',
          'rgb(42,157,144)',
          'rgb(244,162,97)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const Emptydataset = {
    labels: ['In Progress', 'Done', 'In Review'],
    datasets: [
      {
        label: '# of Projects',
        data: ['1'],
        backgroundColor: [
         'rgba(128,128, 128, 0.5)',
        ],
        borderColor: [
          'rgba(128,128,128, 0.1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <CardWrapper
      containerClass={'bg-base-100 p-4 lg:w-2/5 w-full lg:mt-8 capitalize'}
      title='all project'
      subtitle='based on status'
      subtitleClass={'text-xs'}
    >
      <div className='h-64 flex justify-center'>
        <Pie data={!projectsUnfinished || !projectsInProgress || !finishedProjects ? Emptydataset : data} options={options}/>
      </div>
      <ul className='flex flex-col text-sm justify-center content-center mx-auto space-y-2 mt-2 w-60'>
        <li className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            <span className='inline-block w-4 h-4 bg-[rgb(232,196,104)] rounded-full mr-2'></span>
            <span>In progress</span>
          </div>
          <div className='font-bold'>{projectsInProgress}</div>
        </li>
        <li className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            <span className='inline-block w-4 h-4 bg-[rgb(42,157,144)] rounded-full mr-2'></span>
            <span>Done</span>
          </div>
          <div className='font-bold'>{finishedProjects}</div>
        </li>
        <li className='flex items-center justify-between w-full'>
          <div>
            <span className='inline-block w-4 h-4 bg-[rgb(244,162,97)] rounded-full mr-2'></span>
            <span>In Review</span>
          </div>
          <div className='font-bold'>{projectsUnfinished}</div>
        </li>
      </ul>
    </CardWrapper>
    )
  ;
}
