interface IOptionProps {
  title: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const Option = ({ title, icon, selected, onClick }: IOptionProps) => {
  return (
    <div
      className={`m-3 mr-3 flex h-36 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 bg-gray-50 hover:border-4 hover:border-primary-600 hover:bg-primary-100 ${
        selected ? "border-4 border-primary-600 bg-primary-100 shadow-lg" : ""
      }`}
      data-te-sidenav-toggle-ref
      data-te-target="#sidenav-2"
      aria-controls="#sidenav-2"
      aria-haspopup="true"
      onClick={onClick}
    >
      <h3 className="mb-4 text-4xl">{icon}</h3>
      <h1 className="font-medium">{title}</h1>
    </div>
  );
};

export default Option;
