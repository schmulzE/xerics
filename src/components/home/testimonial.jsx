import { Pagination } from 'swiper';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonial = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const testimonials = [
    {
      author: 'Albert J',
      avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
      caption: '+45% increase in productivity',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ducimus repellat animi vitae fugiat labore neque, id quam suscipit doloribus.',
      title: 'it is easy to use and helps me get things done',
    },
    {
      author: 'Lissa J',
      avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
      caption: '+45% increase in productivity',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ducimus repellat animi vitae fugiat labore neque, id quam suscipit doloribus.',
      title: 'it makes sure I never miss a deadline',
    },
    {
      author: 'Amber J',
      avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
      caption: '+45% increase in productivity',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ducimus repellat animi vitae fugiat labore neque, id quam suscipit doloribus.',
      title: 'it is easy to use and helps me get things done',
    },
    {
      author: 'Albert J',
      avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
      caption: '+45% increase in productivity',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ducimus repellat animi vitae fugiat labore neque, id quam suscipit doloribus.',
      title: 'it makes sure I never miss a deadline',
    },
  ];


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="lg:h-auto text-center lg:py-14 py-14 space-y-4 lg:px-24 px-4 bg-base-200">
      <div className='lg:grid lg:grid-cols-2 lg:items-center space-y-8 lg:space-y-0 mb-8'>
        <div className='lg:text-left space-y-4'>
          <span className="text-blue-500 bg-blue-50 font-medium rounded-full text-xs uppercase p-2">testimonials</span>
          <h2 className="text-4xl font-medium lg:w-96">What are customers say</h2>
        </div>
        <div className='lg:flex lg:justify-end lg:self-end'>
          <button className="btn btn-base bg-blue-500 hover:bg-blue-700 text-base-100 capitalize">Read More</button>
        </div>
      </div>
      
      <Swiper
      modules={[ Pagination ]}
      spaceBetween={50}
      slidesPerView={slidesPerView}
      pagination={{ clickable: true, type: 'bullets' }}
      className='custom-swiper'
      >
        {testimonials.map((testimonial, index)=> (
          <SwiperSlide key={index} className='p-4 border border-gray-300 bg-base-100 text-left mb-8 space-y-8 rounded-lg'>
            <div className="rating mb-4">
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" defaultChecked />
            </div>
            <div className='text-left space-y-2'>
              <h1 className='text-xl font-semibold first-letter:uppercase'>{testimonial.title}</h1>
              <p className='lowercase first-letter:uppercase'>{testimonial.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={testimonial.avatar} />
                </div>
              </div>
              <span className='font-medium'>{testimonial.author}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Testimonial;

