/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["your-wordpress-domain.com", "secure.gravatar.com"],
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/api/og",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ]
  },
  env: {
    WP_GRAPHQL_ENDPOINT: process.env.WP_GRAPHQL_ENDPOINT,
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID,
  },
}

module.exports = nextConfig
