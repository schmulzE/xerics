// import Aside from "../components/aside"
// import KanbanBoard from "../components/kanbanBoard"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {


  return (
    <div className="overflow-hidden flex h-screen">
    <Sidebar/>
    <div className="w-full overflow-hidden">
      <Navbar/>
      {/* <KanbanBoard/> */}
      <Outlet/>
    </div>
  </div>
    // <>
    // <div className="flex flex-row">
    //   <main className=" flex-1">
    //     {children}
    //   </main>
    // </div>
    // </>
  )
}


export default DashboardLayout