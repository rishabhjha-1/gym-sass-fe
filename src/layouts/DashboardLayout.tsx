import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar, 
  UserCog, 
  CreditCard, 
  BookOpen, 
  Image, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown,
  Dumbbell,
  IndianRupee
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean, setIsMobileOpen: (open: boolean) => void }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Customers', path: '/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'Revenue', path: '/revenue', icon: <IndianRupee className="w-5 h-5" /> },
    { name: 'Attendance', path: '/attendance', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Staff', path: '/staff', icon: <UserCog className="w-5 h-5" /> },
    { name: 'Fees', path: '/fees', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Ledger', path: '/ledger', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'AI Content', path: '/ai-content', icon: <Image className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
    transform transition-transform duration-200 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static
  `;
  
  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">GymPulse</span>
            </Link>
            <button 
              className="p-1 rounded-md md:hidden hover:bg-gray-100"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Nav Items */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ setIsMobileOpen }: { setIsMobileOpen: (open: boolean) => void }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-white">
      <div className="flex items-center">
        <button 
          className="p-1 mr-4 rounded-md md:hidden hover:bg-gray-100"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-1 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              {user?.firstName.charAt(0)}
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.firstName} {user?.lastName}</span>
            <ChevronDown className="hidden md:block w-4 h-4" />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
              <Link 
                to="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile Settings
              </Link>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setIsProfileOpen(false);
                  // Handle logout
                  localStorage.clear();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;