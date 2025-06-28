import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

export default function UsefulLink() {
  const t = useTranslations("Footer");

  return (
    <div className="w-full">
      <div className="relative w-full h-[450px] flex_center">
        <Image
          src={"/images/footer.png"}
          alt="My Image"
          fill
          priority
          className="w-full h-auto object-cover opacity-25"
        />
        <div className="flex justify-between items-center h-full max-w-[1000px] w-full z-10">
          <div className="flex_start flex-col gap-8">
            <p className="text-secondary font-semibold">You may also like</p>
            <h1 className="text-6xl max-w-[15ch] text-secondary font-semibold">
              Most Useful Links
            </h1>
          </div>
          <div className="w-1/2 flex_start flex-col gap-2">
            <Link
              href="/"
              className="w-full flex justify-between items-center text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg">Colleges</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href="/"
              className="w-full flex justify-between items-center text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg">Institutions</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href="/"
              className="w-full flex justify-between items-center text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg">EPU Programs</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>

            <Link
              href="/"
              className="w-full flex justify-between items-center text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg">Academic Staff</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>
            <Link
              href="/"
              className="w-full flex justify-between items-center text-secondary border-b border-b-secondary border-opacity-30 py-3 relative group"
            >
              <h3 className="text-lg">Conferences</h3>
              <GoArrowRight className="text-xl" />
              <span className="absolute max-w-0 duration-200 bg-primary bg-opacity-5 h-full group-hover:max-w-full w-full left-0 top-0"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
