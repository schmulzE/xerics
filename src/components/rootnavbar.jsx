const RootNavbar = () => {

  return (
    <div className="navbar w-full lg:py-4 shadow-md">
    <div className="navbar-start">
      <a className="btn btn-ghost normal-case md:text-md lg:text-xl text-xl font-semibold">Xerics</a>
    </div>
    <div className="navbar-center hidden md:flex lg:flex">
      <ul className="menu menu-horizontal px-1">
        <li><a>Item 1</a></li>
        <li tabIndex={0}>
          <details>
            <summary>Parent</summary>
            <ul className="p-2">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </details>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <div className="navbar-end">
      <a className="btn btn-md hidden md:flex">sign up</a>
      <button className="md:hidden lg:hidden xl:hidden">
        <i className="pi pi-align-right text-2xl"></i>
      </button>
    </div>
  </div>
  )
}

export default RootNavbar