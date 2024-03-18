import { useEffect, useState } from 'react';
import CardWrapper from './cardWrapper';
import Messages from './messages';
import supabase from "../lib/supabase";
import { useParams } from "react-router-dom";

const Chat = () => {
    // eslint-disable-next-line no-unused-vars
    const [room, setRoom] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [showAside, setShowAside] = useState(false)
    const [profileCache, setProfileCache] = useState({})
    const [roomId, setRoomId] = useState('')
    const [userId, setUserId] = useState('')
    // eslint-disable-next-line no-unused-vars
    const [projects, setProjects] = useState([])
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const { message } = Object.fromEntries(new FormData(form))
  
    if (typeof message === 'string' && message.trim().length !== 0) {
      form.reset()
      const { error } = await supabase
        .from('messages')
        .insert({ content: message, project_id: projectId })
  
      if (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <CardWrapper 
      title={'comment'}
      containerClass={'w-full mt-2'}
      icon={'pi-ellipsis-v'}
      iconClass={'text-gray-600'}
      >
      <main className="flex relative h-48 w-full flex-1 flex-col items-stretch">
          <div className="h-fit flex-1 overflow-y-auto bg-base-200">
            {roomId && (
              <Messages
                userId={userId}
                roomId={roomId}
                profileCache={profileCache}
                setProfileCache={setProfileCache}
              />
            )} 
          </div>
          <form onSubmit={handleSubmit} className="py-2 bg-base-100">
            <input 
              type="text" 
              name="message" 
              placeholder='type your comment...'
              className="w-full input input-md bg-base-200 rounded-md border border-base-200"
            />
          </form>
        </main>
      </CardWrapper>
    </>
  )
}

export default Chat