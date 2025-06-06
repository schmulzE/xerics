import FileDeleteButton from "../../features/projectsFiles/components/fileDeleteButton"

const CardWrapper = ({
    title,
    titleClass,
    subtitle,
    subtitleClass,
    text,
    textClass,
    containerClass,
    buttonWrapper,
    buttons,
    children
  }) => {
  return (
    <div className={`${containerClass} rounded-lg bg-base-100 p-4`}>
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className={`text-lg font-bold ${titleClass}`}>{title}</h1>
          <h2 className={`${subtitleClass}`}>{subtitle}</h2>
        </div>
        <div className={`${buttonWrapper}`}>
        { buttons && buttons.map((button, index) => (
          <FileDeleteButton key={index} button={button} file={{}}/>
          ))
        }
        </div>
      </div>
      <h1 className={`text-4xl font-semibold my-2 ${textClass}`}>{text}</h1>
      {children}
    </div>
  )
}

export default CardWrapper