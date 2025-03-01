import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Filter, Download, CreditCard, Wallet, Users } from 'lucide-react';
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
import { Line, Bar } from 'react-chartjs-2';

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
const monthlyRevenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 22000, 20000, 25000, 28000, 26000, 29000, 31000, 28000, 32000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const revenueSourceData = {
  labels: ['Memberships', 'Personal Training', 'Classes', 'Merchandise', 'Supplements', 'Other'],
  datasets: [
    {
      label: 'Revenue Sources',
      data: [65000, 28000, 15000, 8000, 5000, 3000],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)',
      ],
      borderRadius: 4,
    },
  ],
};

// Revenue Summary Card Component
const RevenueSummaryCard = ({ 
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
          <ArrowUpRight className="w-4 h-4 text-red-500 mr-1 rotate-180" />
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

// Recent Transactions Component
const RecentTransactions = () => {
  const transactions = [
    { id: 1, member: 'John Smith', type: 'Monthly Membership', amount: '$120', date: '2023-03-15', status: 'completed' },
    { id: 2, member: 'Emily Davis', type: 'Personal Training', amount: '$80', date: '2023-03-14', status: 'completed' },
    { id: 3, member: 'Robert Wilson', type: 'Annual Membership', amount: '$950', date: '2023-03-12', status: 'completed' },
    { id: 4, member: 'Lisa Thompson', type: 'Merchandise', amount: '$45', date: '2023-03-10', status: 'completed' },
    { id: 5, member: 'Michael Brown', type: 'Quarterly Membership', amount: '$320', date: '2023-03-08', status: 'completed' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="text-sm text-primary font-medium hover:underline flex items-center">
          <Download className="w-4 h-4 mr-1" /> Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.member}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">Showing 5 of 120 transactions</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm">Previous</button>
          <button className="px-3 py-1 bg-primary text-white rounded text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

const Revenue: React.FC = () => {
  const [timeframe, setTimeframe] = useState('year');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Revenue</h1>
        <div className="flex space-x-2">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
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
      
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueSummaryCard 
          title="Total Revenue" 
          value="$124,750" 
          change="15% from last year" 
          icon={<DollarSign className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
        <RevenueSummaryCard 
          title="Membership Revenue" 
          value="$85,320" 
          change="12% from last year" 
          icon={<Users className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
        <RevenueSummaryCard 
          title="Average Transaction" 
          value="$186" 
          change="5% from last year" 
          icon={<CreditCard className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
        <RevenueSummaryCard 
          title="Recurring Revenue" 
          value="$9,850" 
          change="18% from last year" 
          icon={<Wallet className="w-6 h-6 text-primary" />} 
          trend="up" 
        />
      </div>
      
      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <select className="px-2 py-1 border rounded-md text-sm">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <Line 
            data={monthlyRevenueData} 
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Sources</h3>
            <select className="px-2 py-1 border rounded-md text-sm">
              <option>All Sources</option>
              <option>Memberships Only</option>
              <option>Services Only</option>
            </select>
          </div>
          <Bar 
            data={revenueSourceData} 
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
      </div>
      
      {/* Recent Transactions */}
      <RecentTransactions />
      
      {/* Revenue Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Top Revenue Generators</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Monthly Memberships</p>
                <p className="text-sm text-gray-500">48% of total revenue</p>
              </div>
              <span className="font-semibold">$59,880</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '48%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Personal Training</p>
                <p className="text-sm text-gray-500">22% of total revenue</p>
              </div>
              <span className="font-semibold">$27,445</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Annual Memberships</p>
                <p className="text-sm text-gray-500">15% of total revenue</p>
              </div>
              <span className="font-semibold">$18,712</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Group Classes</p>
                <p className="text-sm text-gray-500">8% of total revenue</p>
              </div>
              <span className="font-semibold">$9,980</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue Forecast</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Month</p>
              <p className="text-xl font-bold mt-1">$32,500</p>
              <p className="text-xs text-green-500 mt-1">+5% projected</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Quarter</p>
              <p className="text-xl font-bold mt-1">$98,700</p>
              <p className="text-xs text-green-500 mt-1">+8% projected</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Year</p>
              <p className="text-xl font-bold mt-1">$412,000</p>
              <p className="text-xs text-green-500 mt-1">+12% projected</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Q1 2023 Target</span>
                <span className="text-sm font-medium">$90,000 / $100,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Q2 2023 Target</span>
                <span className="text-sm font-medium">$75,000 / $110,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Annual Target</span>
                <span className="text-sm font-medium">$320,000 / $450,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
