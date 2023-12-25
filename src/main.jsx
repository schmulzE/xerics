import ReactDOM from 'react-dom/client'
import Root from "./routes/root";
import CreateProject from "./routes/createProject";
import Project from "./routes/project";
import Dashboard from "./routes/dashboard/dashboard";
import SignIn from './routes/signin';

import './index.css'

import 'primeicons/primeicons.css';
        

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from './layout/dashboardLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <CreateProject />,
      },
      {
        path: "/dashboard/:projectId",
        element: <Dashboard />,
      },
    ]
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "project/:projectId",
    element: <Project />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router}/>

)
