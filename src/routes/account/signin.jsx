import {useState} from 'react';
import supabase from '../../lib/supabase';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, getUser } from '../../features/auth/authThunks';
import { useToast } from "@/components/ui/use-toast";

export default function SignIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassword, setResetPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);

      await dispatch(signIn(formData)).unwrap();

      await dispatch(getUser()).unwrap();


      setTimeout(() => {
        navigate('/dashboard');
      }, 2000)
      
    } catch (error) {
      toast(error);
    }finally {
      setLoading(false)
    }
  }

  const sendResetPassword = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${import.meta.env.VITE_BASE_URL}/account/resetpassword`
      })
      if(!error) { 
        setSuccess(true)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (

    <div className='bg-base-200 h-screen flex justify-center content-center'>
      <div className="max-w-full w-9/12 flex m-auto lg:mx-auto py-10">
  
      {/* Login */}
      <div className='bg-blue-600 w-1/2 shadow-lg p-24 hidden lg:block relative'>
        <img src='/src/assets/images/logo_icon-white.png' className='w-8 absolute top-6 left-6' />
        <h1 className='text-2xl text-white'>Designed for individuals</h1>
        <p className='text-sm text-base-100 mt-4'>Simple, smart, and scalable. Manage projects of any size with ease using Xerics&apos; flexible and powerful platform</p>
        <img src='/src/assets/images/dashboard-slice.png' className=' w-96 absolute bottom-0 right-0' />
      </div>
      <form
        onSubmit={resetPassword ? sendResetPassword : handleSubmit}
        className="p-4 h-fit lg:h-full lg:p-24 flex flex-col bg-base-100 shadow-lg w-full lg:w-1/2"
      >
        {resetPassword ? (
          <>
            <div className="flex flex-col mb-2">
              <label htmlFor="email" className="mb-1 text-sm">Email</label>
              <input
                type="email"
                required
                placeholder='type in your email'
                className="p-2 input input-sm border border-gray-300 rounded-sm bg-white"
                id="email"
                name="email"
                onChange={handleChange}
              />
              <span className="text-xs mt-2">forgotten password?
                <button className=' cursor-pointer' onClick={() => setResetPassword(false)}>Login</button>
              </span> 
            </div>

            {success && <span className='bg-green-300 text-green-700 p-2 border border-green-500 text-sm'>Successful!, check your email to reset your password</span>}
            <button
              type="submit"
              className="mt-3 py-2 px-6 rounded-sm text-sm bg-blue-600 hover:bg-blue-700 text-center text-white w-full capitalize"
            >
              reset password
            </button>
        
          </>
        ) : (
        <>
          <h1 className="text-xl text-at-light-green mb-4">Login</h1>
    
          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              placeholder='type in your email'
              className="p-2 input input-sm border border-gray-300 rounded-sm bg-white"
              id="email"
              name="email"
              onChange={handleChange}
            />

          </div>
    
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-1 text-sm">Password</label>
            <input
              type="password"
              placeholder='type in your password'
              required
              className="p-2 border-gray-300 input input-sm border rounded-sm bg-base-100"
              id="password"
              name="password"
              onChange={handleChange}
            />
            <span className="text-xs mt-2">forgotten password?
              <button className='cursor-pointer underline text-blue-500 ml-1' onClick={() => setResetPassword(true)}>Reset password</button>
            </span> 
          </div>
    
          <button
            type="submit"
            disabled={loading}
            className="
            mt-6 py-2 px-6 
            rounded-sm disabled:bg-gray-400
            text-sm bg-blue-600 
            hover:bg-blue-700 text-center 
            text-white w-full flex justify-center content-center items-center gap-x-1"
          >
            {loading && <i className='pi pi-spin pi-spinner'></i>}
            Login
          </button>
        </>
        )}
  
        
        <div className="text-xs mt-6 text-center">Don`t have an account?
          <Link to="/signup"> 
            <span className="text-blue-500 underline ml-1">Register</span> 
          </Link>
        </div>
      </form>
    </div>
    </div>
  )
}