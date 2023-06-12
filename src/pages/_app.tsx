import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "~/components/ui/Toaster";
import { DM_Sans } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import LoadingScreen from "~/components/Loading";
import { cn } from "~/utils";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={cn(dmSans.className)}>
        <LoadingScreen />
        <Component {...pageProps} />
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
