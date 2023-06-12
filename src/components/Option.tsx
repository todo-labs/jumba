import { Category } from "@prisma/client";
import { 
  Card, 
  CardDescription
} from "./ui/Card"
import { cn } from "~/utils"

interface IOptionProps {
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const Option = ({ title, icon, selected, onClick }: IOptionProps) => {
  return (
    <Card
      className={cn('p-6 xl:m-3 mr-3 flex flex-col h-36 w-32 cursor-pointer text-center items-center justify-center rounded-xl border-2 bg-gray-50 hover:text-white hover:border-4 hover:border-primary',
        { "border-4 border-primary bg-primary shadow-lg": selected })}
      onClick={onClick}
    >
      <CardDescription>
        <h3 className="mb-4 text-4xl">{icon}</h3>
        <h1 className={cn("font-medium", {
          "text-white": selected,
        })}>{title}</h1>
      </CardDescription>
    </Card>
  );
};

export default Option;
