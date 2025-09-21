import React from 'react'
import { Link } from 'react-router-dom'; 

const Hero = () => {
    const isAuthenticated = false; 

  return (
    <section className='relative overflow-hidden min-h-screen flex items-center'>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:40px_40px] animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-blue-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-indigo-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-4 h-16 bg-purple-400/20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-blue-300/20 rotate-12 animate-bounce"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fadeInUp">
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6 drop-shadow-lg'>
                    AI-Powered Invoicing, Made Effortless
                </h1>
            </div>
            
            <div className="animate-fadeInUp delay-200">
                <p className='text-xl sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto drop-shadow-sm'>
                    Let our AI create invoices from simple text, generate payment reminders, and provide smart insights to help you manage your business 
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeInUp delay-400">
                {
                    isAuthenticated ? (
                        <a 
                            href='/dashboard' 
                            className='group bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 shadow-xl shadow-blue-900/20 relative overflow-hidden'
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                            <span className="relative">Go to Dashboard</span>
                        </a>
                    ) : (
                        <Link 
                            to='/sign-up' 
                            className='group bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 shadow-xl shadow-blue-900/20 relative overflow-hidden'
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                            <span className="relative">Get Started for Free</span>
                        </Link>
                    )
                }
                <a 
                    href="#features"
                    className='group border-2 border-slate-800 text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/70'
                >
                    <span className="group-hover:animate-pulse">Learn More</span>
                </a>
            </div>
        </div>
        
        <div className="mt-16 relative max-w-5xl mx-auto animate-fadeInUp delay-600">
            <div className="relative">
                {/* Enhanced Shadow Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl blur-3xl transform translate-y-8"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl blur-2xl"></div>
                
                {/* Floating Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 p-1 animate-pulse">
                    <div className="h-full w-full rounded-2xl bg-white"></div>
                </div>
                
                {/* Main Image */}
                <div className="relative transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                    <img 
                        src='https://store-wp.mui.com/wp-content/uploads/2019/08/tabler-react.com_-min-e1565617941333.png' 
                        alt="Invoice App" 
                        className='relative z-10 rounded-2xl shadow-2xl shadow-blue-900/25 border border-white/50 backdrop-blur-sm hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-500' 
                    />
                    
                    {/* Glossy Overlay Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20 pointer-events-none"></div>
                </div>

                {/* Floating Elements Around Image */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce opacity-60 shadow-lg"></div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-indigo-500 rounded-full animate-pulse opacity-60 shadow-lg"></div>
                <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-purple-500 rounded-full animate-ping opacity-40 shadow-lg"></div>
                <div className="absolute -bottom-2 -right-4 w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-300 opacity-60 shadow-lg"></div>
            </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
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
        
        .delay-600 {
          animation-delay: 0.6s;
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

export default Hero