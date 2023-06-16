import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { api } from "~/utils/api";
import QueryWrapper from "../QueryWrapper";
import DefaultState from "../DefaultState";
import type { IExperiment } from "types";

export function RecentlyCreatedExperiments() {
  const recentlyCreatedExperimentsQuery =
    api.admin.recentlyCreatedExperiments.useQuery();
  return (
    <div className="space-y-8">
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
              description="We're unable to fetch your experiments"
              size="sm"
            />
          ),
          Empty: () => (
            <DefaultState
              title="No experiments"
              description="You haven't created any experiments yet"
              size="sm"
            />
          ),
        }}
        renderItem={(item: IExperiment) => (
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                <span>{item.createdBy?.name?.charAt(0)}</span>
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.createdBy?.name || item.createdBy?.email}
              </p>
            </div>
            <div className="ml-auto font-medium">{item.category}</div>
          </div>
        )}
        height={300}
      />
    </div>
  );
}
