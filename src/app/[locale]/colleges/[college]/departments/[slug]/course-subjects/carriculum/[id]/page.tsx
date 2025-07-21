"use client";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GrLinkNext } from "react-icons/gr";
import { HiOutlineLink } from "react-icons/hi2";
import { API_URL } from "@/libs/env";
import useFetch from "@/libs/hooks/useFetch";

interface Department {
  id: number;
  college_id: number;
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  vision: string;
  mission: string;
  priority: number;
  created_at: string;
  updated_at: string;
  student_number: string;
  college: {
    id: number;
    subdomain: string;
    slug: string | null;
    title: string;
    description: string;
  };
  staffCount: number;
  leadCount: number;
}

interface CurriculumSubject {
  id: number;
  semester_id: number;
  subject: string;
  code: string;
  theory_hours: string;
  practical_hours: string;
  ects: string;
  module_description: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface CurriculumSemester {
  id: number;
  curriculum_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  subjects: CurriculumSubject[];
}

interface Curriculum {
  id: number;
  department_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  department: Department;
  semesters: CurriculumSemester[];
}

interface CurriculumResponse {
  total: number;
  page: number;
  limit: number;
  data: Curriculum[];
}

// Skeleton Components
const TableSkeleton = () => (
  <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
    <div className="w-full bg-white">
      <div className="bg-gray-200 animate-pulse">
        <div className="h-12 w-full"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-12 bg-gray-100"></div>
        ))}
      </div>
    </div>
  </div>
);

const CurriculumSkeleton = () => (
  <div className="w-full flex_start flex-col gap-8">
    <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
    <TableSkeleton />
    <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
    <TableSkeleton />
    <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
    <TableSkeleton />
  </div>
);

const Page = () => {
  const t = useTranslations("Colleges");
  const params = useParams();
  const locale = params?.locale as string;
  const slug = params?.slug as string;
  const curriculumId = params?.curriculumId as string;

  // Fetch curriculum data
  const {
    data: curriculumData,
    loading: curriculumLoading,
    error: curriculumError,
  } = useFetch<CurriculumResponse>(
    `${API_URL}/website/departments/${slug}/course-curriculums?page=1&limit=10`
  );

  // Find the specific curriculum if curriculumId is provided, otherwise use the first one
  const selectedCurriculum = curriculumId
    ? curriculumData?.data?.find((c) => c.id.toString() === curriculumId)
    : curriculumData?.data?.[0];

  const formatHours = (hours: string) => {
    return hours ? `${hours} Hours` : "N/A";
  };

  if (curriculumError) {
    return (
      <div className="w-full flex_center my-10">
        <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Curriculum Data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!selectedCurriculum && !curriculumLoading) {
    return (
      <div className="w-full flex_center my-10">
        <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">
            Curriculum Not Found
          </h1>
          <p className="text-gray-600">
            The requested curriculum could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-secondary">
        <SubHeader
          title={selectedCurriculum?.title || t("course_carriculum")}
          alt={false}
        />

        {curriculumLoading ? (
          <CurriculumSkeleton />
        ) : (
          <>
            {/* Display curriculum information */}
            {selectedCurriculum && (
              <div className="w-full flex_start flex-col gap-8">
                {selectedCurriculum.semesters.map((semester) => (
                  <div
                    key={semester.id}
                    className="w-full flex_start flex-col gap-5"
                  >
                    <h3 className="text-lg text-golden font-semibold">
                      {semester.title}
                    </h3>

                    {semester.subjects && semester.subjects.length > 0 ? (
                      <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
                        <table className="w-full bg-white">
                          <thead>
                            <tr className="bg-golden text-white">
                              <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("subject")}
                              </th>
                              <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("code")}
                              </th>
                              <th className="md:px-6 px-3 sm:py-4 text-nowrap py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("theory_hours")}
                              </th>
                              <th className="md:px-6 text-nowrap px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("practical_hours")}
                              </th>
                              <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("ECTS")}
                              </th>
                              <th className="md:px-6 px-3 text-nowrap sm:py-4 py-3 text-start font-medium text-sm tracking-wider ltr:border-r rtl:border-l border-blue-700 md:min-w-max min-w-[170px]">
                                {t("module_description")}
                              </th>
                              <th className="md:px-6 px-3 sm:py-4 py-3 text-start font-medium text-sm tracking-wider md:min-w-max min-w-[170px]">
                                {t("language")}
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200">
                            {semester.subjects.map((subject) => (
                              <tr
                                key={subject.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 font-medium ltr:border-r rtl:border-l border-gray-200 text-nowrap">
                                  {subject.subject}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-blue-700 ltr:border-r rtl:border-l border-gray-200">
                                  {subject.code}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                                  {formatHours(subject.theory_hours)}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                                  {formatHours(subject.practical_hours)}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                                  {subject.ects || "N/A"}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900 ltr:border-r rtl:border-l border-gray-200">
                                  {subject.module_description || "N/A"}
                                </td>
                                <td className="md:px-6 px-3 md:py-4 py-3 text-sm text-gray-900">
                                  {subject.language || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="w-full bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                          No subjects available for this semester.
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Show available curriculums if there are multiple */}
                {/* {curriculumData?.data && curriculumData.data.length > 1 && (
                  <div className="w-full flex_start flex-col gap-5 mt-8 p-5 bg-backgroundSecondary rounded-lg">
                    <h3 className="text-lg font-semibold text-golden">
                      Other Available Curriculums
                    </h3>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                      {curriculumData.data
                        .filter((c) => c.id !== selectedCurriculum.id)
                        .map((curriculum) => (
                          <a
                            key={curriculum.id}
                            href={`/${locale}/colleges/${params?.college}/departments/${slug}/course-subjects/curriculum/${curriculum.id}`}
                            className="p-4 bg-white rounded-lg border border-lightBorder hover:border-golden transition-colors"
                          >
                            <h4 className="font-medium text-secondary">
                              {curriculum.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {curriculum.semesters.length} semester(s) •{" "}
                              {curriculum.semesters.reduce(
                                (total, sem) => total + sem.subjects.length,
                                0
                              )}{" "}
                              subjects
                            </p>
                          </a>
                        ))}
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
