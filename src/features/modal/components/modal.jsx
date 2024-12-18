import { Suspense } from 'react';
import ReactDom from 'react-dom';
import { closeModal } from '../modalSlice';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
export default function Modal({ id, modalClass, titleClass, renderContent }) {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal?.modals?.[id]);

  if (!modalState || !modalState.isOpen) return null;
  
  const { title, contentProps } = modalState;
  
  return ReactDom.createPortal(
    <>
      <div className='fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-black bg-opacity-20'/>
      <div className={`${modalClass} bg-base-100`}>
        <button 
        className='absolute top-0 right-0 btn btn-circle btn-sm bg-transparent hover:bg-transparent border-none' 
        onClick={() => dispatch(closeModal({id}))}
        >
          <i className='text-sm pi pi-times'></i>
        </button>
        {title && <h1 className={titleClass}>{title}</h1>}
        <Suspense fallback={<div>Loading...</div>}>
          {renderContent && renderContent(contentProps)}
        </Suspense>
      </div>
    </>,
    document.getElementById('portal')
  )
}