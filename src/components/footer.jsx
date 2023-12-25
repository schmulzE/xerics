const Footer = () => {
  return (
    <div className="bg-[#141126] text-gray-100 font-bold pl-4 py-12">
      <h1 className="text-4xl capitalize mb-10">xerics</h1>
      <ul className="flex flex-col space-y-10 text-sm">
        <li>
          <a href="#">Documentation</a>
        </li>
        <li>
          <a href="#">Features</a>
        </li>
        <li>
          <a href="#">Pricing</a>
        </li>
        <li>
          <a href="#">Privacy Policy</a>
        </li>
        <li>
          Copyright © 2023 XERICS
        </li>
      </ul>
    </div>
  )
}

export default Footer