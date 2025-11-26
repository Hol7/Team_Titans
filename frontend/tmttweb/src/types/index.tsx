// User Types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'pirates' | 'luffy' | 'gca';
    teamId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'pirates' | 'luffy' | 'gca';
    teamId?: string;
  }
  
  export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }
  
  // Auth Types
  export interface LoginDto {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Team Types
  export interface Team {
    id: string;
    name: string;
    description: string;
    managerId: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTeamDto {
    name: string;
    description: string;
    managerId: string;
    members?: string[];
  }
  
  export interface UpdateTeamDto {
    name?: string;
    description?: string;
    managerId?: string;
    members?: string[];
  }
  
  // Clock Types
  export type ClockType = 'in' | 'out';
  
  export interface Clock {
    id: string;
    userId: string;
    type: ClockType;
    timestamp: string;
    createdAt: string;
  }
  
  export interface CreateClockDto {
    type: ClockType;
  }
  
  export interface ClockSummary {
    date: string;
    clockIn?: string;
    clockOut?: string;
    totalHours: number;
  }
  
  // Report Types
  export interface WorkHoursReport {
    userId: string;
    userName: string;
    dailyHours: {
      date: string;
      hours: number;
    }[];
    weeklyHours: {
      week: string;
      hours: number;
    }[];
    totalHours: number;
    averageDailyHours: number;
    averageWeeklyHours: number;
  }
  
  export interface TeamReport {
    teamId: string;
    teamName: string;
    period: {
      startDate: string;
      endDate: string;
    };
    members: {
      userId: string;
      userName: string;
      totalHours: number;
      averageDailyHours: number;
    }[];
    teamTotalHours: number;
    teamAverageDailyHours: number;
  }
  
  export interface KPIReport {
    totalEmployees: number;
    activeToday: number;
    totalHoursThisWeek: number;
    averageHoursPerEmployee: number;
    topPerformers: {
      userId: string;
      userName: string;
      hours: number;
    }[];
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
  }
  
  export interface ApiError {
    message: string;
    code: string;
    details?: any;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  // Query Types
  export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
  }