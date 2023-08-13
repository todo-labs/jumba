import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2Icon } from "lucide-react";

const LoadingScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (isLoading) {
    return (
    <div className="flex flex-col items-center justify-center h-screen">
        <Loader2Icon className="w-16 h-16 text-primary/30 animate-spin" />
        <h1 className="text-4xl dark:text-white">Loading...</h1>
      </div>
    );
  }

  return null;
};

export default LoadingScreen;
