import * as React from "react";
import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserCard } from "./User";

import { cn } from "@/utils";
import type { IExperiment } from "types";

const ExperimentCard = ({
  title,
  id,
  tag,
  imgs,
  inspiration,
  createdAt,
  createdBy,
}: IExperiment) => {
  const router = useRouter();
  return (
    <Card
      className="max-w-[500px] cursor-pointer justify-center rounded-xl border-2 p-4 shadow-none transition-shadow hover:border-primary hover:border-primary hover:shadow-lg"
      onClick={() => router.push(`/experiment/${id}`)}
    >
      <CardHeader className="mt-2">
        <Badge className="w-fit rounded-md">#{tag}</Badge>
        <CardTitle className="overflow-ellipsis text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col justify-between space-y-4">
        <CardDescription className="text-sm">{inspiration}</CardDescription>
        <UserCard createdAt={createdAt} createdBy={createdBy} />
      </CardContent>
    </Card>
  );
};

ExperimentCard.displayName = "ExperimentCard";

export default ExperimentCard;
