"use client"

import type React from "react"
import { useState } from "react"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  Briefcase,
} from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for staff members
const staffMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fitness Trainer",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    status: "active",
    avatar: "/avatars/sarah.jpg",
    department: "Training",
    joinDate: "2021-05-15",
    schedule: "Mon-Fri, 8am-4pm",
    clients: 28,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Yoga Instructor",
    email: "michael.b@example.com",
    phone: "(555) 234-5678",
    status: "active",
    avatar: "/avatars/michael.jpg",
    department: "Training",
    joinDate: "2020-11-03",
    schedule: "Tue-Sat, 10am-6pm",
    clients: 35,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Nutritionist",
    email: "emma.w@example.com",
    phone: "(555) 345-6789",
    status: "active",
    avatar: "/avatars/emma.jpg",
    department: "Nutrition",
    joinDate: "2022-01-20",
    schedule: "Mon-Wed-Fri, 9am-5pm",
    clients: 42,
    rating: 4.7,
  },
  {
    id: 4,
    name: "David Lee",
    role: "Personal Trainer",
    email: "david.l@example.com",
    phone: "(555) 456-7890",
    status: "active",
    avatar: "/avatars/david.jpg",
    department: "Training",
    joinDate: "2021-08-12",
    schedule: "Mon-Fri, 6am-2pm",
    clients: 31,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "Front Desk",
    email: "jessica.m@example.com",
    phone: "(555) 567-8901",
    status: "active",
    avatar: "/avatars/jessica.jpg",
    department: "Administration",
    joinDate: "2022-03-05",
    schedule: "Wed-Sun, 12pm-8pm",
    clients: 0,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Robert Taylor",
    role: "Maintenance",
    email: "robert.t@example.com",
    phone: "(555) 678-9012",
    status: "inactive",
    avatar: "/avatars/robert.jpg",
    department: "Facilities",
    joinDate: "2020-06-18",
    schedule: "Mon-Fri, 7am-3pm",
    clients: 0,
    rating: 4.4,
  },
  {
    id: 7,
    name: "Amanda Clark",
    role: "Pilates Instructor",
    email: "amanda.c@example.com",
    phone: "(555) 789-0123",
    status: "active",
    avatar: "/avatars/amanda.jpg",
    department: "Training",
    joinDate: "2021-11-15",
    schedule: "Tue-Thu-Sat, 9am-5pm",
    clients: 25,
    rating: 4.9,
  },
  {
    id: 8,
    name: "John Rodriguez",
    role: "Manager",
    email: "john.r@example.com",
    phone: "(555) 890-1234",
    status: "active",
    avatar: "/avatars/john.jpg",
    department: "Management",
    joinDate: "2019-04-10",
    schedule: "Mon-Fri, 9am-5pm",
    clients: 0,
    rating: 4.7,
  },
]

// Staff Card Component
const StaffCard = ({ staff }: { staff: (typeof staffMembers)[0] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg font-medium">{staff.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-medium">{staff.name}</h3>
              <p className="text-sm text-gray-500">{staff.role}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{staff.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{staff.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{staff.department}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">Joined {new Date(staff.joinDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-500">Schedule:</span>
            <div className="flex items-center mt-1">
              <Clock className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-gray-600">{staff.schedule}</span>
            </div>
          </div>
          {staff.clients > 0 && (
            <div>
              <span className="text-gray-500">Clients:</span>
              <div className="flex items-center mt-1">
                <Users className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-600">{staff.clients}</span>
              </div>
            </div>
          )}
          {staff.rating > 0 && (
            <div>
              <span className="text-gray-500">Rating:</span>
              <div className="flex items-center mt-1">
                <Award className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-600">{staff.rating}/5</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100 px-6 py-3 flex justify-between">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            staff.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {staff.status === "active" ? "Active" : "Inactive"}
        </span>
        <div className="flex space-x-2">
          <button className="text-sm text-primary hover:underline">View</button>
          <button className="text-sm text-primary hover:underline">Edit</button>
        </div>
      </div>
    </div>
  )
}

// Staff Schedule Component
const StaffSchedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hours = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]

  // Mock schedule data
  const scheduleData = {
    Monday: {
      "6am": ["David Lee"],
      "8am": ["David Lee", "Sarah Johnson"],
      "10am": ["Sarah Johnson", "Michael Brown"],
      "12pm": ["Sarah Johnson", "Michael Brown", "Jessica Martinez"],
      "2pm": ["Sarah Johnson", "Michael Brown", "Jessica Martinez"],
      "4pm": ["Michael Brown", "Jessica Martinez"],
      "6pm": ["Jessica Martinez"],
      "8pm": ["Jessica Martinez"],
    },
    Tuesday: {
      "6am": ["David Lee"],
      "8am": ["David Lee"],
      "10am": ["Michael Brown", "Amanda Clark"],
      "12pm": ["Michael Brown", "Amanda Clark"],
      "2pm": ["Michael Brown", "Amanda Clark"],
      "4pm": ["Michael Brown", "Amanda Clark"],
      "6pm": ["Michael Brown"],
      "8pm": [],
    },
    // ... other days would be filled in similarly
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Staff Schedule</h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hours.map((hour) => (
              <tr key={hour} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{hour}</td>
                {days.map((day) => {
                  const staffAtTime = scheduleData[day]?.[hour] || []
                  return (
                    <td key={`${day}-${hour}`} className="px-4 py-3">
                      {staffAtTime.length > 0 ? (
                        <div className="space-y-1">
                          {staffAtTime.map((name, index) => (
                            <div
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block mr-1"
                            >
                              {name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Staff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [viewMode, setViewMode] = useState("grid")

  // Filter staff based on search and filters
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "All" || staff.department === filterDepartment
    const matchesStatus = filterStatus === "All" || staff.status === filterStatus.toLowerCase()

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Get unique departments for filter
  const departments = ["All", ...new Set(staffMembers.map((staff) => staff.department))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff by name, role, or email..."
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-3 py-2 text-sm ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium">{staff.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{staff.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{staff.email}</div>
                    <div className="text-gray-500">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{staff.schedule}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        staff.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {staff.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-primary hover:underline mr-3">View</button>
                    <button className="text-primary hover:underline mr-3">Edit</button>
                    <button className="text-gray-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Staff Schedule */}
      <StaffSchedule />

      {/* Department Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Department Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Training</span>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Administration</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Nutrition</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Facilities</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Management</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Staff Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Active</span>
                <span className="text-sm font-medium">7</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "87.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Inactive</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Staff Utilization</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <span className="text-lg font-bold">87%</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active staff</p>
                  <p className="text-sm text-gray-500">utilization rate</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-primary hover:underline">View Report</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium">MB</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Michael Brown</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">4.9</span>
                </div>
              </div>
              <span className="text-sm font-medium">35 clients</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium">EW</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Emma Wilson</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">4.7</span>
                </div>
              </div>
              <span className="text-sm font-medium">42 clients</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium">AC</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Amanda Clark</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">4.9</span>
                </div>
              </div>
              <span className="text-sm font-medium">25 clients</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/staff/performance" className="text-sm text-primary font-medium hover:underline">
              View all performance metrics
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-sm font-medium">Add New Staff</span>
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-sm font-medium">Manage Schedules</span>
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-sm font-medium">Performance Reviews</span>
              <Award className="w-4 h-4 text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <span className="text-sm font-medium">Staff Training</span>
              <Briefcase className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staff

