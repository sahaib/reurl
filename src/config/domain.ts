export const DOMAIN = {
  production: 'https://reurl.dev',
  development: 'http://localhost:3000'
} as const;

export const getDomain = () => {
  return process.env.NODE_ENV === 'production' ? DOMAIN.production : DOMAIN.development;
}; 