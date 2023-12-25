import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChefHatIcon } from "lucide-react";

import { UserAuthForm } from "@/components/user/AuthForm";

import { getServerAuthSession } from "@/server/auth";

const SignIn: NextPage = () => {
  
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url(/auth-bg.jpeg)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <ChefHatIcon className="mr-2 h-6 w-6" /> Jumba
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                signin to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Dont have an account?{" "}
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                terms
              </Link>{" "}
              and
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

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

export default SignIn;
