const BudgetProgressbar = ({totalIncome, totalExpenses, progressValue, title}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        {totalExpenses ? <span className="text-sm capitalize">
          <span className="text-warning">${totalExpenses}</span>/${totalIncome}</span>
           : <span className="text-sm capitalize mt-2">{title}</span>
        }
        {totalExpenses ? <span className="text-xs">${totalIncome - totalExpenses} left</span> : <span className="text-xs">{progressValue}%</span>}
      </div>
      <progress className="progress progress-warning" value={progressValue} max="100"></progress>
    </>
  )
}

export default BudgetProgressbar
