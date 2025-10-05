import React from 'react'
import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import Testimonials from '../../components/landing/Testimonials'
import Faqs from '../../components/landing/Faqs'
import Footer from '../../components/landing/Footer'

const LandingPage = () => {
  return (
    <div className='relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden text-gray-600'>
      {/* Tambahkan animated background pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:40px_40px] animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-blue-400/15 rotate-45 animate-spin"></div>
        <div className="absolute top-60 right-20 w-4 h-4 bg-indigo-400/15 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-3 h-12 bg-purple-400/15 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-8 h-8 bg-blue-300/15 rotate-12 animate-bounce"></div>
      </div>

      <Header />

      <main className='relative z-10'>
        <Hero />
        <Features />
          <Testimonials />
        <Faqs />
      </main>

      <Footer />
      <style jsx>{`
        .bg-grid-slate-200\/50 {
          background-image: radial-gradient(circle, rgb(226 232 240 / 0.5) 1px, transparent 1px);
        }
      `}
      </style>
    </div>
  )

}

export default LandingPage