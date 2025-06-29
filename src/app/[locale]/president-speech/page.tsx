import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const page = () => {
  const t = useTranslations("PresidentSpeech");
  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative rounded-2xl overflow-hidden sm:block hidden">
          <Image
            src={"/images/president.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <p className="absolute bg-golden border-white border-4 right-0 bottom-0 rounded-2xl text-white w-[30%] py-3 text-center lg:text-base md:text-sm text-xs">
            {t("name")}
          </p>
        </div>
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[250px] relative rounded-2xl overflow-hidden sm:hidden block">
          <Image
            src={"/images/president-mobile.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
          <p className="absolute bg-golden border-white border-4 right-0 bottom-0 rounded-2xl text-white w-[65%] py-2 text-center lg:text-base md:text-sm text-xs">
            {t("name")}
          </p>
        </div>
        <div className="w-20 h-20 relative">
          <Image
            src={"/images/quote.svg"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
        <h3 className="font-lg text-smallTitle text-secondary">
          {t("header")}
        </h3>
        <span className="text-secondary">{t("text")}</span>
        <div className="w-full flex items-end justify-end">
          <div className="w-20 h-20 relative rotate-180">
            <Image
              src={"/images/quote.svg"}
              alt="My Image"
              fill
              priority
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
