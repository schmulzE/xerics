const projectTransaction = ({transactions}) => {

  return (
    <>
      <h1 className="my-2">Transactions</h1>
      <ul className="rounded-box space-y-4">
        {transactions.slice(0, 5).map(transaction => transaction &&  (
          <li className="flex justify-between items-center" key={transaction.id}>
          <div className={transaction.type == "Income" ? "bg-green-100 rounded-full" : "bg-red-50 rounded-full"}>
            <i className={transaction.type == "Income" ? "text-green-600 p-2 pi pi-credit-card text-sm" : "p-2 pi pi-credit-card text-red-600 text-sm"}></i>
          </div>
          <div className="flex flex-col text-sm text-center">
            <span className="font-medium">{transaction.transaction}</span>
            <span className="text-xs">{transaction.type}</span>
          </div>
          <span className="text-xs">{transaction.type == "Expenses" ? `-$${transaction.amount}` : `$${transaction.amount}`}</span>
        </li>
        ))}
      </ul>
    </>
  )
}

export default projectTransaction
