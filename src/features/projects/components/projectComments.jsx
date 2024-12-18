import { useEffect, useState } from 'react';
import supabase from "../../../lib/supabase";
import { useParams } from "react-router-dom";
import CardWrapper from '../../../components/ui/cardWrapper';
import Messages from '../../../components/messages/messages';

const ProjectComments = () => {
  const [profileCache, setProfileCache] = useState({});
  const [userId, setUserId] = useState('');
  let { projectId } = useParams();
    
  useEffect( () => {
    const fetchSession = async () => {
      let session = await supabase.auth.getSession()
      const data = session.data;
      let user = data.session.user
      setUserId(user.id)
    }

    fetchSession()
    
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const { message } = Object.fromEntries(new FormData(form))
  
    if (typeof message === 'string' && message.trim().length !== 0) {
      form.reset()
      const { error } = await supabase
        .from('messages')
        .insert({ content: message, project_id: projectId, profile_id: userId })
  
      if (error) {
        throw new Error('An error occured while submitting message: ', error.message)
      }
    }
  }

  return (
    <>
      <CardWrapper 
      title={'comments'}
      containerClass={'w-full capitalize'}
      icon={'pi-ellipsis-v'}
      iconClass={'text-gray-600'}
      >
        <main className="flex relative h-56 w-full flex-1 flex-col items-stretch">
          <div className="h-fit flex-1 overflow-y-auto bg-base-200 comment">
            {projectId && (
              <Messages
                userId={userId}
                roomId={projectId}
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

export default ProjectComments