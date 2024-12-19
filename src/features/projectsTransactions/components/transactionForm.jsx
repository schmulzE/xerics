import { useState } from "react"

const TransactionForm = ({handleSubmit, handleChange,cancelTransaction}) => {
  const [loading, setLoading] = useState(false);

  const submitForm = async () => {
    setLoading(true);
    try {
      await handleSubmit();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-base-100" onSubmit={submitForm}>
      <label htmlFor='transaction' className='label-text capitalize'>transaction</label>
      <input 
      type="text" 
      name="transaction" 
      id="transaction"
      onChange={handleChange}
      className='w-full input border border-gray-300 outline-none rounded-none' 
      />

      <label htmlFor='type' className='label-text capitalize mt-4 block'>type</label>
      <select name="type" id='type' defaultValue={'Pick one'} onChange={handleChange} className="select select-bordered w-full rounded-none">
        <option disabled defaultValue={'Pick one'}>Pick one</option>
        <option value={'Income'}>Income</option>
        <option value={'Expenses'}>Expenses</option>
      </select>

      <label htmlFor='amount' className='label-text capitalize mt-4 block'>amount</label>
      <input type="number" name="amount" id="amount" onChange={handleChange} className='w-full input border border-gray-300 rounded-none ring-0'/>

      <div className="flex gap-2 justify-end">
        <button onClick={cancelTransaction} type="button" className='mt-4 uppercase bg-base-300 p-2 ml-2'>
          cancel
        </button>
        <button 
        disabled={loading} 
        type="submit" 
        className='mt-4 uppercase bg-blue-600 text-white p-2 disabled:bg-gray-300 disabled:text-black'
        >
        {loading && <span className="pi pi-spinner pi-spin block mr-1 mt-0.5"></span>}
          submit
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
