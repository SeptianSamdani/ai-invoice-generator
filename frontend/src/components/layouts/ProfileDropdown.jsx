import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({
    isOpen, 
    onToggle, 
    avatar, 
    companyName, 
    email, 
    onLogout
}) => {
    const navigate = useNavigate(); 
    
    // Memisahkan item menu agar mudah dikelola
    const menuItems = [
        { 
            label: "View Profile", 
            icon: UserCircle, 
            action: () => navigate('/profile') 
        },
        // Anda bisa menambahkan item lain di sini, contoh:
        // { 
        //     label: "Settings", 
        //     icon: Settings, 
        //     action: () => navigate('/settings') 
        // },
    ];

    return (
        <div className='relative'>
            <button
                onClick={onToggle}
                className='flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
            >
                {avatar ? (
                    <img 
                        src={avatar}
                        alt='Avatar'
                        className='h-9 w-9 object-cover rounded-lg'
                    />
                ) : (
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                        <span className='text-white font-semibold text-base'>
                            {companyName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="hidden text-left sm:block">
                    <p className='text-sm font-semibold text-gray-800'>{companyName}</p>
                    <p className='text-xs text-gray-500'>{email}</p>
                </div>
                <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
            </button>

            {/* Dropdown Menu with Transition */}
            <div
                className={`transition-all duration-200 ease-out ${isOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="absolute right-0 mt-2 w-60 origin-top-right bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50">
                    {/* User Info Header */}
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className='text-sm font-semibold text-gray-800 truncate'>{companyName}</p>
                        <p className='text-xs text-gray-500 truncate'>{email}</p>
                    </div>

                    {/* Menu Items */}
                    <ul className='space-y-1'>
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <li key={index}>
                                    <button
                                        onClick={item.action}
                                        className='flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                                    >
                                        <Icon className="w-5 h-5 text-gray-500" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                            onClick={onLogout}
                            className='flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors'
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileDropdown;