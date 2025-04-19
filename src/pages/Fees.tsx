"use client"

import React, { useState, useEffect } from "react"
import {
  DollarSign,
  Search,
  Plus,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react"
import memberService, { Member } from '../services/memberService';
import paymentService, { Payment } from '../services/paymentService';
import { PaymentStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Mock data for fees and payments
const payments = [
  {
    id: 1,
    member: "John Smith",
    membershipType: "Monthly",
    amount: 120,
    dueDate: "2023-03-15",
    status: "paid",
    paymentMethod: "Credit Card",
    paymentDate: "2023-03-10",
    receiptNumber: "REC-001234",
  },
  {
    id: 2,
    member: "Emily Davis",
    membershipType: "Quarterly",
    amount: 320,
    dueDate: "2023-03-20",
    status: "pending",
    paymentMethod: null,
    paymentDate: null,
    receiptNumber: null,
  },
  {
    id: 3,
    member: "Robert Wilson",
    membershipType: "Annual",
    amount: 950,
    dueDate: "2023-03-25",
    status: "pending",
    paymentMethod: null,
    paymentDate: null,
    receiptNumber: null,
  },
  {
    id: 4,
    member: "Lisa Thompson",
    membershipType: "Monthly",
    amount: 120,
    dueDate: "2023-03-18",
    status: "overdue",
    paymentMethod: null,
    paymentDate: null,
    receiptNumber: null,
  },
  {
    id: 5,
    member: "Michael Brown",
    membershipType: "Monthly",
    amount: 120,
    dueDate: "2023-03-05",
    status: "paid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2023-03-03",
    receiptNumber: "REC-001235",
  },
  {
    id: 6,
    member: "Sarah Johnson",
    membershipType: "Quarterly",
    amount: 320,
    dueDate: "2023-03-12",
    status: "paid",
    paymentMethod: "Cash",
    paymentDate: "2023-03-11",
    receiptNumber: "REC-001236",
  },
  {
    id: 7,
    member: "David Lee",
    membershipType: "Monthly",
    amount: 120,
    dueDate: "2023-03-30",
    status: "pending",
    paymentMethod: null,
    paymentDate: null,
    receiptNumber: null,
  },
  {
    id: 8,
    member: "Jessica Martinez",
    membershipType: "Annual",
    amount: 950,
    dueDate: "2023-03-22",
    status: "pending",
    paymentMethod: null,
    paymentDate: null,
    receiptNumber: null,
  },
]

// Fee Summary Card Component
const FeeSummaryCard = ({
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

// Payment Collection Form Component
const PaymentCollectionForm = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "",
    dueDate: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounced search function
  useEffect(() => {
    const searchMembers = async () => {
      if (searchTerm.length < 2) {
        setMembers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await memberService.getMembers(1, 10);
        const filteredMembers = response.data.filter(member => 
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMembers(filteredMembers);
      } catch (error) {
        console.error('Error searching members:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchMembers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !user?.gymId) return;

    setSubmitting(true);
    try {
      await paymentService.createPayment({
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        memberId: selectedMember.id,
        dueDate: formData.dueDate,
        status: PaymentStatus.PENDING,
        gymId: user.gymId
      });

      // Reset form
      setSelectedMember(null);
      setSearchTerm("");
      setFormData({
        amount: "",
        paymentMethod: "",
        dueDate: new Date().toISOString().split('T')[0],
        notes: ""
      });

      // Show success message or refresh payments list
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Collect Payment</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="member" className="text-sm font-medium">
            Member
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="member"
              type="text"
              placeholder="Search member..."
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setSelectedMember(null);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && searchTerm.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {loading ? (
                  <div className="p-2 text-sm text-gray-500">Loading...</div>
                ) : members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleMemberSelect(member)}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-xs text-gray-500">ID: {member.memberId}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">No members found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedMember && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium">
                  {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-medium">{selectedMember.firstName} {selectedMember.lastName}</h4>
                <p className="text-sm text-gray-500">ID: {selectedMember.memberId}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="px-3 py-2 border rounded-md text-sm w-full"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Select payment method</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="px-3 py-2 border rounded-md text-sm w-full"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Add payment notes..."
            className="px-3 py-2 border rounded-md text-sm w-full h-24 resize-none"
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:opacity-50"
            disabled={!selectedMember || submitting}
          >
            {submitting ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Membership Plans Component
const MembershipPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Monthly Membership",
      price: 120,
      period: "month",
      features: ["Full gym access", "Group classes", "Locker access", "Fitness assessment"],
      popular: false,
    },
    {
      id: 2,
      name: "Quarterly Membership",
      price: 320,
      period: "3 months",
      features: ["Full gym access", "Group classes", "Locker access", "Fitness assessment", "1 PT session/month"],
      popular: true,
    },
    {
      id: 3,
      name: "Annual Membership",
      price: 950,
      period: "year",
      features: [
        "Full gym access",
        "Group classes",
        "Locker access",
        "Fitness assessment",
        "2 PT sessions/month",
        "Nutrition consultation",
      ],
      popular: false,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Membership Plans</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg overflow-hidden ${plan.popular ? "border-primary ring-1 ring-primary" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-center py-1 text-xs font-medium">MOST POPULAR</div>
              )}
              <div className="p-6">
                <h4 className="text-lg font-semibold">{plan.name}</h4>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      plan.popular ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-700"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Fees: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "All">("All")
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Function to check if payment is within 5 days of due date
  const isWithinFiveDaysOfDueDate = (dueDate: string) => {
    const today = new Date();
    const paymentDueDate = new Date(dueDate);
    const diffTime = paymentDueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  };

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.gymId) return;
      
      setLoading(true);
      try {
        const response = await paymentService.getPayments(
          { 
            gymId: user.gymId,
            ...(filterStatus !== "All" && { status: filterStatus }),
            ...(searchTerm && { search: searchTerm })
          },
          page,
          10
        );

        // Check for overdue payments and update them
        const today = new Date();
        const updatedPayments = await Promise.all(response.data.map(async (payment) => {
          if (payment.status === PaymentStatus.PENDING) {
            const dueDate = new Date(payment.dueDate);
            if (dueDate < today) {
              try {
                // Update payment status to OVERDUE
                await paymentService.updatePaymentStatus(payment.id, user.gymId, PaymentStatus.OVERDUE);
                return { ...payment, status: PaymentStatus.OVERDUE };
              } catch (error) {
                console.error('Error updating payment status to overdue:', error);
                return payment;
              }
            }
          }
          return payment;
        }));

        setPayments(updatedPayments);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.gymId, filterStatus, searchTerm, page]);

  // Get revenue stats
  const [revenueStats, setRevenueStats] = useState<{
    today: number;
    thisMonth: number;
    lastMonth: number;
    paymentMethods: Array<{ paymentMethod: string; _sum: { amount: number } }>;
    pending: { amount: number; count: number };
    overdue: { amount: number; count: number };
  } | null>(null);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      if (!user?.gymId) return;

      try {
        const stats = await paymentService.getRevenueStats(user.gymId);
        setRevenueStats(stats);
      } catch (error) {
        console.error('Error fetching revenue stats:', error);
      }
    };

    fetchRevenueStats();
  }, [user?.gymId]);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.member?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.member?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.member?.memberId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" 
      ? payment.status !== PaymentStatus.PENDING || isWithinFiveDaysOfDueDate(payment.dueDate)
      : payment.status === filterStatus && 
        (payment.status !== PaymentStatus.PENDING || isWithinFiveDaysOfDueDate(payment.dueDate));

    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const totalDue = payments
    .filter(payment => 
      payment.status === PaymentStatus.PENDING && 
      isWithinFiveDaysOfDueDate(payment.dueDate)
    )
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalCollected = revenueStats?.thisMonth || 0;
  const overdueAmount = revenueStats?.overdue.amount || 0;

  // Get count of pending payments within 5 days
  const pendingPaymentsCount = payments.filter(payment => 
    payment.status === PaymentStatus.PENDING && 
    isWithinFiveDaysOfDueDate(payment.dueDate)
  ).length;

  // Toggle expanded payment details
  const togglePaymentDetails = (id: string) => {
    if (expandedPayment === id) {
      setExpandedPayment(null);
    } else {
      setExpandedPayment(id);
    }
  };

  // Handle payment status update
  const handleStatusUpdate = async (paymentId: string, newStatus: PaymentStatus, paymentMethod?: string) => {
    if (!user?.gymId) return;

    try {
      // Update payment status
      await paymentService.updatePaymentStatus(paymentId, user.gymId, newStatus);
      
      // Update payment method if provided
      if (paymentMethod) {
        await paymentService.updatePaymentMethod(paymentId, user.gymId, paymentMethod);
      }
      
      // Find the payment that was updated
      const paymentToUpdate = payments.find(payment => payment.id === paymentId);
      
      // Create next payment based on membership type
      if (paymentToUpdate && newStatus === PaymentStatus.PAID) {
        // Get member details to access membership type
        const memberDetails = await memberService.getMemberById(paymentToUpdate.memberId);
        
        if (memberDetails) {
          let nextDueDate = new Date(paymentToUpdate.dueDate);
          
          // Calculate next due date based on membership type
          if (memberDetails.membershipType === 'MONTHLY') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (memberDetails.membershipType === 'QUARTERLY') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 3);
          } else if (memberDetails.membershipType === 'ANNUAL') {
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          }
          
          // Create next payment
          await paymentService.createPayment({
            amount: paymentToUpdate.amount,
            paymentMethod: paymentMethod || paymentToUpdate.paymentMethod || 'CASH', // Use updated payment method if provided
            memberId: paymentToUpdate.memberId,
            dueDate: nextDueDate.toISOString().split('T')[0],
            status: PaymentStatus.PENDING,
            gymId: user.gymId
          });
        }
      }
      
      // Refresh payments after status update
      const updatedPayments = payments.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: newStatus,
              ...(paymentMethod && { paymentMethod }) // Update payment method if provided
            } 
          : payment
      );
      setPayments(updatedPayments);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  // Handle payment method update
  const handlePaymentMethodUpdate = async (paymentId: string, newPaymentMethod: string) => {
    if (!user?.gymId) return;

    try {
      await paymentService.updatePaymentMethod(paymentId, user.gymId, newPaymentMethod);
      
      // Update local state
      const updatedPayments = payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, paymentMethod: newPaymentMethod } 
          : payment
      );
      setPayments(updatedPayments);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fees & Payments</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeeSummaryCard
          title="Total Due"
          value={`$${totalDue.toFixed(2)}`}
          change={`${pendingPaymentsCount} pending payments`}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
          trend="neutral"
        />
        <FeeSummaryCard
          title="Total Collected"
          value={`$${totalCollected.toFixed(2)}`}
          change="This month"
          icon={<CreditCard className="w-6 h-6 text-primary" />}
          trend="up"
        />
        <FeeSummaryCard
          title="Overdue Amount"
          value={`$${overdueAmount.toFixed(2)}`}
          change="1 overdue payment"
          icon={<AlertCircle className="w-6 h-6 text-primary" />}
          trend="down"
        />
        <FeeSummaryCard
          title="Next Due Date"
          value="Mar 15, 2023"
          change="3 days from now"
          icon={<Calendar className="w-6 h-6 text-primary" />}
          trend="neutral"
        />
      </div>

      {/* Payments Table and Collection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payments</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    className="pl-10 pr-4 py-2 border rounded-md text-sm w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border rounded-md text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as PaymentStatus)}
                >
                  <option value="All">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => togglePaymentDetails(payment.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium">
                                {payment.member?.firstName?.charAt(0) || '?'}
                              </span>
                            </div>
                            <span className="font-medium">
                              {payment.member?.firstName} {payment.member?.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === PaymentStatus.PAID
                                ? "bg-green-100 text-green-800"
                                : payment.status === PaymentStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.paymentMethod || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end">
                            {/* {payment.status !== PaymentStatus.PAID && (
                              <button 
                                className="text-primary hover:underline mr-3" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleStatusUpdate(payment.id, PaymentStatus.PAID); 
                                }}
                              >
                                Collect
                              </button>
                            )} */}
                            <button className="text-gray-500 hover:underline mr-3">Edit</button>
                            {expandedPayment === payment.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedPayment === payment.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Payment ID:</span>
                                    <span>#{payment.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Amount:</span>
                                    <span>${payment.amount}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Due Date:</span>
                                    <span>{payment.dueDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span>{payment.status}</span>
                                  </div>
                                  {payment.paymentMethod && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Payment Method:</span>
                                      <div className="flex items-center space-x-2">
                                        <span>{payment.paymentMethod}</span>
                                        <select
                                          className="px-2 py-1 border rounded-md text-sm"
                                          value={payment.paymentMethod}
                                          onChange={(e) => handlePaymentMethodUpdate(payment.id, e.target.value)}
                                        >
                                          <option value="CREDIT_CARD">Credit Card</option>
                                          <option value="DEBIT_CARD">Debit Card</option>
                                          <option value="CASH">Cash</option>
                                          <option value="BANK_TRANSFER">Bank Transfer</option>
                                          <option value="OTHER">Other</option>
                                        </select>
                                      </div>
                                    </div>
                                  )}
                                  {payment.paidDate && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Payment Date:</span>
                                      <span>{payment.paidDate}</span>
                                    </div>
                                  )}
                                  {payment.invoiceNumber && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Invoice Number:</span>
                                      <span>{payment.invoiceNumber}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Actions</h4>
                                <div className="space-y-2">
                                  <button className="px-3 py-1 bg-primary text-white rounded-md text-xs font-medium" onClick={() => handleStatusUpdate(payment.id, PaymentStatus.PAID)}>
                                    Mark as Paid
                                  </button>
                                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium">
                                    Send Reminder
                                  </button>
                                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PaymentCollectionForm />
      </div>
      <MembershipPlans />
    </div>
  )
}

export default Fees
