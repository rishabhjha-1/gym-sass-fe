"use client"

import React, { useState } from "react"
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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Collect Payment</h3>
      </div>
      <div className="p-6 space-y-4">
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
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="amount"
              type="text"
              placeholder="0.00"
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentType" className="text-sm font-medium">
            Payment Type
          </label>
          <select id="paymentType" className="px-3 py-2 border rounded-md text-sm w-full">
            <option value="">Select payment type</option>
            <option value="membership">Membership Fee</option>
            <option value="personalTraining">Personal Training</option>
            <option value="classPass">Class Pass</option>
            <option value="merchandise">Merchandise</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium">
            Payment Method
          </label>
          <select id="paymentMethod" className="px-3 py-2 border rounded-md text-sm w-full">
            <option value="">Select payment method</option>
            <option value="creditCard">Credit Card</option>
            <option value="debitCard">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="bankTransfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            placeholder="Add payment notes..."
            className="px-3 py-2 border rounded-md text-sm w-full h-24 resize-none"
          ></textarea>
        </div>

        <div className="pt-4">
          <button className="w-full px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
            Process Payment
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null)

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.membershipType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "All" || payment.status === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Calculate summary statistics
  const totalDue = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0)
  const totalCollected = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)

  // Toggle expanded payment details
  const togglePaymentDetails = (id: number) => {
    if (expandedPayment === id) {
      setExpandedPayment(null)
    } else {
      setExpandedPayment(id)
    }
  }

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
          change="5 pending payments"
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
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
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
                      Type
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
                              <span className="text-sm font-medium">{payment.member.charAt(0)}</span>
                            </div>
                            <span className="font-medium">{payment.member}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.membershipType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end">
                            {payment.status !== "paid" && (
                              <button className="text-primary hover:underline mr-3">Collect</button>
                            )}
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
                                    <span>#{payment.id.toString().padStart(6, "0")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Membership Type:</span>
                                    <span>{payment.membershipType}</span>
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
                                      <span>{payment.paymentMethod}</span>
                                    </div>
                                  )}
                                  {payment.paymentDate && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Payment Date:</span>
                                      <span>{payment.paymentDate}</span>
                                    </div>
                                  )}
                                  {payment.receiptNumber && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Receipt Number:</span>
                                      <span>{payment.receiptNumber}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Actions</h4>
                                <div className="space-y-2">
                                  <button className="px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
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

