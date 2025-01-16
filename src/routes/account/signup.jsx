/* eslint-disable no-unused-vars */
import {useState} from 'react';
import { useDispatch } from 'react-redux';
// import supabase  from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../features/auth/authThunks';

export default function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
  
      const form = e.currentTarget;
      const { firstName, lastName, email, password } = Object.fromEntries(new FormData(form));
      await dispatch(signUp({ firstName, lastName, email, password })).unwrap();

      setTimeout(() => {
        navigate('/signin');
      }, 2000)
      
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }

  }

  return (

    <div className='bg-base-200 h-screen flex justify-center content-center'>
      <div className="max-w-full w-9/12 flex m-auto lg:mx-auto py-10">
  
      <div className='bg-blue-600 w-1/2 shadow-lg p-24 hidden lg:block relative'>
        <img src='/src/assets/images/logo_icon-white.png' className='w-8 absolute top-6 left-6' />
        <h1 className='text-2xl text-white'>Designed for individuals</h1>
        <p className='text-sm text-base-100 mt-4'>Simple, smart, and scalable. Manage projects of any size with ease using Xerics&apos; flexible and powerful platform</p>
        <img src='/src/assets/images/dashboard-slice.png' className=' w-96 absolute bottom-0 right-0' />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 h-fit lg:h-full lg:p-24 flex flex-col bg-base-100 shadow-lg w-1/2"
      >
       
        <>
          <h1 className="text-xl text-at-light-green mb-4">Sign Up</h1>
    
          <div className="flex flex-col mb-2">
            <label htmlFor="username" className="mb-1 text-xs">First Name</label>
            <input
              type="text"
              required
              placeholder='Enter first name'
              className="p-2 input input-sm border border-gray-300 rounded-sm bg-white"
              id="firstName"
              name="firstName"
              onChange={handleChange}
            />

          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="username" className="mb-1 text-xs">Last Name</label>
            <input
              type="text"
              required
              placeholder='Enter last name'
              className="p-2 input input-sm border border-gray-300 rounded-sm bg-white"
              id="lastName"
              name="lastName"
              onChange={handleChange}
            />

          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="mb-1 text-xs">Email</label>
            <input
              type="email"
              required
              placeholder='Enter email'
              className="p-2 input input-sm border border-gray-300 rounded-sm bg-white"
              id="email"
              name="email"
              onChange={handleChange}
            />

          </div>
    
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-1 text-xs">Password</label>
            <input
              type="password"
              placeholder='Enter password'
              required
              className="p-2 border-gray-300 input input-sm border rounded-sm bg-base-100"
              id="password"
              name="password"
              onChange={handleChange}
            />
          </div>
    
          <button
            type="submit"
            disabled={loading}
            className="mt-6 py-2 px-6 rounded-sm disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center gap-x-1
             text-sm bg-blue-600 hover:bg-blue-700 text-center text-white w-full "
          >
            {loading && <i className='pi pi-spin pi-spinner '></i>}
            Signup
          </button>
        </>
  
        
        <div className="text-xs mt-6 text-center">Have an account?
          <Link to="/signin"> 
            <span className="text-blue-500 underline ml-1">Sign In</span> 
          </Link>
        </div>
      </form>
    </div>
    </div>
  )
}