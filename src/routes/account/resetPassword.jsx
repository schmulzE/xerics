/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { resetPassword } from '../../features/auth/authThunks';


export default function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if(user !== null){
      return navigate('/dashboard');
    }
  }, [navigate, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(formData.password !== formData.confirmPassword){
        return;
      }
      await dispatch(resetPassword(formData.password)).unwrap();
    } catch (error) {
      throw new Error(error);
    }
  }

  return (

    <div className='bg-base-200 h-screen flex justify-center content-center'>
      <div className="max-w-full w-9/12 flex mx-auto py-10">
  
      {/* Login */}
      <div className='bg-blue-600 w-1/2 shadow-lg p-24'>
        <h1 className='text-2xl text-white'>Designed for individuals</h1>
        <p className='text-sm text-base-100 mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, sit iste! Voluptates commodi itaque ad!</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-24 flex flex-col bg-base-100 shadow-lg w-1/2"
      >
        <h1 className="text-xl text-at-light-green mb-4">Reset Password</h1>
  
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder='Enter new password'
            required
            className="p-2 border-gray-300 input input-sm border rounded-sm bg-base-100"
            id="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="confirmPassword" className="mb-1 text-sm">Confirm Password</label>
          <input
            type="password"
            placeholder='Enter new password'
            required
            className="p-2 border-gray-300 input input-sm border rounded-sm bg-base-100"
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
          />
        </div>
  
        <button
          type="submit"
          className="mt-6 py-2 px-6 rounded-sm text-sm bg-blue-600 hover:bg-blue-700 text-center capitalize text-white w-full "
        >
          confirm password
        </button>
  
        
        <div className="text-xs mt-6 text-center">Dont have an account?
          <Link to="/signup"> 
            <span className="text-at-light-green ml-1">Register</span> 
          </Link>
        </div>
      </form>
    </div>
    </div>
  )
}