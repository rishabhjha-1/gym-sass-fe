"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Minus,
  Camera,
  Loader,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import attendanceService from "../services/attendanceService"
import { useAuth } from "../contexts/AuthContext"
import { useQuery } from '@tanstack/react-query'
import memberService, { Member } from '../services/memberService'
import { Link } from "react-router-dom"
import { toast } from 'sonner'
import axiosInstance from '../services/axios'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Mock data for charts
const weeklyAttendanceData = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  datasets: [
    {
      label: "This Week",
      data: [85, 92, 78, 95, 86, 65, 42],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderWidth: 2,
    },
    {
      label: "Last Week",
      data: [78, 85, 70, 90, 80, 60, 38],
      borderColor: "rgb(156, 163, 175)",
      backgroundColor: "rgba(156, 163, 175, 0.5)",
      borderWidth: 2,
      borderDash: [5, 5],
    },
  ],
}

const hourlyAttendanceData = {
  labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
  datasets: [
    {
      label: "Average Attendance",
      data: [12, 35, 25, 30, 22, 28, 45, 32, 15],
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderRadius: 4,
    },
  ],
}

// Attendance Summary Card Component
const AttendanceSummaryCard = ({
  title,
  value,
  change,
  icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
}) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-2 md:p-3 bg-primary/10 rounded-full">{icon}</div>
      </div>
      <div className="mt-3 md:mt-4 flex items-center">
        {trend === "up" ? (
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
        ) : trend === "down" ? (
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-red-500 mr-1 rotate-180" />
        ) : null}
        <span
          className={`text-xs md:text-sm ${
            trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  )
}

// Calendar Component
const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthData, setMonthData] = useState<any[]>([])
  const [monthLoading, setMonthLoading] = useState(false)
  const { user } = useAuth()

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const fetchMonthData = async (date: Date) => {
    if (!user?.gymId) return
    
    setMonthLoading(true)
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()
    
    try {
      const response = await attendanceService.getAttendance({
        gymId: user.gymId,
        startDate,
        endDate
      })
      setMonthData(response.data)
    } catch (error) {
      console.error('Error fetching month data:', error)
      setMonthData([])
    } finally {
      setMonthLoading(false)
    }
  }

  // Fetch data when month changes
  useEffect(() => {
    fetchMonthData(currentMonth)
  }, [currentMonth, user?.gymId])

  const prevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    setCurrentMonth(newMonth)
  }

  const nextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(newMonth)
  }

  // Process attendance data for the current month
  const getAttendanceForMonth = () => {
    if (!monthData || monthData.length === 0) return {}
    
    const attendanceByDay: { [key: number]: number } = {}
    
    monthData.forEach(record => {
      const recordDate = new Date(record.timestamp)
      const day = recordDate.getDate()
      attendanceByDay[day] = (attendanceByDay[day] || 0) + 1
    })
    
    return attendanceByDay
  }

  const attendanceDataForMonth = getAttendanceForMonth()

  const renderCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-gray-100"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = attendanceDataForMonth[day]
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()

      // Determine attendance level for color coding
      let attendanceColor = ""
      let attendanceText = ""
      if (attendance) {
        if (attendance < 50) {
          attendanceColor = "bg-blue-100 text-blue-800"
        } else if (attendance < 80) {
          attendanceColor = "bg-blue-300 text-blue-900"
        } else {
          attendanceColor = "bg-blue-500 text-white"
        }
        attendanceText = attendance.toString()
      }

      days.push(
        <div key={day} className={`h-14 border border-gray-100 p-1 ${isToday ? "bg-blue-50" : ""}`}>
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
            {attendance && (
              <span className={`text-xs ${attendanceColor} px-1.5 py-0.5 rounded`}>{attendanceText}</span>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  // Check if there's any data for the current month
  const hasDataForMonth = Object.keys(attendanceDataForMonth).length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-base md:text-lg font-semibold">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <span className="text-xs md:text-sm font-medium">
            {monthName} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
      <div className="p-2 md:p-4">
        {monthLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-gray-500">Loading month data...</div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Sun</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Mon</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Tue</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Wed</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Thu</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Fri</div>
              <div className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">Sat</div>
              {renderCalendarDays()}
            </div>
            {!hasDataForMonth && !monthLoading && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No attendance data for {monthName} {year}</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="px-4 md:px-6 py-2 md:py-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-100 rounded-sm mr-1"></div>
              <span className="text-[10px] md:text-xs text-gray-500">Low (&lt;50)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-300 rounded-sm mr-1"></div>
              <span className="text-[10px] md:text-xs text-gray-500">Medium (50-80)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-sm mr-1"></div>
              <span className="text-[10px] md:text-xs text-gray-500">High (&gt;80)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Recent Check-ins Component
const RecentCheckIns = ({ checkIns }: { checkIns: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base md:text-lg font-semibold">Recent Check-ins</h3>
        <Link to="/attendance/all" className="text-xs md:text-sm text-primary font-medium hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 md:mr-3">
                <span className="text-xs md:text-sm font-medium">
                  {checkIn.member?.firstName?.charAt(0)}{checkIn.member?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-medium">
                  {checkIn.member?.firstName} {checkIn.member?.lastName}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {new Date(checkIn.timestamp).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>
            <div>
              {checkIn.type === "CHECK_IN" ? (
                <span className="flex items-center text-green-600 text-xs md:text-sm">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Checked In
                </span>
              ) : (
                <span className="flex items-center text-gray-600 text-xs md:text-sm">
                  <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Checked Out
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Attendance: React.FC = () => {
  const { user } = useAuth()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string,memberId:string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([])
  const [allAttendanceData, setAllAttendanceData] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Debounced search function
  useEffect(() => {
    const searchMembers = async () => {
      if (searchTerm.length < 2) {
        setMembers([])
        return
      }

      setLoading(true)
      try {
        const response = await memberService.getMembers(1, 10)
        const filteredMembers = response.data.filter(member => 
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setMembers(filteredMembers)
      } catch (error) {
        console.error('Error searching members:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchMembers, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (user?.gymId) {
      fetchAttendanceData()
    }
  }, [user?.gymId])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const [statsData, attendanceData] = await Promise.all([
        attendanceService.getAttendanceStats(),
        attendanceService.getAttendance({ gymId: user!.gymId })
      ])
      
      setStats(statsData)
      setAllAttendanceData(attendanceData.data)
      setRecentCheckIns(attendanceData.data.slice(0, 6))
    } catch (err) {
      setError("Failed to fetch attendance data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle member check-in
  const handleCheckIn = async (memberName: string, memberId: string) => {
    try {
      await attendanceService.recordAttendance({
        memberId,
        
        gymId: user!.gymId
      })
      
      // Refresh the data
      fetchAttendanceData()
      
      // Show success message
      alert(`${memberName} has been successfully checked in`)
    } catch (err) {
      alert("Failed to check in member")
      console.error(err)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropdown(true)
  }

  const handleMemberSelect = (member: Member) => {
    console.log({member})   
    setSelectedMember({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      memberId: member.memberId
    });
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setShowDropdown(false);
    setShowCamera(true);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Move startCamera definition above useEffect
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setCameraError(null);
      
      // First check if we have permission
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissions.state);
      
      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      // Show camera UI first
      setShowCamera(true);
      
      // Wait for the next render cycle to ensure video element is mounted
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now check if video element exists
      if (!videoRef.current) {
        console.error('Video element not found after delay');
        throw new Error('Video element not found. Please try refreshing the page.');
      }

      // Try to get the camera stream with more specific constraints
      console.log('Requesting camera access...');
      let stream: MediaStream;
      
      try {
        // First try with ideal constraints
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (error) {
        console.log('Failed with ideal constraints, trying with basic constraints...');
        // If that fails, try with basic constraints
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true
        });
      }

      if (!stream) {
        throw new Error('No stream returned from getUserMedia');
      }

      console.log('Camera stream obtained:', stream);
      
      // Set up the video element
      if (!videoRef.current) {
        console.error('Video element not found after getting stream');
        throw new Error('Video element not found. Please try refreshing the page.');
      }

      // First remove any existing stream
      if (videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => track.stop());
      }

      // Set the new stream
      videoRef.current.srcObject = stream;
      console.log('Stream set to video element');

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          console.error('Video element not found in play promise');
          reject(new Error('Video element not found. Please try refreshing the page.'));
          return;
        }

        const video = videoRef.current;
        let playPromise: Promise<void> | undefined;
        
        const handleCanPlay = () => {
          console.log('Video can play');
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
          
          // Start playing
          playPromise = video.play();
          playPromise
            .then(() => {
              console.log('Video playback started');
              resolve();
            })
            .catch(error => {
              console.error('Error playing video:', error);
              reject(error);
            });
        };
        
        const handleError = (error: Event) => {
          console.error('Video error:', error);
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
        } else if (error.name === 'AbortError') {
          errorMessage += 'Camera initialization was interrupted. Please try again.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not support the requested resolution. Please try again.';
        } else if (error.name === 'TypeError') {
          errorMessage += 'Camera access is not supported in your browser. Please try a different browser.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setShowCamera(false);
    }
  };

  // Update useEffect for camera initialization
  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeCamera = async () => {
      if (showCamera && mounted) {
        try {
          // Add a small delay before starting camera
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
      // Clean up camera when component unmounts or modal closes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    };
  }, [showCamera]);

  // Capture and verify image
  const captureAndVerify = async () => {
    if (!selectedMember || !videoRef.current || !canvasRef.current) {
      console.error('Missing required refs for capture');
      return;
    }

    try {
      setIsVerifying(true);
      console.log('Starting face verification...');
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log('Canvas dimensions set:', canvas.width, 'x', canvas.height);

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Image drawn to canvas');

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('Failed to convert canvas to blob');
          }
        }, 'image/jpeg', 0.8);
      });
      console.log('Image converted to blob');

      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('faceImage', blob, 'face.jpg');
      formData.append('memberId', selectedMember.memberId);

      // Send image for verification using axios
      console.log('Sending image for verification...');
      const response = await axiosInstance.post('/attendance/face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Face verification successful');
        toast.success('Face verification successful');
        stopCamera();
      } else {
        console.error('Face verification failed:', response.status);
        toast.error('Face verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Error during face verification:', error);
      const errorMessage = error.response?.data?.error || 'Failed to verify face';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('Stopping camera...');
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  // Prepare chart data from stats
  const weeklyAttendanceData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "This Week",
        data: stats?.weekdayDistribution.map((day: any) => day.count) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 2,
      },
    ],
  }

  const hourlyAttendanceData = {
    labels: stats?.hourlyDistribution.map((hour: any) => `${hour.hour}:00`) || [],
    datasets: [
      {
        label: "Average Attendance",
        data: stats?.hourlyDistribution.map((hour: any) => hour.count) || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Attendance</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-md text-sm w-full md:w-auto"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center w-full md:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center w-full md:w-auto justify-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AttendanceSummaryCard
          title="Today's Attendance"
          value={stats?.today.toString() || "0"}
          change={`${stats?.change.daily.toFixed(1)}% from yesterday`}
          icon={<Users className="w-6 h-6 text-primary" />}
          trend={stats?.change.daily > 0 ? "up" : stats?.change.daily < 0 ? "down" : "neutral"}
        />
        <AttendanceSummaryCard
          title="Weekly Average"
          value={stats?.thisWeek.toString() || "0"}
          change={`${stats?.change.weekly.toFixed(1)}% from last week`}
          icon={<Calendar className="w-6 h-6 text-primary" />}
          trend={stats?.change.weekly > 0 ? "up" : stats?.change.weekly < 0 ? "down" : "neutral"}
        />
        <AttendanceSummaryCard
          title="Peak Hour"
          value={stats?.hourlyDistribution.reduce((max: any, hour: any) => 
            hour.count > max.count ? hour : max
          ).hour + ":00" || "N/A"}
          change="Peak attendance"
          icon={<Clock className="w-6 h-6 text-primary" />}
          trend="neutral"
        />
        <AttendanceSummaryCard
          title="Attendance Rate"
          value={`${((stats?.today / stats?.thisWeek) * 100).toFixed(1)}%`}
          change="Daily rate"
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          trend="neutral"
        />
      </div>

      {/* Attendance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <div className="h-[300px] md:h-[400px]">
            <Line
              data={weeklyAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Hourly Distribution</h3>
          <div className="h-[300px] md:h-[400px]">
            <Bar
              data={hourlyAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="overflow-x-auto">
        <AttendanceCalendar />
      </div>

      {/* Recent Check-ins and Check-in Form */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentCheckIns checkIns={recentCheckIns} />

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Check-in Member</h3>
          <div className="space-y-4">
            <div className="relative search-container">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="member"
                type="text"
                placeholder="Search member..."
                className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setShowDropdown(true)}
              />

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
                    <p className="text-sm text-gray-500">ID: #{selectedMember.id}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                    onClick={() => setShowCamera(true)}
                  >
                    Check In
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                    onClick={() => {
                      setSelectedMember(null)
                      setSearchTerm('')
                      setShowDropdown(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!selectedMember && !searchTerm && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Quick Check-in</h4>
                <div className="space-y-2">
                  {recentCheckIns.slice(0, 3).map((checkIn) => (
                    <div 
                      key={checkIn.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedMember(checkIn.member);
                        setShowCamera(true);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium">
                            {checkIn.member.firstName.charAt(0)}{checkIn.member.lastName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm">
                          {checkIn.member.firstName} {checkIn.member.lastName}
                        </span>
                      </div>
                      <button 
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Check In
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Face Verification Modal */}
      {showCamera && selectedMember && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md">
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
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={stopCamera}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={captureAndVerify}
                  disabled={isVerifying || !!cameraError}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
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
  )
}

export default Attendance

