import { Link } from "react-router-dom";

const RootNavbar = () => {

  return (
    <div className="navbar w-full lg:py-4 lg:px-24">
      <div className="navbar-start">
        <Link to={'/'} className="md:text-md lg:text-xl text-xl font-semibold uppercase">xerics</Link>
      </div>
      <div className="navbar-center hidden md:flex lg:flex">
        <ul className="menu menu-horizontal px-1 capitalize">
          <li><a className="underlink hover:bg-transparent">features</a></li>
          <li tabIndex={0}>
            <details>
              <summary className="hover:bg-transparent underlink">plans</summary>
              <ul className="p-2">
                <li><a>Submenu</a></li>
                <li><a>Submenu</a></li>
              </ul>
            </details>
          </li>
          <li><a className="underlink hover:bg-transparent">resources</a></li>
          <li><a className="underlink hover:bg-transparent">about</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/signin" className="btn btn-sm hidden md:flex btn-outline font-medium hover:border-blue-500 hover:bg-blue-500">login</Link>
        <button className="md:hidden lg:hidden xl:hidden">
          <i className="pi pi-align-right text-2xl"></i>
        </button>
      </div>
    </div>
  )
}

export default RootNavbar