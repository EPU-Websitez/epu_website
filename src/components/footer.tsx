import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <div className="w-full flex_center flex-col gap-5 py-10 bg-primary text-white">
      <p className="text-sm opacity-50">Connect with Us</p>
      <h1 className="text-6xl text-center max-w-[35ch] font-semibold">
        Empowering Future Leaders Through Innovative Education
      </h1>
      <div className="flex_center gap-10 mt-10">
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">Academics</h3>
          <Link href={"/"} className="opacity-50">
            Institutions
          </Link>
          <Link href={"/"} className="opacity-50">
            Colleges
          </Link>
          <Link href={"/"} className="opacity-50">
            Centers
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">About</h3>
          <Link href={"/"} className="opacity-50">
            History
          </Link>
          <Link href={"/"} className="opacity-50">
            President Speech
          </Link>
          <Link href={"/"} className="opacity-50">
            Academic Staff
          </Link>
        </div>
        <div className="flex_start flex-col gap-3">
          <h3 className="text-lg font-medium">Relations</h3>
          <Link href={"/"} className="opacity-50">
            Strategy
          </Link>
          <Link href={"/"} className="opacity-50">
            MOUs
          </Link>
          <Link href={"/"} className="opacity-50">
            Contact Us
          </Link>
        </div>
      </div>
      <div className="max-w-[1024px] w-full flex justify-between items-center gap-3 mt-10">
        <div className="w-[200px] h-[50px] relative">
          <Image
            src={"/images/logo-alt.png"}
            alt="My Image"
            fill
            priority
            className="w-full h-auto object-cover group-hover:scale-105 duration-300"
          />
        </div>
        <span className="opacity-80">
          © 2025 Erbil Polytechnic University. All right reserved.
        </span>
        <div className="flex_center gap-5">
          <a
            href="/"
            className="w-12 h-12 border border-white rounded-full flex_center"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="/"
            className="w-12 h-12 border border-white rounded-full flex_center"
          >
            <FaFacebookF />
          </a>
          <a
            href="/"
            className="w-12 h-12 border border-white rounded-full flex_center"
          >
            <FaInstagram />
          </a>
          <a
            href="/"
            className="w-12 h-12 border border-white rounded-full flex_center"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  );
}
