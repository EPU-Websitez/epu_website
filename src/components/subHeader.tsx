interface SubHeaderProps {
  title: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title }) => {
  return (
    <div className="flex_center gap-2 group relative">
      <span className="w-14 h-[2px] bg-golden rounded-md"></span>
      <h2 className="sm:text-titleNormal text-smallTitle text-secondary font-semibold">
        {title}
      </h2>
    </div>
  );
};

export default SubHeader;
