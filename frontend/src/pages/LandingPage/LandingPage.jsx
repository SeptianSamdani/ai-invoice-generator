import React from 'react'
import Header from '../../components/landing/Header'

const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header />

      <main>
        <Hero />
      </main>
    </div>
  )
}

export default LandingPage
