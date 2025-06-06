import { useTheme } from '../../../../context/themeContext';

const ProjectTransaction = ({transactions}) => {
  const { theme } = useTheme();

  return (
    <>
      <h1 className="my-2">Transactions</h1>
      <ul className="rounded-box space-y-4">
        {transactions.length > 0 ? transactions.map((transaction) => (
          <li className="flex justify-between items-center" key={transaction.id}>
          <div className={transaction.type == "Income" ? `bg-green-100 rounded-full ${theme === 'dark' ? 'dark:bg-[#191E24]' : null} ` : ` ${theme === 'dark' ? 'dark:bg-[#191E24]' : 'bg-red-50'} rounded-full`}>
            <i className={transaction.type == "Income" ? "text-green-600 p-2 pi pi-credit-card text-sm" : " p-2 pi pi-credit-card text-red-600 text-sm"}></i>
          </div>
          <div className="flex flex-col text-sm text-center">
            <span className="font-medium">{transaction.transaction}</span>
            <span className="text-xs">{transaction.type}</span>
          </div>
          <span className="text-xs">{transaction.type == "expense" ? `-$${transaction.amount}` : `$${transaction.amount}`}</span>
        </li>
        )) : <div className='capitalize flex flex-col h-44 justify-center content-center text-sm font-normal'><p className='m-auto'>No transactions made</p></div> }
      </ul>
    </>
  )
}

export default ProjectTransaction
