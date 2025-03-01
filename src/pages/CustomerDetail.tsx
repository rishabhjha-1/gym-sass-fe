


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Check
} from 'lucide-react';

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Monthly',
    joinDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    emergencyPhone: '',
    paymentMethod: 'credit',
    notes: ''
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would send the data to your API
      console.log('Submitting customer data:', formData);
      
      // Show success message and navigate back to customers list
      alert('Customer added successfully!');
      navigate('/customers');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/customers" className="inline-flex items-center text-sm font-medium text-primary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add New Customer</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new gym membership for a customer.</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Personal Information */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <div className="h-px bg-gray-200 my-4"></div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Join Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="joinDate"
                  id="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            {/* Emergency Contact */}
            <div className="sm:col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Emergency Contact</h2>
              <div className="h-px bg-gray-200 my-4"></div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">Contact Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="emergencyPhone"
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            {/* Membership Details */}
            <div className="sm:col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Membership Details</h2>
              <div className="h-px bg-gray-200 my-4"></div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">Membership Type</label>
              <div className="mt-1">
                <select
                  id="membershipType"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="sm:col-span-2 mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
            <Link 
              to="/customers" 
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Check className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetail;