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

import type { IExperiment } from "types";
import { useMixpanel } from "@/lib/mixpanel";

const ExperimentCard = ({ title, id, tag, inspiration }: IExperiment) => {
  const router = useRouter();
  const { trackEvent } = useMixpanel();

  const handleClick = () => {
    trackEvent("ButtonClick", {
      experimentId: id,
      experimentTitle: title,
      label: "ExperimentCard",
    });
    router.push(`/experiment/${id}`)
  }
  return (
    <Card
      className="h-[300px] max-w-[500px] cursor-pointer justify-center rounded-xl border-2 p-2 shadow-none transition-shadow hover:border-primary hover:border-primary hover:shadow-lg"
      onClick={handleClick}
    >
      <CardHeader className="mt-2">
        <Badge className="w-fit rounded-md">#{tag}</Badge>
        <CardTitle className="overflow-ellipsis text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col justify-between space-y-4">
        <CardDescription className="text-clip text-sm">
          {inspiration}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

ExperimentCard.displayName = "ExperimentCard";

export default ExperimentCard;
