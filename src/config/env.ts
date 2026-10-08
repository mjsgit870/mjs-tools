export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'MJS Tools',
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
