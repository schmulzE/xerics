import { useNavigate } from 'react-router-dom'
import supabase from '../lib/supabase'

export default function SignUp() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, username, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    )

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
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4">
      <form className="w-full space-y-2 shadow-sm" onSubmit={handleSubmit} >
        <label htmlFor="username">Username</label>
        <input type="text" name="username"  className="input input-md"/>
        <label htmlFor="email">Email</label>
        <input type="email" name="email"  className="input input-md"/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" className="input input-md"/>

        <button type="primary">
          Sign up
        </button>

      </form>
    </div>
  )
}