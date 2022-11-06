/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    secret: 'my-open-development'
  },
  publicRuntimeConfig: {
    DOMAIN: process.env.DOMAIN,
    PROTOCOL: process.env.PROTOCOL,
    PORT: process.env.PORT,
    API_PORT: process.env.API_PORT,

    BASE_PATH: process.env.BASE_URL,
    API_URI: process.env.API_URL,
    STATIC_PATH: process.env.STATIC_URL,
    SUBSCRIPTION_PATH: process.env.SUBSCRIPTION_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
  images: {
    domains: [
      'tailwindui.com',
      'images.unsplash.com',
      'localhost',
      "static.flipperstore.com",
    ],
  }
}

module.exports = nextConfig
