/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from "../../../../context/themeContext";
import { fetchAllProjectTransactions } from '../../projectsTransactions/projectTransactionsThunks';
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
      display: false,
    },
    title: {
      display: false,
      text: 'Project Revenue',
    },
    tooltip: {
      font: {
        family: 'Source Code Pro',
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += '$' + context.raw.toLocaleString();
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Amount ($)',
        font: {
          family: 'Source Code Pro',
          size: 16,
        },
      },
      beginAtZero: true,
      ticks: {
        font: {
          family: 'Source Code Pro',
          size: 12,
        },
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      },
    },
    x: {
      ticks: {
        font: {
          family: 'Source Code Pro',
          size: 12,
        },
      },
    }
  },
};

export function ProjectRevenue() {
  const [activeTab, setActiveTab] = useState('all'); 
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.projectTransactions.transactions);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchAllProjectTransactions())
  }, [dispatch])

  const tabs = ['all', 'expense', 'income', 'profit'];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Update the monthlyData calculation
const { monthlyData, totals } = useMemo(() => {
  const monthlyData = labels.map(month => ({
    month,
    income: 0,
    expense: 0,
    profit: 0
  }));

  transactions.forEach(transaction => {
    const date = new Date(transaction.created_at);
    const monthIndex = date.getMonth();
    
    if (transaction.type === "income") {
      monthlyData[monthIndex].income += transaction.amount;
    } else if (transaction.type === "expense") {
      monthlyData[monthIndex].expense += transaction.amount;
    }
    // Calculate profit as (income - expenses) but we'll display absolute value
    monthlyData[monthIndex].profit = 
      Math.max(0, monthlyData[monthIndex].income - monthlyData[monthIndex].expense);
  });

  const totals = monthlyData.reduce((acc, month) => {
    acc.income += month.income;
    acc.expense += month.expense;
    acc.profit += (month.income - month.expense); // Actual profit (may be negative)
    return acc;
  }, { income: 0, expense: 0, profit: 0 });

  return { monthlyData, totals };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [transactions]);

// Update chart data to show absolute values
const chartData = useMemo(() => {
  const datasets = [];
  
  if (activeTab === 'all' || activeTab === 'income') {
    datasets.push({
      label: 'Income',
      data: monthlyData.map(data => data.income),
      backgroundColor: 'rgb(232,196,104)',
    });
  }
  
  if (activeTab === 'all' || activeTab === 'expense') {
    datasets.push({
      label: 'Expense',
      data: monthlyData.map(data => data.expense), 
      backgroundColor: 'rgb(244,147,97)',
    });
  }
  
  if (activeTab === 'all' || activeTab === 'profit') {
    datasets.push({
      label: 'Profit',
      data: monthlyData.map(data => Math.abs(data.income - data.expense)),
      backgroundColor: 'rgb(42,157,144)',
    });
  }

  return {
    labels,
    datasets
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeTab, monthlyData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-base-100 p-4 lg:w-3/5 w-full mt-8">
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-lg font-bold">Revenue</h1>
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
        <div className='flex flex-col gap-x-2'>
          <div className='flex items-center justify-center'>
            <div className={theme == 'light' ? 'bg-[rgb(232,196,104)]/10 px-1.5 pt-1 rounded-sm' : 'dark:bg-[#191E24] px-1.5 pt-1 rounded-sm'}>
              <i className='pi pi-money-bill content-center text-[rgb(232,196,104)]'></i>
            </div>
            <span className='text-sm capitalize text-gray-500'>income</span>
          </div>
          <div>
            <h3 className='font-bold lg:text-2xl text-lg'>${totals.income.toLocaleString()}</h3>
          </div>
        </div>
        <div className='flex flex-col gap-x-2'>
          <div className='flex items-center justify-center'>
            <div className={theme == 'light' ? 'bg-[rgb(244,162,97)]/10 px-1.5 pt-1 rounded-sm' : 'dark:bg-[#191E24] px-1.5 pt-1 rounded-sm'}>
              <i className='pi pi-money-bill content-center text-[rgb(244,162,97)]'></i>
            </div>
            <span className='text-sm capitalize text-gray-500'>expense</span>
          </div>
          <div>
            <h3 className='font-bold lg:text-2xl text-lg'>${totals.expense.toLocaleString()}</h3>
          </div>
        </div>
        <div className='flex flex-col gap-x-2'>
          <div className='flex items-center justify-center'>
            <div className={theme == 'light' ? 'bg-[rgb(42,157,144)]/10 px-1.5 pt-1 rounded-sm' : 'dark:bg-[#191E24] px-1.5 pt-1 rounded-sm'}>
              <i className='pi pi-money-bill content-center text-[rgb(42,157,144)]'></i>
            </div>
            <span className='text-sm capitalize text-gray-500'>profit</span>
          </div>
          <div>
            <h3 className='font-bold lg:text-2xl text-lg'>${totals.profit.toLocaleString()}</h3>
          </div>
        </div>
      </div>
      <Bar options={options} data={chartData} />
    </div>
  );
}