interface SubHeaderProps {
  title: string;
  alt: boolean;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, alt = false }) => {
  return (
    <div className="flex_center gap-2 group relative">
      <span
        className={`w-14 h-[2px] rounded-md ${
          alt ? "bg-secondary" : "bg-golden"
        }`}
      ></span>
      <h2 className="sm:text-titleNormal text-xl text-secondary font-semibold">
        {title}
      </h2>
    </div>
  );
};

export default SubHeader;
