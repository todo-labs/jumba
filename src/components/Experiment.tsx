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
  img,
  tag,
  inspiration,
  createdById,
}: Partial<Experiment>) => {
  const { data: session } = useSession();
  return (
    <Link href={`/experiment/${id}`}>
      <Card className="flex flex-col items-center justify-center rounded-xl border-none shadow-none">
        <figure className="relative">
          <Image
            src={img || "/default-food.jpeg"}
            alt={title || "Default Food"}
            width={300}
            height={200}
            className={cn("h-[200px] w-full rounded-xl", {
              "object-cover": img,
              "border-2 border-primary": session?.user.id === createdById,
            })}
          />
          <Badge className="absolute right-4 top-2 rounded-md">#{tag}</Badge>
        </figure>
        <CardContent className="mt-2 flex w-full flex-row justify-between">
          <CardTitle className="overflow-ellipsis text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm">{inspiration}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Experiment;
