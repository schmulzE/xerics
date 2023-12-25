import ReactDom from 'react-dom'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function Modal({ children, onClose }) {

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={() => (onClose ? onClose() : "")}/>
      <div style={MODAL_STYLES} className='max-w-5xl w-screen h-[490px] p-0 bg-black rounded-lg overflow-y-auto overflow-x-hidden'>
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}
