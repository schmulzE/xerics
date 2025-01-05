const Features = () => {
  return (
    <div id='features' className="lg:h-auto text-center py-14 space-y-4 lg:px-24 px-4">
      <div className='lg:grid lg:grid-cols-2 lg:items-center mb-8 space-y-8 lg:space-y-0'>
        <div className='lg:text-left space-y-4'>
          <span className="text-blue-500 bg-blue-50 font-medium rounded-full text-xs uppercase p-2">features</span>
          <h2 className="text-4xl font-medium lg:w-96">Discover our key features</h2>
        </div>
        <div className='lg:flex lg:justify-end lg:self-end'>
          <button className="btn btn-base bg-blue-500 hover:bg-blue-700 text-base-100 capitalize">Explore More</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3">
        <div className="border rounded-md p-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-11 text-purple-500 mx-auto border rounded-full p-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <h3 className="mt-4 mb-2 capitalize text-md font-medium">integrated chat</h3>
          <p className="text-sm w-full text-center text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
        <div className="border rounded-md p-8">
          <svg className="size-11 text-orange-500 rounded-full p-2 border mx-auto" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="6" height="16" rx="2" />  <rect x="14" y="4" width="6" height="10" rx="2" /></svg>
          <h3 className="mt-4 mb-2 capitalize text-md  font-medium">multiple view</h3>
          <p className="text-sm text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
        <div className="border rounded-md p-8">
          <i className="pi pi-list text-xl border rounded-full p-2 mx-auto text-purple-500"/>
          <h3 className="mt-4 mb-2 capitalize text-md font-medium">tasks priority</h3>
          <p className="text-sm text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
        <div className="border rounded-md p-8">
          <svg className="border size-11 rounded-full p-2 text-green-500 mx-auto " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64" />
          </svg>
          <h3 className="mt-4 mb-2 capitalize text-md font-medium">remote ready</h3>
          <p className="text-sm text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
        <div className="border rounded-md p-8">
          <i className="pi pi-send text-xl border rounded-full p-2 text-pink-500"></i>
          <h3 className="mt-4 mb-2 capitalize text-md font-medium">easy to use</h3>
          <p className="text-sm text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
        <div className="border rounded-md p-8">
          <i className="text-xl border rounded-full p-2 mx-auto pi pi-lock text-blue-500"/>
          <h3 className="mt-4 mb-2 capitalize text-md font-medium">enhance data security</h3>
          <p className="text-sm text-gray-500">Lorem, ipsum dolor sit amet consectetur et ties adipisicing elit.</p>
        </div>
      </div>
    </div>
  )
}

export default Features;