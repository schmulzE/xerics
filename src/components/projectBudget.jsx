/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {addProjectTransactions, fetchProjectTransactions} from '../features/projectsTransactions/projectTransactionsThunks'
import Modal from '../components/modal/modal';
import CardWrapper from './cardWrapper';
import Progressbar from './progressbar';
import ProjectTransaction from './projectTransaction';
import useModal from "../hooks/useModal";

const ProjectBudget = () => {
  const {projectId} = useParams();
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.projectTransactions.transactions)
  const loading = useSelector(state => state.projectTransactions.loading);
  const error = useSelector(state => state.projectTransactions.error);
  const [formData, setFormData] = useState({ transaction: '', type: '', amount: 0 });
  const { isOpen, openModal, closeModal } = useModal();


  useEffect(() => {
    dispatch(fetchProjectTransactions(projectId))
  }, [dispatch, projectId])  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cancelTransaction = () => {
    setFormData({ transaction: '', type: '', amount: 0 });
    closeModal()
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await dispatch(addProjectTransactions({...formData, project_id: projectId})).unwrap();
    await dispatch(fetchProjectTransactions(projectId)).unwrap();
    if(!loading) {
      await dispatch(closeModal()).unwrap();
    }
  }
  
  const totalExpenses = transactions.reduce((accumulator ,transaction) => {
    if(transaction && transaction.type === "Expenses") {
      accumulator += transaction.amount;
    }
    return accumulator;
  }, 0)
  
  const totalIncome = transactions.reduce((accumulator ,transaction) => {
    if(transaction && transaction.type === "Income") {
     accumulator += transaction.amount;
    }
    return accumulator;
  }, 0)

  const progressValue = useMemo(() => {
    if (!totalExpenses || !totalIncome) return 0;
  
    const percentage = (totalExpenses / totalIncome) * 100;
    return Math.floor(percentage, 100); // Ensures value stays between 0 and 100
  }, [totalExpenses, totalIncome]);

  // if (loading) return (
  //   <CardWrapper containerClass={'w-full items-center flex justify-center align-center h-56'}>
  //     <i className='pi pi-spin pi-spinner'></i>
  //   </CardWrapper>
  //   );

  return (
    <>
      <CardWrapper 
        title="Budget" 
        containerClass={'w-full'}
        icon={'pi-plus'}
        iconClass={'text-blue-600'}
        buttonText={'Add transaction'}
        buttonClass={'text-xs text-blue-600 space-x-1 p-1'}
        buttonHandler={() => openModal()}
      >
        <Progressbar 
          totalExpenses={totalExpenses} 
          totalIncome={totalIncome} 
          progressValue={progressValue}
        />
        <ProjectTransaction transactions={transactions} loading={loading}/>
      </CardWrapper>
      {isOpen && 
      <Modal modalClass={'max-w-xl h-auto p-4 bg-black rounded-md overflow-y-auto overflow-x-hidden'}>
        <form onSubmit={handleSubmit}>
          <label htmlFor='transaction' className='label-text capitalize'>transaction</label>
          <input 
          type="text" 
          name="transaction" 
          id="transaction"
          onChange={handleChange}
          className='w-full input  border border-gray-300 outline-none rounded-none' 
          />

          <label htmlFor='type' className='label-text capitalize mt-4 block'>type</label>
          <select name="type" id='type' defaultValue={'Pick one'} onChange={handleChange} className="select select-bordered w-full rounded-none">
            <option disabled defaultValue={'Pick one'}>Pick one</option>
            <option value={'Income'}>Income</option>
            <option value={'Expenses'}>Expenses</option>
          </select>

          <label htmlFor='amount' className='label-text capitalize mt-4 block'>amount</label>
          <input type="number" name="amount" id="amount" onChange={handleChange} className='w-full input border border-gray-300 rounded-none ring-0'/>

          <button 
          disabled={loading} 
          type="submit" 
          className='mt-4 uppercase bg-blue-600 text-white p-2 disabled:bg-gray-300 disabled:text-black'
          >
          {loading && <span className="pi pi-spinner pi-spin block mr-1 mt-0.5"></span>}
            submit
          </button>
          
          <button onClick={cancelTransaction} type="button" className='mt-4 uppercase bg-gray-300 p-2 ml-2'>
            cancel
          </button>
        </form>
      </Modal>}
    </>
  )
}

export default ProjectBudget
