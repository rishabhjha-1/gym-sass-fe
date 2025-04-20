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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === "up" ? (
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
        ) : trend === "down" ? (
          <ArrowUpRight className="w-4 h-4 text-red-500 mr-1 rotate-180" />
        ) : null}
        <span
          className={`text-sm ${
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

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Mock attendance data
  const attendanceData: { [key: number]: number } = {
    1: 78,
    2: 82,
    3: 75,
    4: 90,
    5: 88,
    15: 92,
    16: 85,
    17: 79,
    18: 83,
    19: 80,
    20: 65,
    21: 45,
  }

  const renderCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-gray-100"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = attendanceData[day]
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()

      days.push(
        <div key={day} className={`h-14 border border-gray-100 p-1 ${isToday ? "bg-blue-50" : ""}`}>
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
            {attendance && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{attendance}</span>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attendance Calendar</h3>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {monthName} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          <div className="text-center text-sm font-medium text-gray-500 py-2">Sun</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Mon</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Tue</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Wed</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Thu</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Fri</div>
          <div className="text-center text-sm font-medium text-gray-500 py-2">Sat</div>
          {renderCalendarDays()}
        </div>
      </div>
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded-sm mr-1"></div>
              <span className="text-xs text-gray-500">Low (&lt;50)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded-sm mr-1"></div>
              <span className="text-xs text-gray-500">Medium (50-80)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
              <span className="text-xs text-gray-500">High (&gt;80)</span>
            </div>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">View Details</button>
        </div>
      </div>
    </div>
  )
}

// Recent Check-ins Component
const RecentCheckIns = ({ checkIns }: { checkIns: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Check-ins</h3>
        <Link to="/attendance/all" className="text-sm text-primary font-medium hover:underline">
          View all check-ins
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium">
                  {checkIn.member?.firstName?.charAt(0)}{checkIn.member?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium">
                  {checkIn.member?.firstName} {checkIn.member?.lastName}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(checkIn.timestamp).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>
            <div>
              {checkIn.type === "CHECK_IN" ? (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" /> Checked In
                </span>
              ) : (
                <span className="flex items-center text-gray-600 text-sm">
                  <XCircle className="w-4 h-4 mr-1" /> Checked Out
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
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
    setSelectedMember({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`
    })
    setSearchTerm(`${member.firstName} ${member.lastName}`)
    setShowDropdown(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="flex space-x-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-md text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <Line
            data={weeklyAttendanceData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Hourly Distribution</h3>
          <Bar
            data={hourlyAttendanceData}
            options={{
              responsive: true,
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

      {/* Attendance Calendar */}
      <AttendanceCalendar />

      {/* Recent Check-ins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCheckIns checkIns={recentCheckIns} />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
                    <p className="text-sm text-gray-500">ID: #{selectedMember.id}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                    onClick={() => handleCheckIn(selectedMember.name, selectedMember.id)}
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

            {/* Quick Check-in Members */}
            {!selectedMember && !searchTerm && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Quick Check-in</h4>
                <div className="space-y-2">
                  {recentCheckIns.slice(0, 3).map((checkIn) => (
                    <div 
                      key={checkIn.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleMemberSelect(checkIn.member)}
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
                          handleCheckIn(
                            `${checkIn.member.firstName} ${checkIn.member.lastName}`,
                            checkIn.member.id
                          );
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
      </div>
    </div>
  )
}

export default Attendance

