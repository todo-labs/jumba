import Link from "next/link";
import type { IExperiment } from "types";

import QueryWrapper from "../QueryWrapper";
import DefaultState from "../DefaultState";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

import { api } from "@/utils/api";

export function RecentlyCreatedExperiments() {
  const recentlyCreatedExperimentsQuery =
    api.admin.recentlyCreatedExperiments.useQuery();
  return (
    <QueryWrapper
      query={recentlyCreatedExperimentsQuery}
      components={{
        Loading: () => (
          <DefaultState
            title="Loading experiments"
            description="We're fetching all recently created experiments"
            size="sm"
          />
        ),
        Error: () => (
          <DefaultState
            title="Failed to load experiments"
            description="We're unable to fetch all recently created experiments"
            size="sm"
          />
        ),
        Empty: () => (
          <DefaultState
            title="No experiments"
            description="There are no recently created experiments"
            size="sm"
          />
        ),
      }}
      renderItem={(item: IExperiment) => (
        <Link
          className="flex items-center rounded-md p-3 hover:border-2"
          href={`/experiment/${item.id}`}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              <span>{item.createdBy?.name?.charAt(0)}</span>
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <div className="ml-auto text-sm font-medium text-primary">
              {item.category}
            </div>
          </div>
        </Link>
      )}
      height={300}
      containerStyle="space-y-6"
    />
  );
}
