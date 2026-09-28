const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/hello.html",
        },
      ],
    }
  },
};

module.exports = nextConfig;