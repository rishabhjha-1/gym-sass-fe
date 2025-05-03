import BaseService from './baseService';
import axios from 'axios';

export type GenderType = 'male' | 'female' | 'other';
export type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'EXPIRED';
export type TrainingGoal = 'weight_loss' | 'muscle_gain' | 'general_fitness' | 'athletic_performance' | 'rehabilitation' | 'other';

export interface Membership {
  id: string;
  memberId: string;
  startDate: string;
  endDate: string;
  type: string;
  price: number;
  discount: number | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: GenderType;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  joinDate: string;
  lastVisit: string | null;
  expiryDate: string | null;
  status: MemberStatus;
  membershipType: MembershipType;
  trainingGoal: TrainingGoal;
  height: number;
  weight: number;
  notes: string;
  photoUrl: string;
  gymId: string;
  createdAt: string;
  updatedAt: string;
  memberships: Membership[];
  gymName: string;
}

export interface MemberListResponse {
  data: Member[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SearchParams {
  query: string;
  gymId: string;
}

class MemberService extends BaseService {
  constructor() {
    super('/members');
  }

  async searchMembers(params: SearchParams): Promise<Member[]> {
    try {
      return this.get<Member[]>('/search', {
        params: {
          query: params.query,
          gymId: params.gymId
        }
      });
    } catch (error) {
      console.error('Error searching members:', error);
      throw error;
    }
  }

  async getMembers(page: number, limit: number): Promise<MemberListResponse> {
    return this.get(`?page=${page}&limit=${limit}`);
  }

  async getMemberById(id: string): Promise<Member> {
    return this.get<Member>(`/${id}`);
  }

  async createMember(memberData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: GenderType;
    dateOfBirth: string | Date;
    address?: string;
    emergencyContact?: string;
    membershipType: MembershipType;
    status?: MemberStatus;
    trainingGoal?: TrainingGoal;
    height?: number;
    weight?: number;
    notes?: string;
    photoUrl?: string;
    gymId: string;
  }): Promise<Member> {
    return this.post('', memberData);
  }

  async updateMember(id: string, member: Member): Promise<Member> {
    return this.put(`/${id}`, member);
  }

  async deleteMember(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }

  async inactivateMember(id: string): Promise<void> {
    return this.patch(`/${id}/inactivate`);
  }

  async getRecentMembers(gymId: string): Promise<Member[]> {
    return this.get<Member[]>('/recent', { params: { gymId } });
  }

  async updateMemberMembershipType(id: string, gymId: string, membershipType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'): Promise<Member> {
    return this.patch(`/${id}/membership-type`, {
      membershipType,
      gymId
    });
  }
}

export default new MemberService();