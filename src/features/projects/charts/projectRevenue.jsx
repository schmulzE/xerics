/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from "../../../../context/themeContext";
import {fetchAllProjectTransactions} from '../../projectsTransactions/projectTransactionsThunks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
    <span className="capitalize text-sm ">{text}</span>
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
        text: 'Amount ($)',
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

export function ProjectRevenue() {
  const [activeTab, setActiveTab] = useState('all'); 
  const [dataset, setDataset] = useState([])
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.projectTransactions.transactions);
  const { theme } = useTheme();


  useEffect(() => {
    dispatch(fetchAllProjectTransactions())
  }, [dispatch])
  
  // let dataset;
  const tabs = ['all', 'expense', 'income', 'profit']
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const result = (valueToReturn) => {
    return labels.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionMonth = new Date(t.created_at).getMonth();
        return labels[transactionMonth] === month;
      });
  
      const income = monthTransactions
        .filter((t) => t.type === "Income")
        .reduce((total, t) => total + t.amount, 0);
  
      const expense = monthTransactions
        .filter((t) => t.type !== "Income")
        .reduce((total, t) => total + t.amount, 0);
  
      const profit = income - expense;
  
      if (valueToReturn === "income") {
        return { month, income };
      } else if (valueToReturn === "expense") {
        return { month, expense };
      } else if (valueToReturn === "profit") {
        return { month, profit };
      } else {
        return { month, income, expense, profit };
      }
    });
  };

  useEffect(() => {
    setDataset(() => result('all'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setDataset(() => result(tab))
  };

 const data = {
  labels,
  datasets: [
    {
      label: 'Income',
      data: dataset.map((data) => data.income),
      backgroundColor: 'rgb(3,133,255)',
    },
    {
      label: 'Expense',
      data: dataset.map((data) => data.expense),
      backgroundColor: 'rgb(249,133,80)',
    },
    {
      label: 'Profit',
      data: dataset.map((data) => data.profit),
      backgroundColor: 'rgb(149,81,212)',
    },
  ],
};

  const expenses = transactions && Array.isArray(transactions) && transactions.length > 0 
  ? transactions.reduce((accumulator ,transaction) => {
    if(transaction && transaction.type === "Expenses") {
      accumulator += transaction.amount;
    }
    return accumulator;
  }, 0) : 0
  
  const income = transactions  && Array.isArray(transactions) && transactions.length > 0
  ? transactions.reduce((accumulator ,transaction) => {
    if(transaction && transaction.type === "Income") {
     accumulator += transaction.amount;
    }
    return accumulator;
  }, 0) : 0

  return (
    <div className="bg-base-100 p-4 lg:w-3/5 w-full mt-8">
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-lg font-medium">Revenue</h1>
          <p className="text-xs">your revenue this year</p>
        </div>
        <div className='flex'>
        {tabs.map((tab, index) => (
          <Button
            key={index}
            className={
              `${theme == 'dark' ? 'border-[#191E24]' : null} 
              text-md space-x-2 border text-center pr-2 hidden lg:block 
              ${activeTab === tab ? 
              `active ${theme == 'dark' 
              ? 'dark:bg-[#191E24] bg-base-300 text-blue-500' : 
              'bg-blue-50  text-blue-500'
              } ` 
              : ''}`
            }
            iconClassName="tab-icon"
            text={tab}
            onClick={() => handleTabClick(tab)}
            ariaLabel={`Switch to ${tab} tab`}
          />
        ))}
        </div>
      </div>

      <div className='flex justify-center gap-x-6 my-2'>
        <div className='flex items-start gap-x-2'>
          <div className={theme == 'light' ? 'bg-blue-100 px-1.5 pt-1 rounded-sm' : 'dark:bg-[#191E24] px-1.5 pt-1 rounded-sm'}>
            <i className='pi pi-money-bill content-center text-[rgb(3,133,255)]'></i>
          </div>
          <div>
            <span className='text-sm capitalize text-gray-500'>income</span>
            <div className='flex items-end'>
              <h3 className='font-bold lg:text-2xl text-lg'>${income}</h3>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-x-2'>
          <div className={theme == 'light' ? 'bg-orange-100 px-1.5 pt-1 rounded-sm' : 'dark:bg-[#191E24] px-1.5 pt-1 rounded-sm'}>
            <i className='pi pi-credit-card content-center text-[rgb(249,133,80)]'></i>
          </div>
          <div>
            <span className='text-sm capitalize text-gray-500'>expense</span>
            <div className='flex items-end'>
              <h3 className='font-bold lg:text-2xl text-lg'>${expenses}</h3>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-x-2'>
          <div className={theme == 'light' ? 'bg-purple-100 px-1.5 rounded-sm' : 'dark:bg-[#191E24] px-1.5 rounded-sm'}>
            <i className='pi pi-dollar text-xs content-center text-[rgb(149,81,212)]'></i>
          </div>
          <div>
            <span className='text-sm capitalize text-gray-500'>profit</span>
            <div className='flex items-end'>
              <h3 className='font-bold lg:text-2xl text-lg'>${income - expenses}</h3>
            </div>
          </div>
        </div>
      </div>
      <Bar options={options} data={data} />
    </div>
  )
}
