import Root from "./routes/root";
import 'remixicon/fonts/remixicon.css';
import Project from "./routes/project";
import Calendar from './routes/calendar';
import Settings from './routes/settings';
import Resources from './routes/resources';
import Dashboard from "./routes/dashboard";
import SignIn from './routes/account/signin';
import SignUp from './routes/account/signup';
import AddProject from './routes/addProject';
import EditProject from './routes/editProject';
import ProjectDetails from './routes/projectDetails';
import DashboardLayout from './layout/dashboardLayout';
import ReportAndAnalysis from './routes/reportAndAnalysis';
import ResetPassword from './routes/account/resetPassword';
import { BrowserRouter as Router,  Routes, Route } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root/>} exact />
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/account/resetpassword" element={<ResetPassword/>}/>

        <Route path="/dashboard" element={<DashboardLayout/>}>
          <Route path="" element={<Dashboard/>}/>
        </Route>

        <Route path="/projects" element={<DashboardLayout/>}>
          <Route path="" element={<Project/>}/>
          <Route path="/projects/:projectId" element={<ProjectDetails/>}/>
          <Route path="/projects/edit/:projectId" element={<EditProject/>}/>
        </Route>

        <Route path="/report-and-analysis" element={<DashboardLayout/>}>
          <Route path="" element={<ReportAndAnalysis/>}/>
        </Route>

        <Route path="/calendar" element={<DashboardLayout/>}>
          <Route path="" element={<Calendar/>}/>
        </Route>

        <Route path="/resources" element={<DashboardLayout/>}>
          <Route path="" element={<Resources/>}/>
        </Route>

        <Route path="/add-project/:projectId" element={<DashboardLayout/>}>
          <Route path="" element={<AddProject/>}/>
        </Route>

        <Route path="/settings" element={<DashboardLayout/>}>
          <Route path="" element={<Settings/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;