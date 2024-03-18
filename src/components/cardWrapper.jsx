const CardWrapper = ({
    title,
    titleClass,
    subtitle,
    subtitleClass,
    text,
    textClass,
    icon,
    iconClass,
    containerClass,
    buttonClass,
    buttonText,
    buttonHandler,
    children
  }) => {
  return (
    <div className={`${containerClass} rounded-lg bg-base-100 p-4 capitalize`}>
      <div className="flex justify-between mb-4">
        <div className="">
          <h1 className={`text-lg font-medium ${titleClass}`}>{title}</h1>
          <h2 className={`${subtitleClass}`}>{subtitle}</h2>
        </div>
        <button 
        className={`${buttonClass}`} 
        onClick={() => buttonHandler()}
        >
          <i className={`pi text-md block text-blue-400" + ${icon} ${iconClass}`}></i>
          <span>{buttonText}</span>
        </button>
      </div>
      <h1 className={`text-4xl font-semibold my-2 ${textClass}`}>{text}</h1>
      {children}
    </div>
  )
}

export default CardWrapper