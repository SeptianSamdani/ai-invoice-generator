import React from 'react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      company: "Studio Creative",
      avatar: "SJ",
      content: "This invoice app has completely transformed how I handle billing. What used to take me hours now takes minutes. The AI feature is incredibly accurate.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      company: "Tech Solutions Inc",
      avatar: "MC",
      content: "The payment reminders have improved our cash flow significantly. We've reduced late payments by 60% since switching to this platform.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Consultant",
      company: "Growth Marketing Co",
      avatar: "ER",
      content: "I love how professional my invoices look now. The custom branding feature helps me maintain consistency across all client communications.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Web Developer",
      company: "Code & Design Studio",
      avatar: "DP",
      content: "The analytics dashboard gives me insights I never had before. Now I can make better decisions about my business and track growth easily.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Consultant",
      company: "Business Solutions",
      avatar: "LT",
      content: "Simple, effective, and reliable. This is exactly what small businesses need - powerful features without the complexity of enterprise software.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Photographer",
      company: "Wilson Photography",
      avatar: "JW",
      content: "The mobile app is fantastic. I can create and send invoices right after a shoot. My clients appreciate the quick turnaround time.",
      rating: 5
    }
  ]

  return (
    <section className='relative overflow-hidden py-24 lg:py-32'>
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-blue-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-60 right-20 w-4 h-4 bg-indigo-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-60 left-20 w-3 h-12 bg-purple-400/20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-8 h-8 bg-blue-300/20 rotate-12 animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fadeInUp">
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6 drop-shadow-lg'>
            What our customers say
          </h2>
          <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto drop-shadow-sm'>
            Join thousands of satisfied businesses who have streamlined their invoicing process and improved their cash flow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-fadeInUp delay-200">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative">
              {/* Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-2xl"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60 group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}

export default Testimonials