import React from "react";

type Props = {
  name: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Slider = ({ name, label, min, max, value, onChange }: Props) => {
  return (
    <div className="relative w-full rounded-full overflow-hidden">
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        type="range"
        name={name}
        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      <div
        className={`${
          value > 0
            ? "bg-primary-600"
            : "bg-gray-300 hover:bg-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-500"
        } absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-full`}
      ></div>
      <div
        style={{ width: `${(value / max) * 100}%` }}
        className={`${
          value > 0
            ? "bg-primary-600"
            : "bg-gray-300 hover:bg-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-500"
        } absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-full`}
      ></div>
    </div>
  );
};

export default Slider;
