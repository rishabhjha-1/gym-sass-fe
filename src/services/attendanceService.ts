import BaseService from './baseService';

interface Attendance {
  id: string;
  memberId: string;
  type: string;
  notes?: string;
  timestamp: string;
  member: {
    id: string;
    memberId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AttendanceFilter {
  memberId?: string;
  startDate?: string;
  endDate?: string;
  gymId: string;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AttendanceStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  hourlyDistribution: Array<{ hour: number; count: number }>;
  weekdayDistribution: Array<{ day: string; count: number }>;
  change: {
    daily: number;
    weekly: number;
  };
}

class AttendanceService extends BaseService {
  constructor() {
    super('/attendance');
  }

  async recordAttendance(attendanceData: {
    memberId: string;
    gymId: string;
  }): Promise<Attendance> {
    return this.post<Attendance>('/', attendanceData);
  }

  async getAttendance(
    filter: AttendanceFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Attendance>> {
    return this.get<PaginatedResponse<Attendance>>('/', {
      params: { ...filter, page, limit }
    });
  }

  async getAttendanceStats(): Promise<AttendanceStats> {
    return this.get<AttendanceStats>('/stats');
  }
}

// Export a singleton instance
export default new AttendanceService();
