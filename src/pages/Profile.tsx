import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Building2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* User Information */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gym Information */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Gym Information</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Gym ID:</span>
                  <span className="font-medium">{user.gymId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">{new Date(user.lastLoginAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 