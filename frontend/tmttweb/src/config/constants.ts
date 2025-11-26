export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Time Management';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://104.154.249.250:8000/api/v1/auth';

// Routes
export const ROUTES = {
  WELCOME: '/welcome',
  ROLE_SELECTION: '/role-selection',
  AUTH: {
    LOGIN: '/login/',
  },
  VISITOR: {
    CLOCK_IN: '/visitor/clock-in',
    CLOCK_OUT: '/visitor/clock-out',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    PROFILE: '/profile',
    CLOCK: '/clock',
  },
  MANAGER: {
    USERS: '/users',
    USER_NEW: '/users/new',
    USER_DETAIL: (id: string) => `/users/${id}`,
    TEAMS: '/teams',
    TEAM_NEW: '/teams/new',
    TEAM_DETAIL: (id: string) => `/teams/${id}`,
    REPORTS: '/reports',
    TEAM_REPORT: (id: string) => `/reports/team/${id}`,
    USER_REPORT: (id: string) => `/reports/user/${id}`,
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
  },
  USERS: {
    ME: '/me',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
    DETAIL: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
  },
  CLOCKS: {
    CREATE: '/clocks',
    USER_CLOCKS: (id: string) => `/users/${id}/clocks`,
  },
  REPORTS: {
    GLOBAL: '/reports',
    TEAM: (id: string) => `/teams/${id}/reports`,
    USER: (id: string) => `/users/${id}/reports`,
  },
} as const;

// Query Keys
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  USERS: {
    LIST: ['users'],
    DETAIL: (id: string) => ['users', id],
  },
  TEAMS: {
    LIST: ['teams'],
    DETAIL: (id: string) => ['teams', id],
  },
  CLOCKS: {
    USER: (id: string) => ['clocks', 'user', id],
  },
  REPORTS: {
    GLOBAL: ['reports', 'global'],
    TEAM: (id: string) => ['reports', 'team', id],
    USER: (id: string) => ['reports', 'user', id],
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  FIRST_VISIT: 'tmtt_first_visit',
} as const;

// Roles
export const ROLES = {
  PIRATES: 'pirates', // employé
  LUFFY: 'luffy',     // manager
  GCA: 'gca',         // admin
} as const;

// Clock Types
export const CLOCK_TYPES = {
  IN: 'in',
  OUT: 'out',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
} as const;

// Visit Reasons
export const VISIT_REASONS = [
  { value: 'meeting', label: 'Réunion' },
  { value: 'delivery', label: 'Livraison' },
  { value: 'interview', label: 'Entretien' },
  { value: 'commercial', label: 'Visite commerciale' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'training', label: 'Formation' },
  { value: 'other', label: 'Autre' },
] as const;