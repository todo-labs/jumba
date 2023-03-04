import React from "react";

type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const Toggle = ({ label, checked, onChange }: Props) => {
  return (
    <div className="flex items-center mb-2">
      {checked ? (
        <div
          onClick={onChange}
          className="bg-primary-600 h-5 w-5 rounded border-white shadow-md"
        ></div>
      ) : (
        <div onClick={onChange} className="bg-slate-200 h-5 w-5 rounded"></div>
      )}
      <h1 className="capitalize ml-2 font-bold">{label}</h1>
    </div>
  );
};

export default Toggle;
