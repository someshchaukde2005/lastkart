import React, { useState } from 'react';
import { View, NotificationType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ShoppingCartIcon, UserCircleIcon, BuildingStorefrontIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, BellIcon, XMarkIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    navigate: (view: View) => void;
    cartCount: number;
}

const NotificationIcon: React.FC<{type: NotificationType}> = ({ type }) => {
    switch (type) {
        case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
        case 'info':
        default:
            return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
}

const Header: React.FC<HeaderProps> = ({ navigate, cartCount }) => {
    const { user, role, logout } = useAuth();
    const { notifications, dismissNotification, unreadCount } = useNotifications();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate(View.HOME);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={() => navigate(View.HOME)} className="text-3xl font-bold text-primary-700 tracking-tight">
                        Lastkart
                    </button>
                    <p className="ml-3 text-sm text-gray-500 hidden md:block">Fresh Deals, Before They're Gone</p>
                </div>

                <nav className="flex items-center space-x-4">
                    {user && (
                         <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-600 hover:text-primary-700 transition-colors">
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border">
                                    <div className="p-3 font-semibold text-gray-800 border-b">Notifications</div>
                                    <ul className="py-1 max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? notifications.map(notif => (
                                            <li key={notif.id} className="px-3 py-2 hover:bg-gray-100">
                                                <div className="flex items-start">
                                                   <div className="flex-shrink-0 pt-1">
                                                        <NotificationIcon type={notif.type} />
                                                   </div>
                                                    <p className="text-sm text-gray-700 ml-2 flex-1">{notif.message}</p>
                                                    <button onClick={() => dismissNotification(notif.id)} className="text-gray-400 hover:text-gray-600 ml-2">
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>
                                        )) : <p className="text-sm text-gray-500 text-center p-4">No new notifications.</p>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {user ? (
                        <>
                            <span className="text-gray-700 hidden sm:block">Welcome, {user.name}!</span>
                            {role === 'buyer' && (
                                <button onClick={() => navigate(View.CART)} className="relative text-gray-600 hover:text-primary-700 transition-colors">
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            {role === 'retailer' && (
                                <button onClick={() => navigate(View.RETAILER_DASHBOARD)} className="flex items-center text-gray-600 hover:text-primary-700 transition-colors">
                                    <BuildingStorefrontIcon className="h-6 w-6 mr-1" />
                                    <span className="hidden md:block">Dashboard</span>
                                </button>
                            )}
                            {role === 'admin' && (
                                <button onClick={() => navigate(View.ADMIN_DASHBOARD)} className="flex items-center text-gray-600 hover:text-primary-700 transition-colors">
                                    <Cog6ToothIcon className="h-6 w-6 mr-1" />
                                     <span className="hidden md:block">Admin Panel</span>
                                </button>
                            )}
                             <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                                <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-1" />
                                 <span className="hidden md:block">Logout</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate(View.LOGIN)} className="flex items-center bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors">
                            <UserCircleIcon className="h-5 w-5 mr-2" />
                            Login / Register
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;