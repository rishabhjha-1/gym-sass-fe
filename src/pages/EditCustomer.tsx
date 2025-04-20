import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Check,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import memberService, { GenderType, MembershipType, MemberStatus, TrainingGoal, Member } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';

const EditCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male' as GenderType,
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as MemberStatus,
    membershipType: 'MONTHLY' as MembershipType,
    trainingGoal: 'general_fitness' as TrainingGoal,
    height: 0,
    weight: 0,
    notes: '',
    photoUrl: '',
    gymId: user?.gymId || '1'
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch member data
  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const member = await memberService.getMemberById(id);
        setFormData(member);
      } catch (error) {
        console.error('Error fetching member:', error);
        toast.error('Failed to load member data');
        navigate('/customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id, navigate]);
  
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
    
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && id) {
      try {
        setIsSubmitting(true);
        
        // Update member data
        await memberService.updateMember(id, formData as Member);
        
        // Show success toast and navigate back to customers list
        toast.success('Customer updated successfully!', {
          duration: 3000,
          position: 'top-right'
        });
        
        // Navigate to customers page after a short delay
        setTimeout(() => {
          navigate('/customers');
        }, 1000);
      } catch (error: any) {
        console.error('Error updating member:', error);
        toast.error(error.response?.data?.error?.[0]?.message || error.response?.data?.error || 'Failed to update customer', {
          duration: 3000,
          position: 'top-right'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/customers" className="inline-flex items-center text-sm font-medium text-primary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Customer</h1>
        <p className="mt-1 text-sm text-gray-500">Update customer information and membership details.</p>
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
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md`}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md`}
                />
              </div>
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            
            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
            
            <div className="col-span-1">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <div className="mt-1">
                <input
                  type="number"
                  name="height"
                  id="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <div className="mt-1">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
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
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="ANNUAL">Annual</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="FROZEN">Frozen</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="trainingGoal" className="block text-sm font-medium text-gray-700">Training Goal</label>
              <div className="mt-1">
                <select
                  id="trainingGoal"
                  name="trainingGoal"
                  value={formData.trainingGoal}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="athletic_performance">Athletic Performance</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer; 