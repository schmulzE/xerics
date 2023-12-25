import { useParams } from "react-router-dom"
import {useEffect, useState} from 'react'
import supabase from "../lib/supabase"
// import Avatar from './avatar'
import Aside from './aside'

const Navbar = () => {
  // eslint-disable-next-line no-unused-vars
  const [room, setRoom] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [projects, setProjects] = useState([])
  const [showAside, setShowAside] = useState(false)
  const [profileCache, setProfileCache] = useState({})
  const [roomId, setRoomId] = useState('')
  const [userId, setUserId] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [projectName, setProjectName] = useState('')
  let { projectId } = useParams()

  useEffect( () => {
    const fetchSession = async () => {
      let session = await supabase.auth.getSession()
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


  return (
    <div className="navbar px-4 border-b border-columnBackgroundColor">
      <div className="navbar-start">
      </div>
      <div className="navbar-end gap-x-3">
      <div className="avatar placeholder">
        <div className="bg-blue-500 text-neutral-content rounded-full w-10">
          <span className="text-lg text-white">Sc</span>
        </div>
      </div> 
      <div className="indicator">
        <button className="btn bg-blue-500 hover:bg-blue-600 text-white capitalize">
         logout
        </button>
         
      </div>
        {showAside && 
          <Aside 
          userId={userId}
          setShowAside={setShowAside} 
          roomId={roomId} 
          profileCache={profileCache} 
          setProfileCache={setProfileCache}
          />}
      </div>
    </div>
  )
}

export default Navbar