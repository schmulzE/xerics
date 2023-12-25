import { useEffect, useState, useRef } from 'react'
import supabase from '../lib/supabase'
import { useUser } from '../../context/usercontext'

const Message = ({
  userId,
  message,
  profile,
  setProfileCache,
}) => {

  const { user} = useUser()
  console.log(user, useUser())

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .match({ id: message.profile_id })
        .single()

      if (data) {
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }))
      }
    }
    if (!profile) {
      fetchProfile()
    }
  }, [profile, message.profile_id])

  return (
    <li
      key={message.id}
      className={
        message.profile_id === userId
          ? 'chat chat-end px-2'
          : 'chat chat-start chat-bubble px-2'
      }
    >
      <span className="block text-xs text-gray-600">
        {profile?.username ?? 'Loading...'}
      </span>
      <span className="chat-bubble">{message.content}</span>
    </li>
  )
}

export default function Messages({
  userId,
  roomId,
  profileCache,
  setProfileCache,
}) {
  const [messages, setMessages] = useState([])
  const messagesRef = useRef(null)



  const getData = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profile: profiles(id, username)')
      .match({ room_id: roomId })
      .order('created_at')

    if (!data) {
      return
    }

    const newProfiles = Object.fromEntries(
      data
        .map((message) => message.profile)
        .filter(Boolean) // is truthy
        .map((profile) => [profile.id, profile])
    )

    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }))

    setMessages(data)

    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
   const subscription =  supabase
      .channel(`messages:room_id=eq.${roomId}`)
      .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      }, (payload) => {
        // TODO: add new user to cache if their profile doesn't exist
        setMessages((current) => [...current, payload.new])
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [roomId])

  return (
    <div className="flex-1 h-screen" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-1 p-4">
        {messages.map((message) => (
          <Message
            userId={userId} 
            key={message.id}
            message={message}
            profile={profileCache[message.profile_id]}
            setProfileCache={setProfileCache}
          />
        ))}
      </ul>
    </div>
  )
}