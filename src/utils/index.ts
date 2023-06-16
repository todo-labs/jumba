import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayUserName = (name: string | null | undefined) => {
  if (!name) return "N. A";
  const [firstName, lastName] = name.split(" ");
  if (!firstName || !lastName) return "N. A";
  else {
    return `${firstName[0] ?? "N"}. ${lastName ?? "Available"}`;
  }
};

export const formatDate = (d: Date) => {
  const date = new Date(d);
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
};
