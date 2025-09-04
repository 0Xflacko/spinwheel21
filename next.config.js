/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    const cspHeader = `
      default-src 'self';
      script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline' https://connect.facebook.net https://www.googletagmanager.com https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https://www.facebook.com https://www.google-analytics.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://graph.facebook.com https://region1.google-analytics.com;
      frame-src 'self' https://www.googletagmanager.com https://www.facebook.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `;

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
