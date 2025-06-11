import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Camera, 
  Loader, 
  X,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import memberService, { Member } from '../services/memberService';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../services/axios';

const MemberAttendance: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; memberId: string } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Debounced search function
  useEffect(() => {
    const searchMembers = async () => {
      if (searchTerm.length < 2) {
        setMembers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await memberService.getMembers(1, 10);
        const filteredMembers = response.data.filter(member => 
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMembers(filteredMembers);
      } catch (error) {
        console.error('Error searching members:', error);
        toast.error('Failed to search members');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchMembers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      memberId: member.memberId
    });
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setShowDropdown(false);
    setShowCamera(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setCameraError(null);
      
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissions.state);
      
      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      setShowCamera(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!videoRef.current) {
        throw new Error('Video element not found. Please try refreshing the page.');
      }

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (error) {
        console.log('Failed with ideal constraints, trying with basic constraints...');
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
      }

      if (!stream) {
        throw new Error('No stream returned from getUserMedia');
      }

      if (!videoRef.current) {
        throw new Error('Video element not found after getting stream');
      }

      if (videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
      }

      videoRef.current.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not found'));
          return;
        }

        const video = videoRef.current;
        let playPromise: Promise<void> | undefined;
        
        const handleCanPlay = () => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          
          playPromise = video.play();
          playPromise
            .then(() => resolve())
            .catch(error => reject(error));
        };
        
        const handleError = (error: Event) => {
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          reject(new Error('Video failed to play'));
        };
        
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
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

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeCamera = async () => {
      if (showCamera && mounted) {
        try {
          timeoutId = setTimeout(async () => {
            if (mounted) {
              await startCamera();
            }
          }, 500);
        } catch (error) {
          console.error('Camera initialization failed:', error);
          if (mounted) {
            setShowCamera(false);
          }
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [showCamera]);

  const captureAndVerify = async () => {
    if (!selectedMember || !videoRef.current || !canvasRef.current) {
      console.error('Missing required refs for capture');
      return;
    }

    try {
      setIsVerifying(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('Failed to convert canvas to blob');
          }
        }, 'image/jpeg', 0.8);
      });

      const formData = new FormData();
      formData.append('faceImage', blob, 'face.jpg');
      formData.append('memberId', selectedMember.memberId);

      const response = await axiosInstance.post('/attendance/face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Check-in successful!');
        stopCamera();
        setSelectedMember(null);
        setSearchTerm('');
      } else {
        throw new Error('Check-in failed');
      }
    } catch (error: any) {
      console.error('Error during check-in:', error);
      const errorMessage = error.response?.data?.error || 'Failed to check in';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6">Member Check-in</h1>
        
        <div className="space-y-6">
          {/* Search Section */}
          <div className="relative search-container" ref={dropdownRef}>
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search member by name or ID..."
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setShowDropdown(true)}
            />

            {/* Search Results Dropdown */}
            {showDropdown && searchTerm.length > 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {isLoading ? (
                  <div className="p-2 text-sm text-gray-500">Searching...</div>
                ) : members.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No members found</div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => handleMemberSelect(member)}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-xs text-gray-500">ID: {member.memberId}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Member Card */}
          {selectedMember && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {selectedMember.name.split(" ").map((n: string) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{selectedMember.name}</h4>
                  <p className="text-sm text-gray-500">ID: {selectedMember.memberId}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                  onClick={() => setShowCamera(true)}
                >
                  Check In
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                  onClick={() => {
                    setSelectedMember(null);
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Face Verification Modal */}
      {showCamera && selectedMember && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Face Verification</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please look at the camera to verify your identity for check-in.
            </p>
            
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!videoRef.current?.srcObject && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <div className="text-gray-500">Initializing camera...</div>
                    </div>
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                    <div className="text-red-600 text-center p-4">
                      <p className="font-medium">Camera Error</p>
                      <p className="text-sm">{cameraError}</p>
                      <button
                        onClick={() => {
                          setCameraError(null);
                          startCamera();
                        }}
                        className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={captureAndVerify}
                  disabled={isVerifying || !!cameraError}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span className="flex items-center">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Verify & Check In
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberAttendance; 