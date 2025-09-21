import React, { useState } from 'react'

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "How does the AI invoice creation work?",
      answer: "Simply describe your service or product in plain text, and our AI will automatically generate a professional invoice with all the necessary details. It recognizes common business terms, calculates totals, and formats everything beautifully."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use industry-standard encryption (AES-256) to protect your data both in transit and at rest. Our servers are hosted in secure facilities with 24/7 monitoring, and we never share your information with third parties."
    },
    {
      question: "Can I customize my invoices with my brand?",
      answer: "Yes! You can upload your logo, choose your brand colors, customize the layout, and even add custom fields. Your invoices will look professional and match your business identity perfectly."
    },
    {
      question: "How do payment reminders work?",
      answer: "Our system automatically sends gentle, professional reminders at optimal intervals. You can customize the timing and messaging, and we track delivery and engagement to help improve your collection rates."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app works on both iOS and Android. You can create invoices, track payments, send reminders, and view analytics from anywhere. The app works offline and syncs when you're back online."
    },
    {
      question: "What payment methods can I accept?",
      answer: "We integrate with popular payment processors to accept credit cards, bank transfers, PayPal, and more. Your clients get multiple payment options, making it easier for them to pay quickly."
    },
    {
      question: "Can I track my business performance?",
      answer: "Our analytics dashboard shows you key metrics like revenue trends, outstanding payments, client payment patterns, and cash flow projections. Get insights that help you make better business decisions."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can create unlimited invoices and explore all the features risk-free."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className='relative overflow-hidden py-24 lg:py-32'>
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-10 w-6 h-6 bg-blue-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-60 left-20 w-4 h-4 bg-indigo-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-60 right-20 w-3 h-12 bg-purple-400/20 animate-pulse"></div>
        <div className="absolute bottom-32 left-10 w-8 h-8 bg-blue-300/20 rotate-12 animate-bounce"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6 drop-shadow-lg'>
            Frequently Asked Questions
          </h2>
          <p className='text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto drop-shadow-sm'>
            Everything you need to know about our AI-powered invoicing platform. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16 animate-fadeInUp delay-200">
          {faqs.map((faq, index) => (
            <div key={index} className="group relative">
              {/* Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-2xl"></div>
              
              {/* Main FAQ Item */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
                <button
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="w-full h-px bg-gradient-to-r from-blue-200 to-indigo-200 mb-4"></div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="relative animate-fadeInUp delay-400">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-3xl"></div>
          
          {/* Main Content */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/60 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our friendly support team is here to help you get the most out of our platform. We typically respond within a few hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="/contact" 
                className="group bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 shadow-xl shadow-blue-900/20 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Contact Support</span>
              </a>
              <a 
                href="/help" 
                className="group border-2 border-slate-800 text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm bg-white/70"
              >
                <span className="group-hover:animate-pulse">Browse Help Center</span>
              </a>
            </div>
          </div>
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

export default Faqs