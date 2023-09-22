import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { IExperiment } from "types";
import { UserCard } from "./cards/User";

type Props = "createdAt" | "feeds" | "duration" | "createdBy";

export function ExperimentDetailsTable(
  props: Pick<Partial<IExperiment>, Props>
) {
  return (
    <Table>
      <TableCaption>Experiment details</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Created By</TableHead>
          <TableHead>Feeds</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            <UserCard createdAt={props.createdAt} createdBy={props.createdBy} />
          </TableCell>
          <TableCell>
            <span className="text-primary">
              {props.feeds} {props.feeds === 1 ? "person" : "people"}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="text-primary">{props.duration} Mins</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
