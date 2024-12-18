/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {fetchAllProjectTransactions} from '../../projectsTransactions/projectTransactionsThunks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const Button = ({
  className,
  iconClassName,
  text,
  onClick,
  type,
  ariaLabel,
}) => (
  <button
    type={type}
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <i className={iconClassName} />
    <span className="capitalize text-sm">{text}</span>
  </button>
);

Button.propTypes = {
  className: PropTypes.string.isRequired,
  iconClassName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  ariaLabel: '',
};

export default Button;


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        font: {
          family: 'Rubik',
          size: 16, // Font size
        },
      },
      ticks: {
        // Y-axis scale value configuration goes here
        suggestedMin: 200, // Set the minimum value on the y-axis
        max: 2000, // Set the maximum value on the y-axis
        stepSize: 200, // Set the step size (increment) between each tick
        font: {
          family: 'Rubik', // Change the font family for the y-axis tick labels
          size: 12, // Change the font size for the y-axis tick labels
        },
      },
    },
    x: {
      ticks: {
        // Y-axis scale value configuration goes here
        font: {
          family: 'Rubik', // Change the font family for the y-axis tick labels
          size: 12, // Change the font size for the y-axis tick labels
        },
      },
    }
  },
};

export function ProjectTrendGraph() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchAllProjectTransactions())
  }, [dispatch])
  
  // let dataset;
  const labels =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 const data = {
  labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40, 50, 47, 57, 44, 20],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};


  return (
    <div className="bg-base-100 p-4 w-3/5 mt-8 rounded-sm">
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-lg font-medium">Revenue</h1>
          <p className="text-xs">your revenue this year</p>
        </div>
      </div>
      <Line options={options} data={data} />
    </div>
  )
}