import type { GetServerSideProps, NextPage } from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { getServerAuthSession } from "~/server/auth";
import { Loader2Icon } from "lucide-react";
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

const SignIn: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await signIn("email", { email: data.email });
    setLoading(false);
  };


  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Sign in</title>
        <meta name="description" content="Sign in to your account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link
        href="/"
        className="mt-6 text-center text-3xl font-extrabold text-gray-900 sm:mx-auto sm:w-full sm:max-w-md"
      >
        Sign in to your account
      </Link>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email", { required: true })}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    Email address is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2Icon className="animate-spin h-8 w-8" /> : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
