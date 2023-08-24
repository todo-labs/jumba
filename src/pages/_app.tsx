import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DM_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/Toaster";
import LoadingScreen from "@/components/Loading";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { cn } from "@/utils";
import { api } from "@/utils/api";

import "@/styles/globals.css";
import "@uploadthing/react/styles.css";

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
    <SessionProvider session={session} refetchInterval={60 * 1 * 5}>
      <main className={cn(dmSans.className)}>
        <ThemeProvider attribute="class">
          <LoadingScreen />
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
