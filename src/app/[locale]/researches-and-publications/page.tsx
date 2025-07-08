"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Page = () => {
  const t = useTranslations("ResearchesAndPublications");
  return (
    <div className="my-10 flex_center w-full flex-col gap-10">
      <div className="max-w-[1040px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} alt={false} />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h3 className="text-sm text-blue-900 font-semibold mb-2">
            Researches & Publications
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
            <span className="text-yellow-600">Innovative</span>{" "}
            <span className="text-blue-900">Research and Publications</span>
          </h1>
        </div>

        {/* Right Section with Image + Overlay Search */}
        <div className="flex-1 w-full relative">
          {/* Image */}
          <div className="overflow-hidden rounded-xl shadow-md">
            <Image
              src="/images/bg.png" // Your image path
              alt="Research Image"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Overlay Search Bar */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex flex-col sm:flex-row items-center px-4 py-2 gap-2">
            {/* Date Selector */}
            <div className="flex items-center w-full sm:w-auto px-2 text-gray-500">
              <span className="mr-2">📅</span>
              <input
                type="date"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Search Input */}
            <div className="flex-1 w-full sm:mx-2">
              <input
                type="text"
                placeholder="Search for research, publication..."
                className="w-full bg-transparent outline-none px-2 py-2 text-sm"
              />
            </div>

            {/* Search Button */}
            <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2 rounded-full transition">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
