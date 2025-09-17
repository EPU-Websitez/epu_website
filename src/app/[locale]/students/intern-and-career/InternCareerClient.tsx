"use client";

import { useState, useEffect } from "react";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaPhone, FaTimes } from "react-icons/fa";
import { IoBriefcaseOutline, IoLocationSharp } from "react-icons/io5";
import CollegeMapComponent from "@/components/CollegeMapComponent ";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

// -------- Interfaces --------
interface ImageFile {
  id: number;
  original: string;
  lg: string;
  md: string;
  sm: string;
}
interface InternCareerMain {
  id: number;
  slug: string;
  title: string;
  description: string;
  offer_title: string;
  offer_description: string;
  staff_title: string;
}
interface InternCareerMainResponse {
  data: InternCareerMain[];
}
interface GalleryItem {
  id: number;
  image: ImageFile;
}
interface GalleriesResponse {
  data: GalleryItem[];
}
interface OfferItem {
  id: number;
  title: string;
  description: string;
  icon_image: ImageFile;
}
interface OffersResponse {
  data: OfferItem[];
}
interface StaffItem {
  id: number;
  role_in_intern: string;
  teacher: {
    full_name: string;
    profile_image: ImageFile;
  };
}
interface StaffResponse {
  data: StaffItem[];
}
interface JobOpportunity {
  id: number;
  title: string;
  description: string;
  address: {
    location: string;
    latitude: string;
    longitude: string;
  } | null;
  services: { id: number; title: string; icon_image: ImageFile }[];
  contacts: { id: number; type: string; value: string }[];
}
interface JobOpportunitiesResponse {
  total: number;
  data: JobOpportunity[];
}

