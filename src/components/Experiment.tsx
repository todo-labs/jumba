// import StarSvg from "public/star.svg";
import Image from "next/image";
import { Experiment } from "@prisma/client";

const Experiment = ({ id, title, img, tag }: Experiment) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl">
      <figure className="relative">
        <Image
          src={img}
          alt={title}
          width={300}
          height={200}
          className="h-[200px] w-[300px] rounded-xl"
        />
        <h1 className="bg-orange-600 absolute top-2 right-4 rounded-md p-2 text-white">
          #{tag}
        </h1>
      </figure>
      <div className="mt-2 flex w-full flex-row items-center justify-between">
        <h1 className="w-1/2 overflow-ellipsis text-2xl">{title}</h1>
        {/* <div className="flex flex-row items-center justify-center">
          <StarSvg className="mr-2 h-4 w-4" />
          <h1 className="text-xl">{rating}</h1>
        </div> */}
      </div>
    </div>
  );
};

export default Experiment;
