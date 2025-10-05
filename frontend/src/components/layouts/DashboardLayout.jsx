// ========== DashboardLayout.jsx ==========
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useRef } from 'react'; 
import { Menu, LogOut, Briefcase } from 'lucide-react';
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

  // Handle Responsive Behavior
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

  const sidebarCollapsed = false; 

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out bg-white text-gray-800 border-r border-gray-200 ${
          isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          <div className="flex items-center h-20 px-4 border-b border-gray-200">
            <Link className='flex items-center gap-3' to='/dashboard'>
              <Briefcase className="w-8 h-8 text-blue-800" />
              {!sidebarCollapsed && <span className='text-lg font-bold text-blue-800 whitespace-nowrap'>AI Invoice</span>}
            </Link>
          </div>
          <nav className="px-4 py-6 space-y-2">
            {NAVIGATION_MENU.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    activeNavItem === item.id
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <IconComponent className="flex-shrink-0 w-6 h-6" />
                  {!sidebarCollapsed && <span className='font-medium whitespace-nowrap'>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            className={`flex items-center w-full gap-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-800 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            onClick={logout}
          >
            <LogOut className="flex-shrink-0 w-6 h-6" />
            {!sidebarCollapsed && <span className='font-medium whitespace-nowrap'>Keluar</span>}
          </button>
        </div>
      </div>

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isMobile ? "ml-0" : sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={toggleSidebar} className='p-2 -ml-2 text-gray-600 rounded-full hover:bg-gray-100'>
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
                Selamat datang kembali, {user?.name || 'Pengguna'}! 👋
              </h1>
              <p className="text-sm text-gray-500">
                Berikut ringkasan Faktur Anda
              </p>
            </div>
          </div>

          <div ref={dropdownRef}>
            <ProfileDropdown 
              isOpen={profileDropdownOpen}
              onToggle={toggleProfileDropdown}
              avatar={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=e0e7ff&color=3730a3`}
              companyName={user?.name || 'Nama Perusahaan'}
              email={user?.email || 'user@example.com'}
              onLogout={logout}
            />
          </div>
        </header>

        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;