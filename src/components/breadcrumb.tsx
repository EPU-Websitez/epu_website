import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface BreadcrumbProps {
  title: string;
  alt: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title = "", alt = false }) => {
  return (
    <div className="flex_center gap-2 group relative text-white">
      <p className="opacity-80 text-sm">University Board</p>
      <MdKeyboardDoubleArrowRight className="rtl:rotate-180" />
      <p className="text-sm font-medium">Academic Profile</p>
    </div>
  );
};

export default Breadcrumb;
