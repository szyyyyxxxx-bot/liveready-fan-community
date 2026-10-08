import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CloudBase 静态托管使用：`pnpm run build:cloudbase` 后上传 out/。
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
