import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import SarahJohnson from "@/assets/images/sarah_johnson.jpg";
import MikeChen from "@/assets/images/mike_chen.jpg";
import EmilyDavis from "@/assets/images/emily_davis.jpg";
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    content: "This tool has revolutionized how our team manages projects. The kanban boards are incredibly intuitive.",
    avatar: SarahJohnson,
  },
  {
    name: "Mike Chen",
    role: "Team Lead",
    company: "StartupXYZ",
    content: "The analytics features give us insights we never had before. Highly recommended!",
    avatar: MikeChen,
  },
  {
    name: "Emily Davis",
    role: "CEO",
    company: "InnovateLab",
    content: "Best project management tool we've used. The calendar integration is seamless.",
    avatar: EmilyDavis,
  },
]

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }, [])
  
  return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about ProjectFlow.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="border-blue-100 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed">
                      &quot;{testimonials[currentTestimonial].content}&quot;
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">{testimonials[currentTestimonial].name}</div>
                        <div className="text-sm text-gray-600">
                          {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonials;

