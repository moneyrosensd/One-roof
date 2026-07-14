/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allows <img>/<Image> to load photos from any URL a seller pastes in,
    // since items store plain image URLs rather than uploaded files.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
