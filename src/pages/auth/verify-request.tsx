import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/Button";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const VerifyRequestPage: NextPage = () => {

  const router = useRouter();

  return (
    <section className="body-font mx-auto flex h-screen flex-col items-center justify-center space-y-4 bg-gray-50 px-5 py-24 text-gray-600">
      <div className="w-full text-center lg:w-2/3">
        <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
          Check Your Email
        </h1>
        <p className="mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          click the link to complete your account setup.
        </p>
        <div className="flex justify-center">
          <Button>
            Resend
          </Button>
          <Button
            onClick={() => router.back()}
            variant="secondary"
          >
            Go Back
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifyRequestPage;
