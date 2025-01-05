/* eslint-disable react-refresh/only-export-components */

const FAQ = () => {
  return (
    <div id="faq" className='grid lg:grid-cols-2 lg:px-24 py-14 px-4'>
      <div className="space-y-4 text-center lg:text-left mb-8">
       <span className="text-blue-500 bg-blue-50 font-medium rounded-full text-xs uppercase p-2">faq</span>
       <h2 className="lg:text-5xl text-2xl font-medium">Frequently asked questions</h2>
       <p className="text-xs text-gray-400">More questions? <a href="#" className="text-blue-500">Contact Us</a></p>
      </div>

      <div className="space-y-4">
        <div className="collapse collapse-plus border">
          <input type="radio" name="my-accordion-3"  />
          <div className="collapse-title text-xl font-medium">What is Xerics</div>
          <div className="collapse-content">
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro voluptatibus cupiditate ab laudantium deserunt autem quia expedita, non culpa eius?</p>
          </div>
        </div>
        <div className="collapse collapse-plus border">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">How do I sign up for Xerics</div>
          <div className="collapse-content">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis odit explicabo iste voluptatem in omnis, molestias quia voluptatibus ratione provident.</p>
          </div>
        </div>
        <div className="collapse collapse-plus border">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">How can I manage multiple projects with Xerics</div>
          <div className="collapse-content">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus consectetur nulla obcaecati officiis tenetur magnam perferendis, ea aut totam facere?</p>
          </div>
        </div>
        <div className="collapse collapse-plus border">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">How does the collaboration feature work</div>
          <div className="collapse-content">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis quibusdam eaque repudiandae magnam asperiores quam cumque ullam a ipsam nulla!</p>
          </div>
        </div>
        <div className="collapse collapse-plus border">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">Is Xerics free?</div>
          <div className="collapse-content">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam architecto dolorem sequi voluptas aspernatur temporibus.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
