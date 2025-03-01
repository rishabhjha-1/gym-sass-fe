import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X
} from 'lucide-react';

// Mock data for customers
const CUSTOMERS = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john@example.com', 
    phone: '(555) 123-4567', 
    membership: 'Monthly', 
    status: 'active',
    joinDate: '2023-01-15',
    lastVisit: '2023-06-10',
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    email: 'sarah@example.com', 
    phone: '(555) 234-5678', 
    membership: 'Annual', 
    status: 'active',
    joinDate: '2022-11-05',
    lastVisit: '2023-06-12',
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    phone: '(555) 345-6789', 
    membership: 'Quarterly', 
    status: 'active',
    joinDate: '2023-03-22',
    lastVisit: '2023-06-08',
  },
  { 
    id: '4', 
    name: 'Emma Wilson', 
    email: 'emma@example.com', 
    phone: '(555) 456-7890', 
    membership: 'Monthly', 
    status: 'inactive',
    joinDate: '2022-08-17',
    lastVisit: '2023-05-20',
  },
  { 
    id: '5', 
    name: 'David Lee', 
    email: 'david@example.com', 
    phone: '(555) 567-8901', 
    membership: 'Annual', 
    status: 'active',
    joinDate: '2023-02-10',
    lastVisit: '2023-06-11',
  },
  { 
    id: '6', 
    name: 'Lisa Thompson', 
    email: 'lisa@example.com', 
    phone: '(555) 678-9012', 
    membership: 'Monthly', 
    status: 'active',
    joinDate: '2023-04-05',
    lastVisit: '2023-06-09',
  },
  { 
    id: '7', 
    name: 'Robert Wilson', 
    email: 'robert@example.com', 
    phone: '(555) 789-0123', 
    membership: 'Quarterly', 
    status: 'inactive',
    joinDate: '2022-10-12',
    lastVisit: '2023-04-30',
  },
  { 
    id: '8', 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    phone: '(555) 890-1234', 
    membership: 'Monthly', 
    status: 'active',
    joinDate: '2023-05-18',
    lastVisit: '2023-06-12',
  },
];

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMembership, setSelectedMembership] = useState<string>('all');
  
  // Filter customers based on search term and filters
  const filteredCustomers = CUSTOMERS.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
      
    const matchesStatus = 
      selectedStatus === 'all' || customer.status === selectedStatus;
      
    const matchesMembership = 
      selectedMembership === 'all' || customer.membership === selectedMembership;
      
    return matchesSearch && matchesStatus && matchesMembership;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link 
          to="/customers/new" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={selectedMembership}
              onChange={(e) => setSelectedMembership(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Memberships</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          
          <button className="p-2 border rounded-md hover:bg-gray-50">
            <Download className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <Link 
                          to={`/customers/${customer.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary"
                        >
                          {customer.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customer.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                <span className="font-medium">20</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary text-sm font-medium text-white">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;