const kurdishMonths = [
  "کانوونی دووەم",
  "شوبات",
  "ئازار",
  "نیسان",
  "ئایار",
  "حوزەیران",
  "تەممووز",
  "ئاب",
  "ئەیلوول",
  "تشرینی یەکەم",
  "تشرینی دووەم",
  "کانوونی یەکەم",
];

export const formatDate = (dateString: string | null | undefined, locale: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  if (locale === "ku") {
    const day = date.getDate();
    const month = kurdishMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}، ${year}`;
  }
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
