import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // ⚡ Prisma va Turbopack muammosiz ishlashi uchun shart:
  serverExternalPackages: ['@prisma/client'],
};

export default withNextIntl(nextConfig);