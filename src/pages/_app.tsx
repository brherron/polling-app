// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import "../styles/globals.scss";
import Link from "next/link";

const MyApp: AppType = ({ Component, pageProps }) => {
  const rainArray = [];
  for (let r = 0; r < 125; r++) {
    const svgStyles = {
      left: `calc(${Math.floor(Math.random() * 100)} * 1%)`,
      top: `calc(${Math.floor(Math.random() * 100)} + 50) * -1px)`,
      animationDuration: `calc(${Math.random() + 0.5} * 1s)`,
      animationDelay: `calc(${Math.random() * 2 - 1} * 1s)`,
    };

    const pathStyles = {
      opacity: `${Math.random()}`,
      transform: `scaleY(calc(${Math.random()}) * 1.5)`,
    };

    rainArray.push(
      <svg
        className="rain__drop"
        preserveAspectRatio="xMinYMin"
        viewBox="0 0 5 50"
        style={svgStyles}
      >
        <path
          style={pathStyles}
          stroke="none"
          d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z"
        ></path>
      </svg>
    );
  }

  return (
    <div className="main-app flex w-screen h-screen">
      <div className="w-full p-12 bg-[#888fd2] grid grid-cols-1 lg:grid-cols-2">
        <div className="left-container rain h-full">
          {rainArray.map((r) => r)}
          <div className="title">
            <Link href="/">
              <h1 className="font-bold text-gray-100 cursor-pointer">
                Downpoll<span className="text-8xl">.</span>
              </h1>
            </Link>
            <h2 className="text-gray-800">
              <span>
                I&apos;m forcing this name because I want to use this epic css
                background made by{" "}
              </span>
              <a
                href="https://github.com/jh3y"
                target="_blank"
                rel="noreferrer"
              >
                @jh3y
              </a>
              .
            </h2>
          </div>
        </div>
        <div className="right-container max-h-screen p-12 flex flex-col items-stretch bg-white">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        };
      },
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
