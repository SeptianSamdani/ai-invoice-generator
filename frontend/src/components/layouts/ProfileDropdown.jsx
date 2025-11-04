import { ChevronDown, LogOut, User } from 'lucide-react';
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

    return (
        <div className='relative'>
            <button
                onClick={onToggle}
                className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors'
            >
                <img 
                    src={avatar}
                    alt='Avatar'
                    className='w-9 h-9 rounded-lg object-cover'
                />
                <div className="hidden sm:block text-left">
                    <p className='text-sm font-medium text-slate-900'>{companyName}</p>
                    <p className='text-xs text-slate-600'>{email}</p>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className='text-sm font-medium text-slate-900 truncate'>{companyName}</p>
                        <p className='text-xs text-slate-600 truncate'>{email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className='py-2'>
                        <button
                            onClick={() => {
                                navigate('/profile');
                                onToggle();
                            }}
                            className='flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                        >
                            <User className="w-4 h-4 text-slate-600" />
                            <span>View Profile</span>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 py-2">
                        <button
                            onClick={onLogout}
                            className='flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 transition-colors font-medium'
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown;