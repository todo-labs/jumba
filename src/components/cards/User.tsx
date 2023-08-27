import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { displayUserName, getInitials } from "@/utils";
import { format } from "date-fns";
import { IExperiment } from "types";

export const UserCard = ({ createdBy, createdAt }: Partial<IExperiment>) => {
  return (
    <div className="flex-1">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={createdBy?.image as string} />
            <AvatarFallback>{getInitials(createdBy?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">
              {displayUserName(createdBy?.name)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {createdAt
                ? format(createdAt || new Date(), "MMMM dd, yyyy")
                : "Unavailable"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
