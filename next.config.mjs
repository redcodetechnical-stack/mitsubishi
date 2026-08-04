/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'fair-zebras-design.loca.lt', 
    'focus-introduce-felt-typing.trycloudflare.com'
  ],
}

export default nextConfig
