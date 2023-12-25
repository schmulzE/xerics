import { Link, useNavigate } from 'react-router-dom'
import supabase from '../lib/supabase'
import {useState} from 'react'

export default function SignIn() {
  const navigate = useNavigate()
  const [error, setError] = useState()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    )

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
  }

  return (

    <>
      <div className="max-w-screen-sm mx-auto px-4 py-10">
      {/* Error Handling */}
     {error && <div className="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
        <p className="text-red-500">{ error }</p>
      </div>}
  
      {/* Login */}
      <form
        onSubmit={handleSubmit}
        className="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
      >
        <h1 className="text-3xl text-at-light-green mb-4">Login</h1>
  
        <div className="flex flex-col mb-2">
          <label htmlFor="email" className="mb-1 text-sm text-at-light-green">Email</label>
          <input
            type="text"
            required
            className="p-2 text-gray-500 focus:outline-none"
            id="email"
            name="email"
          />
        </div>
  
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="mb-1 text-sm text-at-light-green">Password</label>
          <input
            type="password"
            required
            className="p-2 text-gray-500 focus:outline-none"
            id="password"
            name="password"
          />
        </div>
  
        <button
          type="submit"
          className="mt-6 py-2 px-6 rounded-sm self-start text-sm
        text-black bg-at-light-green duration-200 border-solid
        border-2 border-transparent hover:border-at-light-green hover:bg-white
        hover:text-at-light-green"
        >
          Login
        </button>
  
        <Link className="text-sm mt-6 text-center" to="/Signup">
          Dont have an account? <span className="text-at-light-green">Register</span>
        </Link>
      </form>
    </div>
    </>
  )
}