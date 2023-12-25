import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { useNavigate, useParams, NavLink, } from "react-router-dom"
import Aside from './aside'

const Sidebar = () => {
  const navigate = useNavigate()
  let { projectId } = useParams()
  const [roomId, setRoomId] = useState('')
  const [projects, setProjects] = useState([])
  const [room, setRoom] = useState([])
  const [projectName, setProjectName] = useState('')
  const [profileCache, setProfileCache] = useState({})
  const [userId, setUserId] = useState('')
  const [showAside, setShowAside] = useState(false)


  useEffect( () => {
    const fetchSession = async () => {
      let session =  await supabase.auth.getSession()
      const data = session.data;
      let user = data.session.user
      setUserId(user.id)
    }

    fetchSession()
    
  }, [])

  useEffect(() => {
    const getroomId = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('id')
        .match({
          project_id: projectId,
        })
        .single()

      setRoomId(data.id)
    }

    if (projectId) {
      getroomId()
    }
  }, [projectId])


  useEffect(() => {
    const getRooms = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })

       
      if (data) {
        setRoom(data)
      }
    }

    getRooms()
  }, [])

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (data) {
        console.log(data)
        setProjects(data)
      }
      if(error) console.log(error)
    }

    getProjects()
  }, [])
  
  useEffect(() => {
    const getProjectName = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .match({ id: projectId})
        
      if (data) {
        setProjectName(data[0].name)
      }
      if(error) console.log(error)
    }

    getProjectName()
  }, [projectId])


  const handleCreateProject = async (e) => {

    const form = e.currentTarget
    const { project } = Object.fromEntries(new FormData(form))

    if (typeof project === 'string' && project.trim().length !== 0) {
      const { data, error } = await supabase.rpc('create_project', {
        name: project
      }).single()

      if (error) {
        alert(error.message)
        return
      }
      
      if (data) {
        navigate(`projects/${data.name}`)
      }

    }
  }
  return (
    <>
    <div className='sticky top-0 left-0 border-r flex flex-col justify-center content-center  border-mainBackgroundColor bg-black z-50 w-24 text-center'>
      <div className='p-5 border-b border-gray-800'>Logo</div>

      <div className="mt-4 flex-1">
        {projects.map(project => (
        <div key={project.id} className="avatar placeholder tooltip tooltip-right capitalize" data-tip={project.name}>
           <NavLink to={`/dashboard/${project.id}`} className={({isActive}) => isActive ? "ring-2 bg-neutral-focus btn ring-blue-500 hover:ring-2 hover:text-blue-500 text-neutral-content rounded-full w-12 align-top" : " " + " bg-neutral-focus btn ring-blue-500 hover:ring-2 hover:text-blue-500 text-neutral-content rounded-full w-12"}>
            <span className="text-lg uppercase block">{project.name.substring(0, 1)}</span>
          </NavLink>
        </div>))}
        <div className="mt-4 avatar placeholder tooltip tooltip-right" data-tip="create new room">
            <button className="bg-neutral-focus text-neutral-content rounded-full btn-circle w-12" onClick={()=>document.getElementById('my_modal_1').showModal()}>
              <i className="pi pi-plus text-md text-blue-500"></i>
            </button>
            <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h1 className="uppercase my-2 font-medium text-left">create new project</h1>
              <form method="dialog" onSubmit={handleCreateProject}>
                <input className="input bg-mainBackgroundColor focus:outline-blue-500 w-full"/>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                  <button className="btn bg-pink-400 hover:bg-pink-500 text-white" type="submit">add</button>
                  <button className="btn">Close</button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
          <div className="tooltip tooltip-right mt-4" data-tip="show room">
            <button className="btn bg-neutral-focus text-neutral-content btn-circle" onClick={() => setShowAside(true)}>
              <i className='pi pi-comments text-lg block text-blue-400'></i>
            </button>
          </div>
      </div>
    </div>
      {showAside && 
      <Aside
      userId={userId} 
      setShowAside={setShowAside} 
      roomId={roomId} 
      profileCache={profileCache} 
      setProfileCache={setProfileCache}
      />}
    </>
  )
}

export default Sidebar