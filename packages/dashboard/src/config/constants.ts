// src/config/constants.ts

// Environment Constants
// export const ENV = {
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
//   APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
//   STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
//   GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_ID,
// } as const;

// API Constants
export const API_CONFIG = {
  ENDPOINTS: {
    USERS: {
      PROFILE: '/users/profile',
      SETTINGS: '/users/settings',
      PREFERENCES: '/users/preferences',
    },
    PRODUCTS: {
      LIST: '/products',
      DETAILS: (id: string) => `/products/${id}`,
      REVIEWS: (id: string) => `/products/${id}/reviews`,
    },
    STYLES: {
      LIST: '/styles',
    },
    PROPS: {
      LIST: '/PROPS',
    },
  },
} as const;

// Authentication Constants
export const AUTH = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 20, 50, 100] as const,
} as const;

// UI Constants
export const UI = {
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
  },
  ANIMATION: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      IN: 'cubic-bezier(0.4, 0, 1, 1)',
      OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  TOAST: {
    DURATION: 5000, // 5 seconds
    POSITION: 'bottom-right',
  },
} as const;

//colors
export const colors = {
  primary: {
    '50': '#fff6ec',
    '100': '#ffebd3',
    '200': '#ffd3a5',
    '300': '#ffb46d',
    '400': '#ff8932',
    '500': '#ff670a',
    '600': '#ff4d00',
    '700': '#cc3502',
    '800': '#a12a0b',
    '900': '#82250c',
    '950': '#460f04',
  },
  secondary: {
    '50': '#f5f0ff',
    '100': '#ede4ff',
    '200': '#dccdff',
    '300': '#c5a6ff',
    '400': '#aa73ff',
    '500': '#933bff',
    '600': '#8b14ff',
    '700': '#840aff',
    '800': '#6b01d6',
    '900': '#5903af',
    '950': '#360077',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },

  dark: {
    primary: '#131313',

    secondary: '#1F1F1F',
  },

  light: {
    primary: '#F7F7F7',
  },
} as const;

// Date and Time Constants
export const DATETIME = {
  FORMATS: {
    SHORT_DATE: 'MM/DD/YYYY',
    LONG_DATE: 'MMMM DD, YYYY',
    SHORT_TIME: 'HH:mm',
    LONG_TIME: 'HH:mm:ss',
    DATETIME: 'MM/DD/YYYY HH:mm',
    FULL_DATETIME: 'MMMM DD, YYYY HH:mm:ss',
  },
  TIMEZONE: 'UTC',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    ALLOWED_CHARS: /^[a-zA-Z0-9_-]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 254, // RFC 5321
    PATTERN: /^[^@]+@[^@]+\.[^@]+$/,
  },
} as const;

// File Upload Constants
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  MAX_FILES: 10,
} as const;

// Cache Constants
export const CACHE = {
  STORAGE_PREFIX: 'app_cache_',
  TTL: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 1 day
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: {
    OFFLINE: 'Please check your internet connection',
    TIMEOUT: 'Request timed out. Please try again',
    SERVER_ERROR: 'Something went wrong. Please try again later',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD:
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  },
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_SOCIAL_LOGIN: false,
  //ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
} as const;

// Miscellaneous
export const MISC = {
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de'] as const,
  COPYRIGHT_YEAR: new Date().getFullYear(),
  COMPANY_NAME: 'PROSHOOTAI LTD',
  SUPPORT_EMAIL: 'support@proshootai.com',
} as const;
