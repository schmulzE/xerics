import rocket from "../assets/images/rocket.png"
const CreateRooms = () => {
  return (
    <div className="flex flex-col justify-center h-full items-center m-auto">
      <div className="content-center text-center space-y-5">
      <img src={rocket} className="w-36 flex mx-auto align-middle"/>
      <h1 className="text-blue-500">Add a new project. You can add a new project by clicking on this button</h1>
      <button className="btn btn-outline lowercase text-blue-500 hover:bg-blue-500 hover:text-gray-100 hover:border-blue-500">create a new project</button>
    </div>
    </div>
  )
}

export default CreateRooms