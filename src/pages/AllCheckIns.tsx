import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import attendanceService from "../services/attendanceService"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react"

const AllCheckIns: React.FC = () => {
  const { user } = useAuth()
  const [checkIns, setCheckIns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (user?.gymId) {
      fetchCheckIns()
    }
  }, [user?.gymId, selectedDate])

  const fetchCheckIns = async () => {
    try {
      setLoading(true)
      
      // Create dates in local timezone
      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)
      
      // Set to start of day in local timezone
      startDate.setHours(0, 0, 0, 0)
      // Set to end of day in local timezone
      endDate.setHours(23, 59, 59, 999)

      // Convert to ISO strings
      const startDateISO = startDate.toISOString()
      const endDateISO = endDate.toISOString()

      console.log('Date range:', {
        selectedDate,
        startDate: startDate.toLocaleString(),
        endDate: endDate.toLocaleString(),
        startDateISO,
        endDateISO
      })

      const response = await attendanceService.getAttendance({
        gymId: user!.gymId,
        startDate: startDateISO,
        endDate: endDateISO
      })

      console.log('Response data:', response.data)

      // Filter the response data to ensure we only show check-ins for the selected date
      const filteredData = response.data.filter((checkIn: any) => {
        const checkInDate = new Date(checkIn.timestamp)
        return checkInDate >= startDate && checkInDate <= endDate
      })

      console.log('Filtered data:', filteredData)
      setCheckIns(filteredData)
    } catch (err) {
      setError("Failed to fetch check-ins")
      console.error('Error fetching check-ins:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCheckIns = checkIns.filter(checkIn => {
    const memberName = `${checkIn.member?.firstName} ${checkIn.member?.lastName}`.toLowerCase()
    return memberName.includes(searchTerm.toLowerCase())
  })

  const sortedCheckIns = [...filteredCheckIns].sort((a, b) => {
    const dateA = new Date(a.timestamp)
    const dateB = new Date(b.timestamp)
    return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Check-ins</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="px-3 py-2 border rounded-md text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Check-in History for {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <button
              onClick={toggleSortOrder}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronUp className="w-4 h-4 mr-1" />}
              Sort by Time
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedCheckIns.map((checkIn) => (
            <div key={checkIn.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
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
          {sortedCheckIns.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No check-ins found for this date
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllCheckIns 