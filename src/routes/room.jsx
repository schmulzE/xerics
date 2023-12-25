
import supabase from '../lib/supabase';
import Messages from '../components/messages'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function Room() {
  const [profileCache, setProfileCache] = useState({})
  const [roomId, setRoomId] = useState('')
  const [userId, setUserId] = useState('')
  let { roomName } = useParams()

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
          name: roomName,
        })
        .single()

      setRoomId(data.id)
    }

    if (roomName) {
      getroomId()
    }
  }, [roomName])

  console.log(roomId)

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

  const handleInvite = async (e) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget

      const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .match({ username: target.value })
        .single()

      if (!data) {
        return alert('No user found!')
      }

      const { error } = await supabase
        .from('room_participants')
        .insert({ profile_id: data.id, room_id: roomId })

      if (error) {
        return alert(error.message)
      }

      target.value = ''
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 text-gray-800">
        <div className="flex justify-between bg-green-200 px-4 py-2">
          <input type="text" onKeyPress={handleInvite} />
        </div>
        <div className="h-fit flex-1 overflow-y-auto">

        {roomId && (
            <Messages
            userId={userId}
            roomId={roomId}
            profileCache={profileCache}
            setProfileCache={setProfileCache}
            />
          )} 
          </div>
        <form onSubmit={handleSubmit} className="bg-red-200 p-2">
          <input type="text" name="message" className="w-full input input-md"/>
        </form>
      </main>
    </div>
  )
}