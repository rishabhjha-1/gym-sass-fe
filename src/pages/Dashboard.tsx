import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  UserPlus,
  CreditCard
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

// Mock data for charts
const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 22000, 20000, 25000, 28000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const attendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Attendance',
      data: [65, 78, 52, 91, 83, 56, 42],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 4,
    },
  ],
};

const membershipData = {
  labels: ['Monthly', 'Quarterly', 'Annual', 'Pay-per-visit'],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 0,
    },
  ],
};

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
const RecentActivity = () => {
  const activities = [
    { 
      id: 1, 
      type: 'new-member', 
      title: 'New member joined', 
      description: 'Sarah Johnson signed up for a monthly membership', 
      time: '2 hours ago',
      icon: <UserPlus className="w-4 h-4 text-green-500" />
    },
    { 
      id: 2, 
      type: 'payment', 
      title: 'Payment received', 
      description: 'Michael Brown paid $120 for quarterly membership', 
      time: '4 hours ago',
      icon: <CreditCard className="w-4 h-4 text-blue-500" />
    },
    { 
      id: 3, 
      type: 'attendance', 
      title: 'High attendance day', 
      description: 'Today had 25% more attendance than average', 
      time: '6 hours ago',
      icon: <Users className="w-4 h-4 text-purple-500" />
    },
    { 
      id: 4, 
      type: 'payment', 
      title: 'Payment received', 
      description: 'Emma Wilson paid $50 for monthly membership', 
      time: '8 hours ago',
      icon: <CreditCard className="w-4 h-4 text-blue-500" />
    },
  ];
  
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
const UpcomingPayments = () => {
  const payments = [
    { id: 1, name: 'John Smith', amount: '$120', due: '2 days', status: 'pending' },
    { id: 2, name: 'Emily Davis', amount: '$80', due: '3 days', status: 'pending' },
    { id: 3, name: 'Robert Wilson', amount: '$150', due: '5 days', status: 'pending' },
    { id: 4, name: 'Lisa Thompson', amount: '$90', due: '7 days', status: 'pending' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Upcoming Payments</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <div key={payment.id} className="px-6 py-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">{payment.name}</h4>
              <p className="text-xs text-gray-500 mt-1">Due in {payment.due}</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">{payment.amount}</span>
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
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
          value="1,248" 
          change="12% from last month" 
          icon={<Users className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$28,650" 
          change="8% from last month" 
          icon={<DollarSign className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
        <StatCard 
          title="Daily Attendance" 
          value="186" 
          change="5% from yesterday" 
          icon={<Calendar className="w-6 h-6 text-primary" />} 
          trend="down" 
        />
        <StatCard 
          title="New Members" 
          value="24" 
          change="18% from last month" 
          icon={<TrendingUp className="w-6 h-6 text-primary" />} 
          trend="up" 
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
          <RecentActivity />
        </div>
      </div>
      
      {/* Fourth Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingPayments />
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
              {/* <Image className="w-8 h-8 text-primary mb-2" /> */}
              <span className="text-sm font-medium">Generate Content</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;