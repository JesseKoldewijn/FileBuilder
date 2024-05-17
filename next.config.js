/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import withSerwistInit from "@serwist/next";

const isDev = process.env.NODE_ENV === "development";
const isStandalone = process.env.STANDALONE_APP === "true";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: isDev,
  cacheOnNavigation: true,
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: isStandalone ? "standalone" : undefined,
  poweredByHeader: false,
};

export default withSerwist(config);
