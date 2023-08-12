import React from "react";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/utils";

interface Components {
  Loading?: React.ComponentType;
  Error?: React.ComponentType;
  Empty?: React.ComponentType;
}

type QueryWrapperProps<TQueryFnData, TData> = {
  query: QueryObserverBaseResult<TQueryFnData>;
  components?: Components;
  HeaderComponent?: React.ComponentType;
  FooterComponent?: React.ComponentType;
  keyExtractor?: (item: TData, index: number) => string;
  renderItem: (item: TData, index: number) => React.ReactNode;
  containerStyle?: string;
  height: number;
};

const DefaultLoadingComponent = () => <h1>Loading...</h1>;
const DefaultErrorComponent = () => <h1>Error</h1>;
const DefaultEmptyComponent = () => <h1>Empty</h1>;

function QueryWrapper<TQueryFnData, TData>({
  query,
  components,
  keyExtractor,
  renderItem,
  containerStyle,
  HeaderComponent,
  FooterComponent,
  height = 500,
}: QueryWrapperProps<TQueryFnData, TData>) {
  const { isLoading, isError, data } = query || {};

  const {
    Loading = DefaultLoadingComponent,
    Error = DefaultErrorComponent,
    Empty = DefaultEmptyComponent,
  } = components || {};

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  const isList = Array.isArray(data);
  const dataArray = isList ? data : data ? [data] : [];

  if (dataArray.length === 0 || data == null) {
    return <Empty />;
  }

  return (
    <div>
      {HeaderComponent && <HeaderComponent />}
      <ScrollArea className={`h-[${height}px]`}>
        <div className={containerStyle}>
          {dataArray.map((item, index) => (
            <React.Fragment
              key={
                keyExtractor
                  ? keyExtractor(item as TData, index)
                  : index.toString()
              }
            >
              {renderItem(item as TData, index)}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      {FooterComponent && <FooterComponent />}
    </div>
  );
}

export default QueryWrapper;
