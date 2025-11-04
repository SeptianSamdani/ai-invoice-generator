import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { NAVIGATION_MENU } from '../../utils/data';
import ProfileDropdown from './ProfileDropdown'; 

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dropdownRef = useRef(null); 

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-slate-200">
            <Link to='/dashboard' className='flex items-center gap-3'>
              <div className="flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg">
                <FileText className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <span className='text-lg font-bold text-slate-900'>Invoice AI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {NAVIGATION_MENU.map(item => {
              const IconComponent = item.icon;
              const isActive = activeNavItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComponent className="flex-shrink-0 w-5 h-5" strokeWidth={2} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="px-4 py-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-900 mb-1">Need help?</p>
              <p className="text-xs text-slate-600">Contact our support team</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isMobile ? "ml-0" : 'ml-64'
      }`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={toggleSidebar} 
                className='p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          <div ref={dropdownRef}>
            <ProfileDropdown 
              isOpen={profileDropdownOpen}
              onToggle={toggleProfileDropdown}
              avatar={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f172a&color=ffffff&bold=true`}
              companyName={user?.name || 'User Name'}
              email={user?.email || 'user@example.com'}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-slate-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <p>© 2024 Invoice AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-900 transition-colors">Privacy</button>
              <button className="hover:text-slate-900 transition-colors">Terms</button>
              <button className="hover:text-slate-900 transition-colors">Support</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;