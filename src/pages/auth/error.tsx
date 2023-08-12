import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const ErrorPage: React.FC = () => {
  const router = useRouter();
  const { statusCode } = router.query;

  let errorMessage = "An error occurred";
  if (statusCode === "404") {
    errorMessage = "The requested page could not be found";
  } else if (statusCode === "500") {
    errorMessage = "An internal server error occurred";
  }

  return (
    <>
      <Head>
        <title>Error - {statusCode}</title>
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold">{errorMessage}</h1>
        <p className="mb-8 text-lg">
          Sorry, we were unable to complete your request at this time.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to homepage
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
