
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Head from "next/head";

import { api } from "~/utils/api";

const ExpirementPage: NextPage = () => {
  const router = useRouter();
  const { expirementId } = router.query;
  const {
    data: expirement,
    isError,
    isLoading,
  } = api.experiments.getOne.useQuery({ id: expirementId as string });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>{expirement?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col p-10"></main>
    </div>
  );
};

export default ExpirementPage;
