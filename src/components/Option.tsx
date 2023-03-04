interface IOptionProps {
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const Option = ({ title, icon, selected, onClick }: IOptionProps) => {
  return (
    <div
      className={`flex h-36 w-32 bg-gray-50 cursor-pointer flex-col items-center justify-center rounded-xl border-2 hover:border-orange-600 hover:bg-orange-100 ${
        selected && "border-orange-600 bg-orange-100 shadow-lg"
      }`}
      data-te-sidenav-toggle-ref
      data-te-target="#sidenav-2"
      aria-controls="#sidenav-2"
      aria-haspopup="true"
      onClick={onClick}
    >
      <h3 className="mb-4 text-4xl">{icon}</h3>
      <h1 className="">{title}</h1>
    </div>
  );
};

export default Option;
