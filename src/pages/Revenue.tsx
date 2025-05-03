import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Filter, Download, CreditCard, Wallet, Users, IndianRupee } from 'lucide-react';
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
import { useAuth } from '../contexts/AuthContext';
import paymentService, { Payment, RevenueStats } from '../services/paymentService';
import { RevenueFilter, PaymentStatus } from '../types';

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
const RecentTransactions = ({ transactions }: { transactions: Payment[] }) => {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {transaction.member?.firstName} {transaction.member?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.paidDate || transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' :
                    transaction.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === PaymentStatus.OVERDUE ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Revenue: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('month');
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add new state for forecast data
  const [forecastData, setForecastData] = useState({
    nextMonth: 0,
    nextQuarter: 0,
    nextYear: 0,
    growthRates: {
      monthly: 0,
      quarterly: 0,
      yearly: 0
    }
  });

  useEffect(() => {
    if (user?.gymId) {
      fetchData();
    }
  }, [user?.gymId, timeframe]);

  // Add new function to calculate forecasts
  const calculateForecasts = (currentStats: RevenueStats) => {
    const monthlyGrowth = currentStats.thisMonth / (currentStats.lastMonth || 1) - 1;
    const quarterlyGrowth = monthlyGrowth * 3;
    const yearlyGrowth = monthlyGrowth * 12;

    setForecastData({
      nextMonth: currentStats.thisMonth * (1 + monthlyGrowth),
      nextQuarter: currentStats.thisMonth * 3 * (1 + quarterlyGrowth),
      nextYear: currentStats.thisMonth * 12 * (1 + yearlyGrowth),
      growthRates: {
        monthly: monthlyGrowth * 100,
        quarterly: quarterlyGrowth * 100,
        yearly: yearlyGrowth * 100
      }
    });
  };

  // Update fetchData to calculate forecasts
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, paymentsData] = await Promise.all([
        paymentService.getRevenueStats(user!.gymId),
        paymentService.getPayments({
          gymId: user!.gymId,
          startDate: getStartDate(),
          endDate: new Date().toISOString()
        })
      ]);
      setStats(statsData);
      setRecentPayments(paymentsData.data);
      calculateForecasts(statsData);
    } catch (err) {
      setError("Failed to fetch revenue data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeframe) {
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      case 'quarter':
        return new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
      case 'year':
        return new Date(now.getFullYear(), 0, 1).toISOString();
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

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
          </select>
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
          value={formatCurrency(stats.thisMonth)} 
          change={`${calculateChange(stats.thisMonth, stats.lastMonth)} from last month`}
          icon={<IndianRupee className="w-6 h-6 text-primary" />} 
          trend={stats.thisMonth >= stats.lastMonth ? "up" : "down"} 
        />
        <RevenueSummaryCard 
          title="Pending Payments" 
          value={formatCurrency(stats.pending.amount)} 
          change={`${stats.pending.count} payments pending`}
          icon={<Wallet className="w-6 h-6 text-primary" />} 
          trend="neutral" 
        />
        <RevenueSummaryCard 
          title="Overdue Payments" 
          value={formatCurrency(stats.overdue.amount)} 
          change={`${stats.overdue.count} payments overdue`}
          icon={<CreditCard className="w-6 h-6 text-primary" />} 
          trend="neutral" 
        />
        <RevenueSummaryCard 
          title="Payment Methods" 
          value={`${stats.paymentMethods.length} methods`} 
          change="Active payment methods"
          icon={<Users className="w-6 h-6 text-primary" />} 
          trend="neutral" 
        />
      </div>
      
      {/* Revenue Forecast Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Forecast</h3>
            <select className="px-2 py-1 border rounded-md text-sm">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Month</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(forecastData.nextMonth)}</p>
              <p className={`text-xs mt-1 ${forecastData.growthRates.monthly >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {forecastData.growthRates.monthly >= 0 ? '+' : ''}{forecastData.growthRates.monthly.toFixed(1)}% projected
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Quarter</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(forecastData.nextQuarter)}</p>
              <p className={`text-xs mt-1 ${forecastData.growthRates.quarterly >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {forecastData.growthRates.quarterly >= 0 ? '+' : ''}{forecastData.growthRates.quarterly.toFixed(1)}% projected
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-500">Next Year</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(forecastData.nextYear)}</p>
              <p className={`text-xs mt-1 ${forecastData.growthRates.yearly >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {forecastData.growthRates.yearly >= 0 ? '+' : ''}{forecastData.growthRates.yearly.toFixed(1)}% projected
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
          </div>
          <Line 
            data={{
              labels: ['Last Month', 'This Month', 'Next Month'],
              datasets: [{
                label: 'Revenue',
                data: [
                  stats.lastMonth,
                  stats.thisMonth,
                  forecastData.nextMonth
                ],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
              }]
            }} 
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

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Top Revenue Sources</h3>
          <div className="space-y-4">
            {stats.paymentMethods.map((method, index) => {
              const percentage = (method._sum.amount / stats.thisMonth) * 100;
              const colors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-yellow-500',
                'bg-purple-500',
                'bg-red-500'
              ];
              
              return (
                <div key={method.paymentMethod}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{method.paymentMethod}</p>
                      <p className="text-sm text-gray-500">{percentage.toFixed(1)}% of total revenue</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(method._sum.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index % colors.length]}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue Targets</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Monthly Target</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stats.thisMonth)} / {formatCurrency(forecastData.nextMonth)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(stats.thisMonth / forecastData.nextMonth) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Quarterly Target</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stats.thisMonth * 3)} / {formatCurrency(forecastData.nextQuarter)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(stats.thisMonth * 3 / forecastData.nextQuarter) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Annual Target</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stats.thisMonth * 12)} / {formatCurrency(forecastData.nextYear)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(stats.thisMonth * 12 / forecastData.nextYear) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment Methods Distribution</h3>
        </div>
        <Bar 
          data={{
            labels: stats.paymentMethods.map(method => method.paymentMethod),
            datasets: [{
              label: 'Amount',
              data: stats.paymentMethods.map(method => method._sum.amount),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderRadius: 4,
            }]
          }} 
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
                  callback: (value) => `Rs.${value}`,
                },
              },
            },
          }} 
        />
      </div>
      
      {/* Recent Transactions */}
      <RecentTransactions transactions={recentPayments} />
    </div>
  );
};

export default Revenue;
