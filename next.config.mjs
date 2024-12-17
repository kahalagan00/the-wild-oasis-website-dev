/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "etnckncpodjdghvzycds.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
        search: "",
      },
    ],
  },

  // PRODUCTION
  // output: "export", // For static deployment Netlify, etc. (npm run build)
};

export default nextConfig;
