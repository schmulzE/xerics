const Button = ({button, file}) => {

  return (
    <>
      <button
      type="button"
      className='btn-sm btn-ghost btn-circle' 
      onClick={() => {
        if (button.openModal) {
          button.openModal(); // Open modal for removeFile
        }else {
          button.onClick(file); // Pass data for other buttons
        }
      }}
      >
        <i className={`pi ${button.icon} text-gray-500`}></i>
      </button>
    </>
  )
}

export default Button
