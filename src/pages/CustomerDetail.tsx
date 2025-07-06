import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Check,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import memberService, { GenderType, MembershipType, MemberStatus, TrainingGoal } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';
// import { GenderType, MembershipType, MemberStatus } from '../types';

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE' as GenderType,
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE' as MemberStatus,
    membershipType: 'MONTHLY' as MembershipType,
    trainingGoal: 'STRENGTH' as TrainingGoal,
    height: 0,
    weight: 0,
    notes: '',
    photoUrl: '',
    gymId: '1' // Default gym ID, adjust as needed
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Debug function
  const debugLog = (message: string, data?: any) => {
    console.log(`[Camera Debug] ${message}`, data || '');
  };

  // Start camera
  const startCamera = async () => {
    debugLog('Starting camera initialization');
    setCameraError(null);
    
    try {
      // First check if we have permission
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      debugLog('Camera permission status:', permissionStatus.state);

      if (permissionStatus.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      // Show camera UI first
      setShowCamera(true);
      
      // Wait for the next render cycle to ensure video element is mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now check if video element exists
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }
      
      // Get camera stream with more specific constraints
      debugLog('Requesting camera access');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user',
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        }
      });
      
      debugLog('Camera stream obtained', stream);
      
      // Set stream to video element
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      videoRef.current.srcObject = stream;
      debugLog('Stream set to video element');
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not found'));
          return;
        }
        
        const video = videoRef.current;
        
        const handleCanPlay = () => {
          debugLog('Video can play');
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          resolve();
        };
        
        const handleError = (error: Event) => {
          debugLog('Video error', error);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          reject(new Error('Video failed to play'));
        };
        
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
        
        // Start playing
        video.play()
          .then(() => {
            debugLog('Video playback started');
          })
          .catch(error => {
            debugLog('Error playing video', error);
            reject(error);
          });
      });
    } catch (error) {
      debugLog('Camera error', error);
      let errorMessage = 'Failed to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please ensure camera permissions are granted in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is in use by another application. Please close other applications using the camera.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    debugLog('Stopping camera');
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        debugLog('Stopping track', track.kind);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraError(null);
  };

  // Capture image
  const captureImage = () => {
    debugLog('Attempting to capture image');
    if (!videoRef.current || !canvasRef.current) {
      debugLog('Missing video or canvas element');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      debugLog('Could not get canvas context');
      return;
    }

    try {
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      debugLog('Canvas dimensions set', { width: canvas.width, height: canvas.height });

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      debugLog('Image drawn to canvas');

      // Get image data
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      debugLog('Image data captured');
      
      setCapturedImage(imageData);
      // Set the photoUrl in formData
      setFormData(prev => ({
        ...prev,
        photoUrl: imageData
      }));
      stopCamera();
    } catch (error) {
      debugLog('Error capturing image', error);
      toast.error('Failed to capture image');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debugLog('Component unmounting, cleaning up camera');
      stopCamera();
    };
  }, []);

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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!capturedImage) {
      newErrors.photo = 'Face photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Create a member ID based on first and last name
        const memberId = `${formData.firstName.charAt(0)}${formData.lastName.substring(0, 5)}${Math.floor(Math.random() * 1000)}`.toUpperCase();
        
        // Prepare member data according to the expected format
        const memberData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          membershipType: formData.membershipType,
          status: formData.status,
          trainingGoal: formData.trainingGoal,
          height: Number(formData.height),
          weight: Number(formData.weight),
          notes: formData.notes,
          photoUrl: capturedImage || undefined,
          gymId: user?.gymId || '1',
          faceImage: capturedImage || undefined
        };
        
        // Send data to API
        await memberService.createMember(memberData);
        
        // Show success toast and navigate back to customers list
        toast.success('Customer added successfully!', {
          duration: 3000,
          position: 'top-right'
        });
        
        // Navigate to customers page after a short delay
        setTimeout(() => {
          navigate('/customers');
        }, 1000);
      } catch (error:any) {
        if(error.response?.status === 400){
          toast.error('Some Fields are required', {
            duration: 3000,
            position: 'top-right'
          });
        }
        console.error('Error creating member:', error);
        toast.error(`${error.response?.data?.error?.[0]?.message || error.response?.data?.error || 'Failed to add customer'}`, {
          duration: 3000,
          position: 'top-right'
        });
      } finally {
        setIsSubmitting(false);
      }
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
            {/* Face Photo Section */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900">Face Photo</h2>
              <div className="h-px bg-gray-200 my-4"></div>
            </div>
            
            <div className="col-span-1">
              {!showCamera && !capturedImage && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </button>
              )}

              {showCamera && (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                        <div className="text-red-600 text-center p-4">
                          <p className="font-medium">Camera Error</p>
                          <p className="text-sm">{cameraError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={captureImage}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <img
                    src={capturedImage}
                    alt="Captured face"
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              )}

              {errors.photo && (
                <p className="mt-2 text-sm text-red-600">{errors.photo}</p>
              )}
            </div>
            
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
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="sm:col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Emergency Contact</h2>
              <div className="h-px bg-gray-200 my-4"></div>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">Emergency Contact Information</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and phone number"
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
            </div>
            
            {/* Physical Information */}
            <div className="sm:col-span-2 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Physical Information</h2>
              <div className="h-px bg-gray-200 my-4"></div>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="trainingGoal" className="block text-sm font-medium text-gray-700">Training Goal</label>
              <div className="mt-1">
                <select
                  id="trainingGoal"
                  name="trainingGoal"
                  value={formData.trainingGoal}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 sm:text-sm border border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="STRENGTH">Strength</option>
                  <option value="CARDIO">Cardio</option>
                  <option value="WEIGHT_LOSS">Weight Loss</option>
                  <option value="MUSCLE_GAIN">Muscle Gain</option>
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
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Add Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetail;