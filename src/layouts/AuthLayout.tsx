import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="flex items-center mb-8">
            <Dumbbell className="w-10 h-10 text-primary" />
            <span className="ml-2 text-2xl font-bold">GymPulse</span>
          </div>
          
          <Outlet />
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Gym interior"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Manage Your Gym Business with Ease</h1>
          <p className="text-xl max-w-2xl text-center">
            Track customers, revenue, attendance, and more with our all-in-one gym management platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;