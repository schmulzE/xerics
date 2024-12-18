const FileDeleteButton = ({button, file}) => {

  return (
    <>
      <button
      type="button"
      className={`${button.class}`}
      onClick={() => {
        if (button.openModal) {
          button.openModal();
        } else {
          button.onClick(file);
        }
      }}
      >
        <i className={`${button.icon}`}></i>
        <span className="capitalize">{button.text}</span>
      </button>
    </>
  )
}

export default FileDeleteButton
