import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import CardWrapper from '../../../components/cardWrapper';

ChartJS.register(ArcElement, Tooltip, Legend);


export function PriorityChart({projectsUnfinished, projectsInProgress, finishedProjects}) {

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
         'rgb(248,102,36)',
         'rgb(34,202,173)',
         'rgb(236,72,87)',
        ],
        borderColor: [
          'rgb(248,102,36)',
          'rgb(34,202,173)',
          'rgb(236,72,87)',
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
      containerClass={'bg-base-100 p-4 w-2/5 mt-8 capitalize'}
      title='all projects'
      subtitle='based on status'
      subtitleClass={'text-xs'}
      buttons={[{icon: 'pi pi-ellipsis-v'}]}
    >
      <div className='h-64 flex justify-center'>
        <Doughnut data={!projectsUnfinished || !projectsInProgress || !finishedProjects ? Emptydataset : data} options={options}/>
      </div>
        {/* <ul className='flex flex-col text-sm justify-center space-y-2 mt-2'>
          <li className='flex justify-around'>
            <div>
              <span className='inline-block w-4 h-4 bg-[rgb(248,102,36)] rounded-full mr-2'></span>
              <span>In progress</span>
            </div>
            <div className='font-bold'>{projectsInProgress}</div>
          </li>
          <li className='flex justify-around gap-x-9'>
            <div>
              <span className='inline-block w-4 h-4 bg-[rgb(34,202,173)] rounded-full mr-2'></span>
              <span>Done</span>
            </div>
            <div className='font-bold'>{projectsInProgress}</div>
          </li>
          <li className='flex justify-around gap-x-2'>
            <div>
              <span className='inline-block w-4 h-4 bg-[rgb(236,72,87)] rounded-full mr-2'></span>
              <span>In Review</span>
            </div>
            <div className='font-bold'>{finishedProjects}</div>
          </li>
        </ul> */}
    </CardWrapper>
    )
  ;
}
