import supabase from '../../../lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../../context/themeContext';

const Message = ({
  userId,
  message,
  profile,
  setProfileCache,
}) => {

  const { theme } = useTheme()

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
  }, [profile, message.profile_id, setProfileCache])

  return (
    <li className={`${message.profile_id === userId ? ' justify-end' : 'justify-start'} flex gap-2.5`} key={message.id}>
      <div className="flex flex-col gap-1 w-fit">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className={`${theme == 'dark' ? 'dark:text-white' : null} text-xs font-semibold text-gray-900`}>{profile?.username.replace(/['"]+/g, '') ?? 'Loading...'}</span>
        </div>
        <div className={`${message.profile_id === userId ? 'rounded-ee-xl rounded-s-xl' : 'rounded-e-xl rounded-es-xl'} ${theme == 'dark' ? 'dark:bg-gray-700' : null} flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-400`}>
          <p className="text-sm font-normal text-gray-900 dark:text-white">{message.content}</p>
        </div>
      </div>
    </li>
  )
}

export default function ProjectCommentMessages({
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
      .match({ project_id: roomId })
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  useEffect(() => {
   const subscription =  supabase
      .channel(`messages:room_id=eq.${roomId}`)
      .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      }, (payload) => {
        setMessages((current) => [...current, payload.new])
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [roomId])

  return (
    <div className="flex-1 h-28" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-4 p-4">
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