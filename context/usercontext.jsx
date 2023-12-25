import{ useState, createContext, useContext, useEffect, useRef} from 'react'
import supabase from '../src/lib/supabase';
import { useNavigate } from 'react-router-dom';



const UserContext = createContext({
  user: {},
  signIn: () => {},
  signUp: () => {},
  error: ''
})

// eslint-disable-next-line react-refresh/only-export-components
export const useUser =  () => useContext(UserContext)

const UserProvider = ({children}) => {
  const firstRender = useRef(true)
  const [user, setUser] = useState({
    'money': '$20'
  })
  const [error, setError] = useState({})
  const navigate = useNavigate()


  useEffect(() =>{
    if(firstRender.current) {
      firstRender.current = false
      const fetchSession = async () => {
        let session =  await supabase.auth.getSession()
        const data = session.data;
        setUser(data.session)
      }
      fetchSession()
    }
  },[])

  const signIn = async(email, password) => {
    try {
      if (typeof email === 'string' && typeof password === 'string') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
  
        if (error) {
          setError(error.message)
          return
        }
  
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const signUp = async(email, password, username) => {
    try {
      if (
        typeof email === 'string' &&
        typeof password === 'string' &&
        typeof username === 'string'
      ) {
        await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                username,
              },
            }
          },
        )
      }
      navigate('/dashboard')
    } catch (error) {
      setError(error)
    }
  }


  return (
    <UserContext.Provider value={{user, signIn, signUp, error}}>
    {children}
    </UserContext.Provider>
  )
}

export default UserProvider