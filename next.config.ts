import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'twitter-s3-nodejs.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
