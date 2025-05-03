import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  UserPlus,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import memberService from '../services/memberService';
import attendanceService from '../services/attendanceService';
import paymentService from '../services/paymentService';
import { PaymentStatus } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Activity {
  id: string;
  type: 'payment' | 'attendance';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface DashboardStats {
  totalMembers: number;
  monthlyRevenue: number;
  dailyAttendance: number;
  newMembers: number;
  lastMonthMembers: number;
  lastMonthRevenue: number;
  yesterdayAttendance: number;
  lastMonthNewMembers: number;
}

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode; 
  trend: 'up' | 'down' | 'neutral' 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
        ) : trend === 'down' ? (
          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        ) : null}
        <span className={`text-sm ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 
          'text-gray-500'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }: { activities: Activity[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex items-start">
            <div className="p-2 bg-gray-100 rounded-full mr-4">
              {activity.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{activity.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t border-gray-100">
        <Link to="/activity" className="text-sm text-primary font-medium hover:underline">
          View all activity
        </Link>
      </div>
    </div>
  );
};

// Upcoming Payments Component
const UpcomingPayments = ({ payments }: { payments: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Upcoming Payments</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <div key={payment.id} className="px-6 py-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">
                {payment.member?.firstName} {payment.member?.lastName}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Due on {new Date(payment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">
                ${payment.amount.toFixed(2)}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                payment.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                payment.status === PaymentStatus.OVERDUE ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t border-gray-100">
        <Link to="/fees" className="text-sm text-primary font-medium hover:underline">
          View all payments
        </Link>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    monthlyRevenue: 0,
    dailyAttendance: 0,
    newMembers: 0,
    lastMonthMembers: 0,
    lastMonthRevenue: 0,
    yesterdayAttendance: 0,
    lastMonthNewMembers: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Attendance',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 2
    }]
  });
  const [revenueData, setRevenueData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 4
    }]
  });
  const [membershipData, setMembershipData] = useState({
    labels: ['Monthly', 'Quarterly', 'Annual', 'Pay-per-visit'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 0,
    }]
  });

  useEffect(() => {
    if (user?.gymId) {
      fetchDashboardData();
    }
  }, [user?.gymId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        membersResponse,
        attendanceResponse,
        paymentsResponse,
        revenueResponse
      ] = await Promise.all([
        memberService.getMembers(1, 1000),
        attendanceService.getAttendance({ 
          gymId: user!.gymId, 
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
          endDate: new Date().toISOString() 
        }),
        paymentService.getPendingPayment(user!.gymId),
        paymentService.getRevenueStats(user!.gymId)
      ]);

      // Process members data
      const totalMembers = membersResponse.data.length;
      const newMembers = membersResponse.data.filter(member => {
        const joinDate = new Date(member.joinDate);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return joinDate >= oneMonthAgo;
      }).length;

      // Process attendance data
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const dailyAttendance = attendanceResponse.data.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === today.toDateString();
      }).length;

      const weeklyAttendance = Array(7).fill(0);
      attendanceResponse.data.forEach(record => {
        const recordDate = new Date(record.timestamp);
        const dayIndex = recordDate.getDay();
        weeklyAttendance[dayIndex]++;
      });

      // Process payments data
      const monthlyRevenue = revenueResponse.thisMonth;
      const lastMonthRevenue = revenueResponse.lastMonth;

      // Update states
      setStats({
        totalMembers,
        monthlyRevenue,
        dailyAttendance,
        newMembers,
        lastMonthMembers: totalMembers - newMembers,
        lastMonthRevenue,
        yesterdayAttendance: weeklyAttendance[6],
        lastMonthNewMembers: Math.floor(newMembers * 0.8) // Approximation
      });

      setAttendanceData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: weeklyAttendance
        }]
      }));

      setRevenueData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: [0, 0, 0, 0, 0, 0, monthlyRevenue] // Simplified for now
        }]
      }));

      setUpcomingPayments(paymentsResponse);

      // Generate recent activities
      const activities: Activity[] = [
        ...paymentsResponse.slice(0, 2).map((payment: any) => ({
          id: payment.id,
          type: 'payment' as const,
          title: 'Payment Received',
          description: `${payment.member?.firstName} ${payment.member?.lastName} paid $${payment.amount.toFixed(2)}`,
          time: 'Just now',
          icon: <CreditCard className="w-4 h-4 text-blue-500" />
        })),
        ...attendanceResponse.data.slice(0, 2).map((record: any) => ({
          id: record.id,
          type: 'attendance' as const,
          title: 'Member Checked In',
          description: `${record.member?.firstName} ${record.member?.lastName} checked in`,
          time: 'Just now',
          icon: <Calendar className="w-4 h-4 text-purple-500" />
        }))
      ];
      setRecentActivities(activities);

    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers.toString()} 
          change={`${calculateChange(stats.totalMembers, stats.lastMonthMembers)} from last month`}
          icon={<Users className="w-6 h-6 text-primary" />} 
          trend={stats.totalMembers >= stats.lastMonthMembers ? "up" : "down"} 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats.monthlyRevenue)} 
          change={`${calculateChange(stats.monthlyRevenue, stats.lastMonthRevenue)} from last month`}
          icon={<IndianRupee className="w-6 h-6 text-primary" />} 
          trend={stats.monthlyRevenue >= stats.lastMonthRevenue ? "up" : "down"} 
        />
        <StatCard 
          title="Daily Attendance" 
          value={stats.dailyAttendance.toString()} 
          change={`${calculateChange(stats.dailyAttendance, stats.yesterdayAttendance)} from yesterday`}
          icon={<Calendar className="w-6 h-6 text-primary" />} 
          trend={stats.dailyAttendance >= stats.yesterdayAttendance ? "up" : "down"} 
        />
        <StatCard 
          title="New Members" 
          value={stats.newMembers.toString()} 
          change={`${calculateChange(stats.newMembers, stats.lastMonthNewMembers)} from last month`}
          icon={<TrendingUp className="w-6 h-6 text-primary" />} 
          trend={stats.newMembers >= stats.lastMonthNewMembers ? "up" : "down"} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <Line 
            data={revenueData} 
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
                  ticks: {
                    callback: (value) => `$${value}`,
                  },
                },
              },
            }} 
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
          <Bar 
            data={attendanceData} 
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
      
      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Membership Distribution</h3>
          <div className="flex justify-center">
            <div style={{ width: '240px', height: '240px' }}>
              <Doughnut 
                data={membershipData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  cutout: '65%',
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
      
      {/* Fourth Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingPayments payments={upcomingPayments} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <Link to="/customers/new" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <UserPlus className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Add Member</span>
            </Link>
            <Link to="/fees/collect" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <CreditCard className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Collect Payment</span>
            </Link>
            <Link to="/attendance/check-in" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Calendar className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">Check-in Member</span>
            </Link>
            <Link to="/ai-content" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Generate Content</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;