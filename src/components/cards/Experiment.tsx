import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { cn } from "@/utils";
import type { IExperiment } from "types";

const ExperimentCard = ({ title, id, tag, imgs, inspiration }: IExperiment) => {
  return (
    <Card className="flex flex-col justify-center rounded-xl border-none shadow-none max-w-[500px]">
      <figure className="relative">
        <Link href={`/experiment/${id}`}>
          <Image
            src={imgs[0]?.url ?? "/default-food.jpeg"}
            alt={title || "Default Food Title"}
            width={300}
            height={200}
            className={cn("h-[200px] w-full rounded-xl", {
              "object-cover": imgs[0]?.url,
            })}
          />
        </Link>
        <Badge className="absolute right-4 top-2 rounded-md text-white">
          #{tag}
        </Badge>
      </figure>
      <CardContent className="mt-2 flex w-full flex-col justify-between">
        <CardTitle className="overflow-ellipsis text-2xl">{title}</CardTitle>
        <CardDescription className="truncate text-sm">
          {inspiration}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

ExperimentCard.displayName = "ExperimentCard"

export default ExperimentCard;
