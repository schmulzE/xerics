import Messages from "./messages";
import supabase from "../lib/supabase";
// import Avatar from "./avatar";

const Aside = ({roomId, profileCache, setProfileCache, userId, setShowAside}) => {

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const { message } = Object.fromEntries(new FormData(form))

    if (typeof message === 'string' && message.trim().length !== 0) {
      form.reset()
      const { error } = await supabase
        .from('messages')
        .insert({ content: message, room_id: roomId })

      if (error) {
        // alert(error.message)
        console.log(error)
      }
    }
  }


  return (
    <aside className="absolute left-24 top-0 h-screen w-1/3 z-10 border border-gray-300">
    <main className="flex relative h-full w-full flex-1 flex-col items-stretch bg-[#EDF0F1] ">
      <div className="w-full rounded-none grid grid-cols-4 py-2 justify-start bg-columnBackgroundColor">
        <button className="absolute top-4 right-8 z-20" onClick={() => setShowAside(prev => prev = !prev)}><i className="pi pi-times text-lg mt-2 text-white"></i></button>
        <button className="btn btn-ghost mx-1 text-gray-100">
          invite
        </button>
        {/* <Avatar/> */}
      </div>
        <div className="h-fit flex-1 overflow-y-auto bg-black">
        {roomId && (
            <Messages
            userId={userId}
            roomId={roomId}
            profileCache={profileCache}
            setProfileCache={setProfileCache}
            />
          )} 
          </div>
        <form onSubmit={handleSubmit} className="p-2 bg-black">
          <input type="text" name="message" className="w-full input input-md bg-columnBackgroundColor rounded-md"/>
        </form>
      </main>
  </aside>
  )
}

export default Aside



    {/* <div className="text-3xl my-10 text-center ">Logo</div>
    <ul className="menu">
      <li><a href="/dashboard"><i className="pi pi-microsoft"></i>Dashboard </a></li>
      <li>
        <details open>
          <summary><i className="pi pi-folder"></i>Projects</summary>
          <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link reloadDocument to={`projects/${project.name}`}>
                {project.name}
              </Link>
            </li>
          ))}
          </ul>
        </details>
      </li>
      <li><a href="#" onClick={()=>document.getElementById('my_modal_1').showModal()}><i className="pi pi-plus"></i> Add project</a></li>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create project!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <form method="dialog" onSubmit={handleCreateProject}>
          <input type="text" placeholder="Type here" name="project" className="input input-sm w-full" />
          <div className="modal-action">
              <button type="submit" className="btn btn-success">Create</button>
              <button className="btn" onClick={()=>document.getElementById('my_modal_1').closeModal()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
      <li>
        <details open>
          <summary><i className="pi pi-comments"></i>Rooms</summary>
          <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <Link reloadDocument to={`rooms/${room.name}`}>
                {room.name}
              </Link>
            </li>
          ))}
          </ul>
        </details>
      </li>
      <li><a href="#" onClick={()=>document.getElementById('my_modal_2').showModal()}><i className="pi pi-plus"></i> Add room</a></li>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create room!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <form method="dialog" onSubmit={handleCreateRoom}>
          <input type="text" placeholder="Type here" name="room" className="input input-sm w-full" />
          <div className="modal-action">

              <button type="submit" className="btn btn-success">Create</button>
              <button className="btn">Close</button>
            </div>
          </form>
        </div>
      </dialog>
      <li><a><i className="pi pi-users"></i>Members</a></li>
      <li><Link to="/calendar"><i className="pi pi-calendar"></i>Calendar</Link></li> 
    </ul> */}