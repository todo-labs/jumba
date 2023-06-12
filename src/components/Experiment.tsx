import * as React from "react";
import { Experiment } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";
import { Badge } from "./badge";

import { cn } from "~/utils";

const Experiment = ({
  title,
  id,
  imgs,
  tag,
  inspiration,
  createdById,
}: Partial<Experiment>) => {
  const { data: session } = useSession();
  return (
    <Card className="flex flex-col justify-center rounded-xl border-none shadow-none">
      <figure className="relative">
        <Link href={`/experiment/${id}`}>
          <Image
            src={imgs[0] ?? "/default-food.jpeg"}
            alt={title || "Default Food"}
            width={300}
            height={200}
            className={cn("h-[200px] w-full rounded-xl", {
              "object-cover": imgs[0],
              "border-2 border-primary": session?.user.id === createdById,
            })}
          />
        </Link>
        <Badge className="absolute right-4 top-2 rounded-md">#{tag}</Badge>
      </figure>
      <CardContent className="mt-2 flex w-full flex-col justify-between">
        <CardTitle className="overflow-ellipsis text-2xl">{title}</CardTitle>
        <CardDescription className="text-sm">{inspiration}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Experiment;
