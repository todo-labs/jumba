import React from "react";

interface IDefaultStateProps {
  title: string;
  icon?: React.ReactNode;
  description: string;
  btnText?: string;
  onClick?: () => void;
  size?: "sm" | "lg";
}

export default function DefaultState(props: IDefaultStateProps) {
  const { title, description, btnText, onClick, size = "lg" } = props;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {props.icon && <props.icon className="h-38 w-20 fill-orange-600" />}
      <h1
        className={`mt-10 ${
          size === "sm" ? "text-2xl" : "text-6xl"
        } font-medium`}
      >
        {title}
      </h1>
      <p
        className={`mt-5 ${
          size === "lg" ? "w-1/2 text-lg" : ""
        } text-center text-gray-400`}
      >
        {description}
      </p>
      {btnText && onClick && (
        <button
          className="mt-10 rounded-lg bg-orange-600 px-5 py-2 text-white"
          onClick={onClick}
        >
          {btnText}
        </button>
      )}
    </div>
  );
}
