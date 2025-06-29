import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";

const page = () => {
  const t = useTranslations("AboutKurdistan");
  return (
    <div className="my-10 flex_center w-full">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8">
        <SubHeader title={t("head")} />
        <div className="w-full lg:h-[500px] sm:h-[400px] h-[300px] relative">
          <Image
            src={"/images/kurdistan.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
export default page;
