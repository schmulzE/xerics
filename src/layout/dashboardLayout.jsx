/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import supabase from "../lib/supabase";
import Sidebar from "../components/ui/sidebar";
import { Navigate, Outlet} from "react-router-dom";
import {getUser} from '../features/auth/authThunks';
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from '../features/auth/authSlice';
import DashboardNavbar from "../features/dashboard/components/dashboardNavbar";
import DashboardFooter from "../features/dashboard/components/dashboardFooter";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);


  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      session?.user ? dispatch(getUser()) : dispatch(clearUser());
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        dispatch(getUser());
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
      }
    });

    // Cleanup
    return () => supabase.removeChannel(subscription);
  }, [dispatch]);
  

  return (
    <>
    { user ? (
      <div className="overflow-hidden flex h-screen">
        <div>
          <Sidebar/>
        </div>
        <div className="overflow-auto w-full bg-base-200 h-screen">
          <DashboardNavbar/>
          <Outlet/>
          <DashboardFooter/>
        </div>
      </div> ) : 
      <Navigate to="/signin" replace={true} /> 
    }
    </>
  )
}


export default DashboardLayout