// -------- Modal Component --------
interface JobDetailModalProps {
  job: JobOpportunity;
  onClose: () => void;
}
const JobDetailModal = ({ job, onClose }: JobDetailModalProps) => {
  const lat = job.address?.latitude ? parseFloat(job.address.latitude) : NaN;
  const lng = job.address?.longitude ? parseFloat(job.address.longitude) : NaN;
  const hasValidCoordinates = !isNaN(lat) && !isNaN(lng);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-secondary">
            {job.title}
          </h2>
          <p className="text-secondary opacity-80 mb-6">{job.description}</p>

          {job.services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-3">
                Services
              </h3>
              <div className="flex flex-wrap gap-4">
                {job.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg"
                  >
                    <Image
                      src={service.icon_image.lg}
                      alt={service.title}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{service.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {job.contacts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-3">
                Contact
              </h3>
              {job.contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-2">
                  <FaPhone className="text-secondary" />
                  <a
                    href={`tel:${contact.value}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>
          )}

          {job.address && (
            <div>
              <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-3">
                Location
              </h3>
              <p className="mb-4">{job.address.location}</p>
              {hasValidCoordinates ? (
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <CollegeMapComponent
                    lat={lat}
                    lng={lng}
                    title={job.title}
                    address={job.address.location}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------- Granular Skeleton Components --------
const GallerySkeleton = () => (
  <div className="w-full h-[290px] lg:h-[373px] bg-gray-200 animate-pulse rounded-3xl mt-5 sm:mt-10"></div>
);
const OffersSectionSkeleton = () => (
  <div className="flex w-full animate-pulse md:flex-row flex-col gap-10">
    <div className="flex-1 space-y-4">
      <div className="h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="h-4 w-full rounded bg-gray-200"></div>
    </div>
    <div className="lg:w-1/2 md:w-[60%] w-full grid grid-cols-2 gap-5">
      <div className="h-40 rounded-2xl bg-gray-200"></div>
      <div className="h-40 rounded-2xl bg-gray-200"></div>
      <div className="h-40 rounded-2xl bg-gray-200"></div>
      <div className="h-40 rounded-2xl bg-gray-200"></div>
    </div>
  </div>
);
const StaffBannerSkeleton = () => (
  <div className="w-full bg-gray-200 mt-20 md:py-20 py-14 h-[400px] animate-pulse"></div>
);
const JobCardSkeleton = () => (
  <div className="p-5 bg-gray-200 rounded-3xl w-full h-[250px] animate-pulse"></div>
);

const InternCareerClient = () => {
  const t = useTranslations("Students");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [internCareerSlug, setInternCareerSlug] = useState<string | null>(null);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(
    []
  );
  const [jobPage, setJobPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isJobsLoadingMore, setIsJobsLoadingMore] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);

  const { data: mainData, loading: mainLoading } =
    useFetch<InternCareerMainResponse>(
      `${API_URL}/website/intern-career?page=1&limit=1`,
      locale
    );

  useEffect(() => {
    if (mainData?.data?.[0]?.slug) {
      setInternCareerSlug(mainData.data[0].slug);
    }
  }, [mainData]);

  const { data: galleriesData, loading: galleriesLoading } =
    useFetch<GalleriesResponse>(
      internCareerSlug
        ? `${API_URL}/website/intern-career/${internCareerSlug}/galleries`
        : "",
      locale
    );
  const { data: offersData, loading: offersLoading } = useFetch<OffersResponse>(
    internCareerSlug
      ? `${API_URL}/website/intern-career/${internCareerSlug}/offers`
      : "",
    locale
  );
  const { data: staffData, loading: staffLoading } = useFetch<StaffResponse>(
    internCareerSlug
      ? `${API_URL}/website/intern-career/${internCareerSlug}/staff`
      : "",
    locale
  );

  const fetchJobs = async (page: number) => {
    if (page > 1) setIsJobsLoadingMore(true);
    try {
      const res = await fetch(
        `${API_URL}/website/intern-career/${internCareerSlug}/job-opportunities?page=${page}&limit=6`,
        {
          headers: {
            "website-language": locale || "en",
          },
        }
      );
      const newData: JobOpportunitiesResponse = await res.json();
      if (newData.data) {
        setJobOpportunities((prev) =>
          page === 1 ? newData.data : [...prev, ...newData.data]
        );
        setTotalJobs(newData.total);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      if (page > 1) setIsJobsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (internCareerSlug) {
      setJobPage(1);
      setJobOpportunities([]);
      fetchJobs(1);
    }
  }, [internCareerSlug]);

  const handleLoadMore = () => {
    const nextPage = jobPage + 1;
    setJobPage(nextPage);
    fetchJobs(nextPage);
  };

  const isLoading =
    mainLoading || galleriesLoading || offersLoading || staffLoading;
  const mainInfo = mainData?.data?.[0];
  const galleries = galleriesData?.data || [];
  const offers = offersData?.data || [];
  const staff = staffData?.data || [];
  const customShapes = [
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    "polygon(0% 20%, 60% 0%, 100% 40%, 90% 90%, 40% 100%, 10% 70%)",
    "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
    "polygon(50% 0%, 83% 4%, 100% 43%, 88% 88%, 68% 100%, 32% 100%, 10% 90%, 4% 34%, 17% 12%)",
  ];

  return (
    <>
      <div className="w-full flex_center flex-col sm:my-10 my-5">
        <div className="max-w-[1024px] px-3 text-secondary flex_start flex-col gap-5 w-full">
          <SubHeader title={t("intern_and_career")} alt={false} />

          {isLoading ? (
            <GallerySkeleton />
          ) : (
            galleries.length > 0 && (
              <div className="w-full relative sm:mt-10 mt-5 grid grid-cols-4 grid-rows-2 gap-2 lg:h-[373px] h-[290px]">
                {galleries.slice(0, 6).map((item, index, arr) => {
                  let gridClass =
                    index === 0 || (index === arr.length - 1 && arr.length > 1)
                      ? "col-span-2 row-span-2"
                      : "col-span-2 row-span-1";
                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-xl overflow-hidden ${gridClass}`}
                    >
                      <Image
                        src={item.image.lg}
                        alt={`Gallery Image ${index + 1}`}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )
          )}

          <div className="flex md:justify-center justify-start md:items-center items-start w-full flex-col gap-5 md:text-center text-start my-10">
            <h2 className="lg:text-3xl relative text-lg font-semibold ">
              <span className="absolute ltr:left-0 right-0 bottom-0 h-1/2 bg-golden w-full"></span>
              <span className="z-10 relative">
                {mainInfo?.title || t("career_development_opportunities")}
              </span>
            </h2>
            <p className="font-medium lg:text-lg text-base">
              {mainInfo?.description ||
                t("career_development_opportunities_text")}
            </p>
          </div>

          {isLoading ? (
            <OffersSectionSkeleton />
          ) : (
            <div className="flex md:justify-center justify-start md:items-center items-start gap-10 w-full text-secondary md:flex-row flex-col">
              <div className="flex_start flex-col md:max-w-[390px] max-w-full gap-5">
                <h2 className="font-bold lg:text-titleNormal text-xl">
                  {mainInfo?.offer_title}
                </h2>
                <span>{mainInfo?.offer_description}</span>
              </div>
              <div className="lg:w-1/2 md:w-[60%] w-full flex-shrink-0 relative grid grid-cols-2 gap-5">
                <div className="w-[538px] h-[441px] absolute md:-top-[10px] top-0 md:-left-[39px] left-0">
                  <Image
                    src={"/images/career-shape.png"}
                    alt="Career Shape"
                    fill
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                {offers.slice(0, 4).map((offer) => (
                  <div
                    key={offer.id}
                    className="w-full bg-white rounded-2xl flex_start flex-col sm:gap-5 gap-2 sm:p-5 p-2 z-10 shadow shadow-[#00000015]"
                  >
                    <span className="w-10 h-10 rounded bg-secondary bg-opacity-10 text-xl flex_center z-10">
                      <Image
                        src={offer.icon_image.lg}
                        alt={offer.title}
                        width={24}
                        height={24}
                      />
                    </span>
                    <h5 className="sm:text-base text-sm font-medium">
                      {offer.title}
                    </h5>
                    <span className="text-xs">{offer.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <StaffBannerSkeleton />
        ) : (
          <div className="w-full flex_center bg-primary mt-20 text-white flex-col gap-10 relative px-3 md:py-20 py-14">
            <div className="absolute lg:left-40 left-10 md:top-20 top-[20%] w-[58px] h-[47px]">
              <Image src={"/images/dialog.svg"} alt="Dialog" fill priority />
            </div>
            <h1 className="lg:max-w-[740px] md:max-w-[490px] max-w-[90%] lg:text-title md:text-titleNormal text-2xl text-center">
              {mainInfo?.staff_title}
            </h1>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-5 w-full mt-10 max-w-[1040px]">
              {staff.map((member, index) => (
                <div
                  key={member.id}
                  className="w-full flex_center flex-col gap-3"
                >
                  <div className="md:w-[160px] w-[120px] md:h-[175px] h-[130px] relative">
                    <Image
                      src={member.teacher.profile_image.lg}
                      alt={member.teacher.full_name}
                      fill
                      priority
                      className="w-full h-full object-cover"
                      style={{
                        clipPath: customShapes[index % customShapes.length],
                      }}
                    />
                  </div>
                  <h4 className="font-semibold mt-2 text-center">
                    {member.teacher.full_name}
                  </h4>
                  <span className="text-sm opacity-80 -mt-2">
                    {member.role_in_intern}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-[1024px] px-3 w-full text-secondary flex_start gap-10 flex-col mt-14">
          <h1 className="font-semibold lg:text-titleNormal text-xl">
            {t("explore_jobs")}
          </h1>
          <div className="p-5 rounded-3xl bg-backgroundSecondary w-full">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-5">
              {jobOpportunities.length === 0 && isLoading ? (
                <>
                  <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton />
                </>
              ) : (
                jobOpportunities.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="p-5 bg-background rounded-3xl w-full flex_start items-center flex-col gap-4 text-left"
                  >
                    <div className="flex items-center gap-5 w-full">
                      {job.services[0]?.icon_image && (
                        <div className="w-[82px] h-[82px] flex-shrink-0 flex_center rounded-xl border border-lightBorder">
                          <div className="w-[60px] h-[60px] relative">
                            <Image
                              src={job.services[0].icon_image.lg}
                              alt={job.title}
                              fill
                              priority
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex_start flex-col gap-1">
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                      </div>
                    </div>
                    {job.address && (
                      <div className="flex items-center gap-3 w-full">
                        <IoLocationSharp className="text-2xl flex-shrink-0" />
                        <div className="flex_start flex-col">
                          <small className="text-xs opacity-70">Location</small>
                          <p className="text-sm">{job.address.location}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
            {jobOpportunities.length > 0 &&
              jobOpportunities.length < totalJobs && (
                <div className="w-full flex_center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isJobsLoadingMore}
                    className="bg-primary text-white px-6 py-2 rounded-full disabled:bg-opacity-70 transition-colors"
                  >
                    {isJobsLoadingMore ? t("loading") : t("load_more")}
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="my-10 flex_center flex-col gap-10 w-full">
          <h4 className="font-semibold text-lg text-golden">
            {t("successful_stories")}
          </h4>
          <h2 className="lg:text-3xl text-xl font-bold lg:max-w-[840px] sm:max-w-[500px] max-w-[90%] text-center text-secondary">
            {t("successful_stories_text")}
          </h2>
          <div className="relative w-full lg:h-[500px] sm:h-[300px] h-[200px]">
            <Image
              src={"/images/story.png"}
              alt="Successful Stories"
              fill
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
};
export default InternCareerClient;
