/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/models/:path*.usdz',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/vnd.usdz+zip',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/models/:path*.glb',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/gltf-binary',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
