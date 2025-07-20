"use client";
import Image from "next/image";
import SubHeader from "./subHeader";
import { IoMdMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import useSWR from "swr";

interface Contact {
  id: number;
  college_id: number;
  type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: number;
  college_id: number;
  latitude: string;
  longitude: string;
  location: string;
  created_at: string;
  updated_at: string;
}
interface Response {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  contacts: Contact[];
  addresses: Address[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CenterSkeleton = () => (
  <div className="w-full flex justify-center items-start sm:mt-10 mt-6 min-h-screen animate-pulse">
    <div className="max-w-[1024px] px-3 text-secondary flex_center flex-col gap-5 w-full">
      <div className="w-full flex_start">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full lg:h-[500px] sm:h-[400px] h-[220px] relative sm:mt-14 mt-6 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const DepartmentHeader = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const slug = params?.slug as string;

  const { data, error, isLoading } = useSWR<Response>(
    slug ? `${API_URL}/website/departments/${slug}` : null,
    fetcher,
    {
      dedupingInterval: 1000 * 60 * 60, // 1 hour
      revalidateOnFocus: false,
    }
  );
  // Helper function to get contact by type
  const getContactByType = (type: string) => {
    return (
      data?.contacts?.find(
        (contact) => contact.type.toLowerCase() === type.toLowerCase()
      )?.value || ""
    );
  };

  if (isLoading || !data) return <CenterSkeleton />;
  if (error)
    return <div className="text-center text-red-500">Failed to load data.</div>;
  return (
    <div className="flex justify-center items-center py-10 md:gap-10 md:h-[405px] h-[335px] overflow-hidden relative w-full">
      <Image
        src="/images/bg.png"
        alt="title"
        fill
        priority
        className="w-full h-auto md:block hidden"
      />
      <Image
        src="/images/bg-small.png"
        alt="title"
        fill
        priority
        className="w-full h-auto md:hidden block object-cover"
      />
      <div className="z-20 flex_start flex-col max-w-[1040px] w-full md:gap-8 gap-4 text-white px-3">
        <div className="flex_center gap-2 group relative">
          <span className="w-14 h-[2px] rounded-md bg-golden"></span>
          <h2 className="sm:text-[52px] leading-normal text-smallTitle font-semibold">
            {data.title}
          </h2>
        </div>
        <p className="md:texr-sm text-xs">{data.subtitle}</p>
        <div className="flex_start gap-5  sm:flex-row flex-col">
          <div className="flex justify-start items-center gap-3">
            <IoMdMail className="text-2xl" />
            <div className="flex_start flex-col">
              <span className="text-xs opacity-50">{t("mail")}</span>
              <p className="text-sm">
                {getContactByType("EMAIL") || "info@epu.edu.iq"}
              </p>
            </div>
          </div>
          <div className="flex justify-start items-center gap-3">
            <IoLocationSharp className="text-2xl" />
            <div className="flex_start flex-col">
              <span className="text-xs opacity-50">{t("location")}</span>
              <p className="text-sm">
                {data?.addresses?.[0]?.location || "Karkuk St, Erbil 44001"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeader;
