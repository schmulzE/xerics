/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import TransactionForm from './transactionForm';
import Modal from '../../modal/components/modal';
import BudgetProgressbar from './budgetProgressbar';
import { useEffect, useMemo, useState } from "react";
import ProjectTransaction from './projectTransaction';
import { useDispatch, useSelector } from 'react-redux';
import CardWrapper from '../../../components/ui/cardWrapper';
import { closeModal, openModal } from '../../modal/modalSlice.js';
import {addProjectTransactions, fetchProjectTransactionById} from '../projectTransactionsThunks.js'

const ProjectBudget = ({projectContributors, user}) => {
  const {projectId} = useParams();
  const dispatch = useDispatch();
  const selectedTransaction = useSelector(state => state.projectTransactions.selectedTransaction)
  const loading = useSelector(state => state.projectTransactions.loading);
  const [formData, setFormData] = useState({ transaction: '', type: '', amount: 0 });
  const isOpen = useSelector((state) => state.modal.modals?.['transaction']?.isOpen);

  useEffect(() => {
    dispatch(fetchProjectTransactionById(projectId))
  }, [dispatch, projectId])  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cancelTransaction = () => {
    setFormData({ transaction: '', type: '', amount: 0 });
    dispatch(closeModal({id: 'transaction'}))
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await dispatch(addProjectTransactions({...formData, project_id: projectId})).unwrap();
    await dispatch(fetchProjectTransactionById(projectId)).unwrap();
    if(!loading) {
      dispatch(closeModal({ id: 'transaction'}))
    }
  }

  const totalExpenses = selectedTransaction && Array.isArray(selectedTransaction) && selectedTransaction.length > 0
  ? selectedTransaction.reduce((accumulator, transaction) => {
      if (transaction && transaction.type === "expense") {
        accumulator += transaction.amount;
      }
      return accumulator;
    }, 0)
  : 0;
  

  const totalIncome = selectedTransaction && Array.isArray(selectedTransaction) && selectedTransaction.length > 0
  ? selectedTransaction.reduce((accumulator, transaction) => {
      if (transaction && transaction.type === "income") {
        accumulator += transaction.amount;
      }
      return accumulator;
    }, 0)
  : 0;

  const progressValue = useMemo(() => {
    if (totalIncome === 0) return 0;
  
    const percentage = (totalExpenses / totalIncome) * 100;
    return Math.floor(percentage, 100); // Ensures value stays between 0 and 100
  }, [totalExpenses, totalIncome]);


  const openBudgetModal = () => {
    dispatch(openModal({
      id:'transaction',
      title: 'Add Transaction',
      contentProps: {
        handleSubmit,
        handleChange,
        cancelTransaction,
        loading
      }
    }))
  }

  const renderTransactionForm = (contentProps) => (
    <TransactionForm
      {...contentProps}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      cancelTransaction={cancelTransaction}
    />
  );

  return (
    <>
      <CardWrapper 
        title="Budget" 
        containerClass={'w-full capitalize'}
        buttons={projectContributors.some(contributor => contributor?.profiles?.id == user.id  && contributor.role == 'admin') && 
          [{icon: 'pi pi-plus text-blue-600', text: 'Add Transaction', class: 'text-xs text-blue-600 space-x-1 p-1', 
          openModal: openBudgetModal
        }]}
      >
        <BudgetProgressbar 
          totalExpenses={totalExpenses} 
          totalIncome={totalIncome} 
          progressValue={progressValue}
        />
        <ProjectTransaction transactions={selectedTransaction} loading={loading}/>
      </CardWrapper>

      {isOpen && (
      <Modal 
      id="transaction"
      renderContent={renderTransactionForm}
      titleClass={'text-lg font-semibold py-2'} 
      modalClass={'w-full lg:max-w-xl h-auto p-4 rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 z-[1000]'}
      />)}
    </>
  )
}

export default ProjectBudget
