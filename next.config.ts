import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    /* config options here */
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    experimental: {
      cacheLife: {
        "cell": {
          stale: 3600,    // 1시간 동안은 캐시 유지
          revalidate: 60, // 60초마다 데이터가 새것인지 확인
          expire: 86400,  // 24시간 후엔 캐시 완전 삭제
        },
      },
    },
    
    // allowedDevOrigins: ['14.48.221.158'],  
};

export default nextConfig;
