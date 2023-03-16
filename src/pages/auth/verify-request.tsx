import React from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env.mjs";
import pexel, { Photo } from "pexels";

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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = await pexel.createClient(env.PEXELS_API_KEY!).photos.random();

  return {
    props: {
      image: data as Photo,
    },
  };
};

const VerifyRequestPage: React.FC = (props) => {
  const { image } = props;

  const router = useRouter();

  return (
    <section className="body-font mx-auto flex h-screen flex-col items-center justify-center space-y-4 bg-gray-50 px-5 py-24 text-gray-600">
      <Image
        src={image.src.large}
        alt={image.photographer}
        width={200}
        height={200}
        className="rounded object-cover object-center"
      />
      <div className="w-full text-center lg:w-2/3">
        <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
          Check Your Email
        </h1>
        <p className="mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          click the link to complete your account setup.
        </p>
        <div className="flex justify-center">
          <button
            className="inline-flex rounded border-0 bg-primary-500 py-2 px-6 text-lg text-white hover:bg-primary-600 focus:outline-none"
          >
            Resend
          </button>
          <button
            onClick={() => router.back()}
            className="ml-4 inline-flex rounded border-0 bg-gray-100 py-2 px-6 text-lg text-gray-700 hover:bg-gray-200 focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyRequestPage;
