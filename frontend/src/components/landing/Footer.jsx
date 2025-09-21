import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='relative overflow-hidden bg-blue-900 text-white'>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:40px_40px] animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-blue-400/20 rotate-45 animate-spin"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-indigo-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-3 h-12 bg-purple-400/20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-8 h-8 bg-blue-300/20 rotate-12 animate-bounce"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center animate-fadeInUp">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mb-4">
              Stay updated with our latest features
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Get tips, product updates, and exclusive insights delivered to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                <span className="relative">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
            
            {/* Company Info */}
            <div className="animate-fadeInUp">
              <div className="mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  InvoiceAI
                </h3>
              </div>
              <p className="text-blue-100 leading-relaxed mb-6">
                Empowering small businesses with AI-powered invoicing solutions. Simple, smart, and efficient.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group">
                  <svg className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group">
                  <svg className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group">
                  <svg className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="animate-fadeInUp delay-100">
              <h4 className="text-lg font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="/features" className="text-blue-100 hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="/pricing" className="text-blue-100 hover:text-white transition-colors duration-300">Pricing</a></li>
                <li><a href="/integrations" className="text-blue-100 hover:text-white transition-colors duration-300">Integrations</a></li>
                <li><a href="/api" className="text-blue-100 hover:text-white transition-colors duration-300">API</a></li>
                <li><a href="/security" className="text-blue-100 hover:text-white transition-colors duration-300">Security</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="animate-fadeInUp delay-200">
              <h4 className="text-lg font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="/about" className="text-blue-100 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="/blog" className="text-blue-100 hover:text-white transition-colors duration-300">Blog</a></li>
                <li><a href="/careers" className="text-blue-100 hover:text-white transition-colors duration-300">Careers</a></li>
                <li><a href="/press" className="text-blue-100 hover:text-white transition-colors duration-300">Press</a></li>
                <li><a href="/contact" className="text-blue-100 hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="animate-fadeInUp delay-300">
              <h4 className="text-lg font-bold text-white mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="/help" className="text-blue-100 hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="/documentation" className="text-blue-100 hover:text-white transition-colors duration-300">Documentation</a></li>
                <li><a href="/tutorials" className="text-blue-100 hover:text-white transition-colors duration-300">Tutorials</a></li>
                <li><a href="/community" className="text-blue-100 hover:text-white transition-colors duration-300">Community</a></li>
                <li><a href="/status" className="text-blue-100 hover:text-white transition-colors duration-300">System Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-blue-100 text-center lg:text-left">
                © {currentYear} InvoiceAI. All rights reserved.
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6">
                <a href="/privacy" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
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
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .bg-grid-slate-200\/50 {
          background-image: radial-gradient(circle, rgb(226 232 240 / 0.5) 1px, transparent 1px);
        }
      `}</style>
    </footer>
  )
}

export default Footer