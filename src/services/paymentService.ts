import { RevenueFilter, PaginatedResponse, PaymentStatus } from '../types';
import BaseService from './baseService';

export interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  memberId: string;
  dueDate: string;
  status: PaymentStatus;
  gymId: string;
  invoiceNumber: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    memberId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface RevenueStats {
  today: number;
  thisMonth: number;
  lastMonth: number;
  paymentMethods: Array<{
    paymentMethod: string;
    _sum: {
      amount: number;
    };
  }>;
  pending: {
    amount: number;
    count: number;
  };
  overdue: {
    amount: number;
    count: number;
  };
}

class PaymentService extends BaseService {
  constructor() {
    super('/payments');
  }

  async getPendingPayment(gymId: string): Promise<Payment[]> {
    return this.get(`/pending?gymId=${gymId}`);
  }

  async createPayment(paymentData: {
    amount: number;
    paymentMethod: string;
    memberId: string;
    dueDate: string;
    status?: PaymentStatus;
    gymId: string;
  }): Promise<Payment> {
    return this.post('/', paymentData);
  }

  async getPayments(
    filter: RevenueFilter & { gymId: string },
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams({
      gymId: filter.gymId,
      page: page.toString(),
      limit: limit.toString(),
      ...(filter.paymentMethod && { paymentMethod: filter.paymentMethod }),
      ...(filter.startDate && { startDate: filter.startDate }),
      ...(filter.endDate && { endDate: filter.endDate }),
    });

    return this.get(`?${params.toString()}`);
  }

  async getRevenueStats(gymId: string): Promise<RevenueStats> {
    return this.get(`/stats?gymId=${gymId}`);
  }

  async getPendingPayments(gymId: string): Promise<Payment[]> {
    return this.get(`/pending?gymId=${gymId}`);
  }

  async getPaymentById(id: string, gymId: string): Promise<Payment | null> {
    return this.get(`/${id}?gymId=${gymId}`);
  }

  async updatePaymentStatus(id: string, gymId: string, status: PaymentStatus): Promise<Payment> {
    return this.patch(`/${id}/status`, {
      status,
      gymId
    });
  }

  async updatePaymentMethod(id: string, gymId: string, paymentMethod: string): Promise<Payment> {
    return this.patch(`/${id}/payment-method`, {
      paymentMethod,
      gymId
    });
  }

  async updatePaymentAmount(id: string, gymId: string, amount: number): Promise<Payment> {
    return this.patch(`/${id}/amount`, {
      amount,
      gymId
    });
  }

  async deletePayment(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}

// Export a singleton instance
export default new PaymentService();
