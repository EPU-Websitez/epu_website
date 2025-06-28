import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("About");
  return <div>{t("head")}</div>;
};

export default page;
