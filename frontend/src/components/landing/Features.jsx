import React from 'react'

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Smart Invoice Creation",
      description: "Create professional invoices in seconds with our intelligent text processing. Just describe what you need and we'll handle the rest.",
      stats: "95% faster than traditional methods"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Revenue Analytics",
      description: "Get clear insights into your cash flow patterns, outstanding payments, and business growth trends with easy-to-understand reports.",
      stats: "Track 15+ key metrics"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Payment Reminders",
      description: "Never lose track of unpaid invoices. Our system sends gentle, professional reminders at the right time to improve collection rates.",
      stats: "40% better collection rate"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Reliable",
      description: "Your financial data is protected with industry-standard security. We backup everything automatically so you never lose important information.",
      stats: "99.9% uptime guarantee"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mobile Ready",
      description: "Access your invoices from anywhere. Our mobile app works offline and syncs when you're back online, so you're always up to date.",
      stats: "Works on any device"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a4 4 0 01-4 4z" />
        </svg>
      ),
      title: "Custom Branding",
      description: "Make invoices that reflect your brand. Add your logo, choose colors, and customize the layout to match your business identity perfectly.",
      stats: "Unlimited customization"
    }
  ]

  return (
    <section id="features" className='relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden py-24 lg:py-32'>
      {/* Animated Background Pattern - Same as Hero */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:40px_40px] animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-10 w-8 h-8 bg-blue-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-60 left-20 w-6 h-6 bg-indigo-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-60 right-20 w-4 h-16 bg-purple-400/20 animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-12 h-12 bg-blue-300/20 rotate-12 animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header with Gradient Text */}
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fadeInUp">
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6 drop-shadow-lg'>
            Everything you need to manage invoices efficiently
          </h2>
          <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto drop-shadow-sm'>
            We've built the tools small businesses actually need, without the complexity and bloat of enterprise software.
          </p>
        </div>

        {/* Enhanced Features Grid with Modern Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20 animate-fadeInUp delay-200">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Simplified Card Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-2xl"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60 group-hover:shadow-xl transition-shadow duration-300">
                {/* Icon with Clean Styling */}
                <div className="flex-shrink-0 mb-6">
                  <div className="w-16 h-16 bg-white text-blue-900 rounded-2xl flex items-center justify-center border-2 border-blue-200 shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed text-lg'>
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center justify-end w-full">
                    <span className="text-sm font-bold text-blue-700">
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Social Proof Section */}
        <div className="relative animate-fadeInUp delay-400">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent rounded-3xl blur-3xl transform translate-y-8"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-3xl blur-2xl"></div>
          
          {/* Floating Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 p-1 animate-pulse">
            <div className="h-full w-full rounded-3xl bg-white/90"></div>
          </div>

          {/* Main Content */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 lg:p-16 shadow-2xl shadow-blue-900/10 border border-white/50">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
                Trusted by 5,000+ small businesses
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From freelancers to growing companies, businesses save an average of 5 hours per week on invoice management.
              </p>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid sm:grid-cols-3 gap-8 mb-12">
              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">500K+</div>
                <div className="text-gray-600 text-lg font-medium">Invoices processed</div>
                <div className="w-12 h-1 bg-blue-900 mx-auto mt-2 rounded-full"></div>
              </div>

              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">$50M+</div>
                <div className="text-gray-600 text-lg font-medium">Payments tracked</div>
                <div className="w-12 h-1 bg-blue-900 mx-auto mt-2 rounded-full"></div>
              </div>

              <div className="text-center group">
                <div className="text-4xl lg:text-5xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-gray-600 text-lg font-medium">Customer satisfaction</div>
                <div className="w-12 h-1 bg-blue-900 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="text-center flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/sign-up" 
                className="group bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 shadow-xl shadow-blue-900/20 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Start your free trial</span>
              </a>
              <a 
                href="/demo" 
                className="group border-2 border-slate-800 text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/70 inline-flex items-center"
              >
                <span className="group-hover:animate-pulse mr-2">Watch a demo</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-8V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4h16z" />
                </svg>
              </a>
            </div>

            {/* Glossy Overlay Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Elements Around Social Proof */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce opacity-60 shadow-lg"></div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-indigo-500 rounded-full animate-pulse opacity-60 shadow-lg"></div>
          <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-purple-500 rounded-full animate-ping opacity-40 shadow-lg"></div>
          <div className="absolute -bottom-2 -right-4 w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-300 opacity-60 shadow-lg"></div>
        </div>
      </div>

      {/* Custom CSS for animations - Same as Hero */}
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
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        .bg-grid-slate-200\/50 {
          background-image: radial-gradient(circle, rgb(226 232 240 / 0.5) 1px, transparent 1px);
        }
      `}</style>
    </section>
  )
}

export default Features