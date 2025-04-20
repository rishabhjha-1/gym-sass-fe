import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                GymSASS
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
            >
              <User className="w-5 h-5" />
              <span>{user.firstName} {user.lastName}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 