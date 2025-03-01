"use client"

import type React from "react"
import { useState } from "react"
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
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 border rounded-md text-sm w-64"
          />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium">{checkIn.member.charAt(0)}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">{checkIn.member}</h4>
                <p className="text-xs text-gray-500">{checkIn.time}</p>
              </div>
            </div>
            <div>
              {checkIn.status === "checked-in" ? (
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
      <div className="px-6 py-3 border-t border-gray-100">
        <button className="text-sm text-primary font-medium hover:underline">View all check-ins</button>
      </div>
    </div>
  )
}

const Attendance: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState([
    { id: 1, member: "John Smith", time: "10:15 AM", status: "checked-in" },
    { id: 2, member: "Emily Davis", time: "10:08 AM", status: "checked-in" },
    { id: 3, member: "Robert Wilson", time: "9:55 AM", status: "checked-in" },
    { id: 4, member: "Lisa Thompson", time: "9:42 AM", status: "checked-in" },
    { id: 5, member: "Michael Brown", time: "9:30 AM", status: "checked-out" },
    { id: 6, member: "Sarah Johnson", time: "9:15 AM", status: "checked-out" },
  ])

  // Function to handle member check-in
  const handleCheckIn = (memberName: string, memberId?: number) => {
    const now = new Date()
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    // Create new check-in record
    const newCheckIn = {
      id: Date.now(),
      member: memberName,
      time: formattedTime,
      status: "checked-in",
    }

    // Update recent check-ins list
    setRecentCheckIns((prevCheckIns) => [newCheckIn, ...prevCheckIns.slice(0, 5)])

    // Clear selected member after check-in
    setSelectedMember(null)

    // Show success message
    alert(`${memberName} has been successfully checked in at ${formattedTime}`)
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
          value="186"
          change="12% from yesterday"
          icon={<Users className="w-6 h-6 text-primary" />}
          trend="up"
        />
        <AttendanceSummaryCard
          title="Weekly Average"
          value="175"
          change="5% from last week"
          icon={<Calendar className="w-6 h-6 text-primary" />}
          trend="up"
        />
        <AttendanceSummaryCard
          title="Peak Hour"
          value="6:00 PM"
          change="45 members"
          icon={<Clock className="w-6 h-6 text-primary" />}
          trend="neutral"
        />
        <AttendanceSummaryCard
          title="Attendance Rate"
          value="68%"
          change="3% from last month"
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          trend="up"
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
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search member by name or ID..."
                className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
              />
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium">JS</span>
                </div>
                <div>
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-sm text-gray-500">ID: #12345 • Monthly Membership</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Membership Status:</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Check-in:</p>
                  <p className="font-medium">Yesterday, 5:30 PM</p>
                </div>
                <div>
                  <p className="text-gray-500">Visits This Month:</p>
                  <p className="font-medium">12</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
                  onClick={() => handleCheckIn("John Smith")}
                >
                  Check In
                </button>
                <button className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Members</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">ED</span>
                    </div>
                    <span className="text-sm">Emily Davis</span>
                  </div>
                  <button className="text-xs text-primary" onClick={() => handleCheckIn("Emily Davis")}>
                    Check In
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">RW</span>
                    </div>
                    <span className="text-sm">Robert Wilson</span>
                  </div>
                  <button className="text-xs text-primary" onClick={() => handleCheckIn("Robert Wilson")}>
                    Check In
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">LT</span>
                    </div>
                    <span className="text-sm">Lisa Thompson</span>
                  </div>
                  <button className="text-xs text-primary" onClick={() => handleCheckIn("Lisa Thompson")}>
                    Check In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance

