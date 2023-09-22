import React from "react";
import { IExperiment } from "types";
import { ExperimentDetailsTable } from "./ExperimentsDetailsTable";

type HeaderSectionProps =
  | "feeds"
  | "tag"
  | "title"
  | "createdBy"
  | "duration"
  | "createdAt"
  | "inspiration";

const HeaderSection = (
  props: Pick<Partial<IExperiment>, HeaderSectionProps>
) => {
  return (
    <React.Fragment>
      <div className="space-y-4">
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          <strong className="text-primary">#{props.tag}</strong> {props.title}
        </h1>
        <blockquote className="flex flex-col  border-l-2 py-6 pl-6 text-xl italic text-muted-foreground">
          {props.inspiration}
        </blockquote>
      </div>
      <ExperimentDetailsTable {...props} />
    </React.Fragment>
  );
};

export default HeaderSection;
