import * as React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";

import { cn } from "~/utils";
import type { IExperiment } from "types";

const Experiment = ({
  title,
  id,
  tag,
  Imgs,
  inspiration,
  createdById,
}: IExperiment) => {
  const { data: session } = useSession();
  return (
    <Card className="flex flex-col justify-center rounded-xl border-none shadow-none">
      <figure className="relative">
        <Link href={`/experiment/${id}`}>
          <Image
            src={Imgs[0]?.url ?? "/default-food.jpeg"}
            alt={title || "Default Food"}
            width={300}
            height={200}
            className={cn("h-[200px] w-full rounded-xl", {
              "object-cover": Imgs[0]?.url,
              "border-2 border-primary": session?.user.id === createdById,
            })}
          />
        </Link>
        <Badge className="absolute right-4 top-2 text-white rounded-md">#{tag}</Badge>
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

export default Experiment;
