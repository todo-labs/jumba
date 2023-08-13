import { Card, CardDescription } from "../ui/Card";
import { cn } from "@/utils";

interface IOptionProps {
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const Option = ({ title, icon, selected, onClick }: IOptionProps) => {
  return (
    <Card
      className={cn(
        "mr-3 flex max-w-[400px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center hover:border-4 hover:border-primary hover:text-white xl:m-3",
        { "border-4 border-primary bg-primary shadow-lg": selected }
      )}
      onClick={onClick}
    >
      <CardDescription>
        <h3 className="mb-4 text-4xl">{icon}</h3>
        <h1
          className={cn("font-medium", {
            "text-white": selected,
          })}
        >
          {title}
        </h1>
      </CardDescription>
    </Card>
  );
};

export default Option;
