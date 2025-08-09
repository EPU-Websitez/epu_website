"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import EventCard from "@/components/eventCards";
import CollegeHeader from "@/components/collegeHeader";

const Page = () => {
  const t = useTranslations("Events");
  const params = useParams();
  const locale = params?.locale as string;
  return (
    <div className="w-full flex_center flex-col sm:my-10 my-5">
      <div className="max-w-[1379px] px-3 flex_start w-full">
        <CollegeHeader />
      </div>
      <div className="max-w-[1040px] w-full text-secondary flex_start flex-col gap-8 mt-10 lg:px-0 px-3">
        <div className="w-full flex_center gap-5">
          <h1 className="md:text-titleNormal text-base font-semibold flex-shrink-0">
            {t("late_events")}
          </h1>
          <span className="w-full h-1 bg-golden"></span>
        </div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-8 mb-5">
          <EventCard
            image="/images/event.png"
            link={`/${locale}/events/1`}
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
          <EventCard
            image="/images/event.png"
            link={`/${locale}/events/1`}
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
          <EventCard
            image="/images/event.png"
            link={`/${locale}/events/1`}
            type="Computation"
            createdAt="27 Dec 2020"
            time="1:14 PM"
            title="Innovate & Compete: Annual Student Innovation Challenge."
          />
        </div>
      </div>
      <button className="border border-primary text-primary px-8 py-2 rounded-md">
        {t("see_more")}
      </button>
    </div>
  );
};

export default Page;
// in this component

// make the data dynamic

// add skeleton loading

// apply see more

// and don't show skeleton again if user clicks on see more only do it for first time

// here is api response

// website/colleges/{{collegeSubdomain}}/events
