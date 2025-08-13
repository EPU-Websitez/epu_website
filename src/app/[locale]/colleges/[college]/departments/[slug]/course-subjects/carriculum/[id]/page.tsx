"use client";

import { useEffect, useState, FC } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/libs/env";
import SubHeader from "@/components/subHeader";
import { useTranslations } from "next-intl";

// --- INTERFACES ---
interface Subject {
  id: number;
  code: string;
  subject?: string;
  name?: string;
  theory_hours: string;
  practical_hours: string;
  ects: string;
  module_description: string;
  language: string;
}

interface Semester {
  id: number;
  title: string;
  subjects?: Subject[];
}

interface PaginationState {
  [semesterId: number]: {
    currentPage: number;
  };
}

// --- NEW HELPER COMPONENTS ---

// Modal Component for Module Description
const DescriptionModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  description: string;
}> = ({ isOpen, onClose, description }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Module Description
        </h3>
        <p className="text-secondary opacity-80 whitespace-pre-wrap">
          {description || "No description available."}
        </p>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// Pagination Controls Component
const PaginationControls: FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Page() {
  const t = useTranslations("Colleges");
  const params = useParams();
  const curriculumId = params?.id as string;

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  // State for pagination, keyed by semester ID
  const [paginationState, setPaginationState] = useState<PaginationState>({});
  const ITEMS_PER_PAGE = 10;

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    const fetchSemestersAndSubjects = async () => {
      try {
        const semestersRes = await fetch(
          `${API_URL}/website/departments/curriculum/${curriculumId}/semesters`
        );
        const semestersData = await semestersRes.json();

        const semestersWithSubjects = await Promise.all(
          semestersData.data.map(async (semester: Semester) => {
            const subjectsRes = await fetch(
              `${API_URL}/website/departments/semester/${semester.id}/subjects`
            );
            const subjectsData = await subjectsRes.json();
            return {
              ...semester,
              subjects: subjectsData.data,
            };
          })
        );
        setSemesters(semestersWithSubjects);
      } catch (error) {
        console.error("Error fetching semesters/subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemestersAndSubjects();
  }, [curriculumId]);

  // --- HANDLERS ---
  const handlePageChange = (semesterId: number, page: number) => {
    setPaginationState((prev) => ({
      ...prev,
      [semesterId]: { currentPage: page },
    }));
  };

  const handleOpenModal = (description: string) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDescription("");
  };

  const formatHours = (hours: string) => hours || "N/A";

  if (loading) {
    return (
      <div className="w-full flex_center my-10">
        <p className="text-gray-500">{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex_center my-10">
      <div className="max-w-[1024px] px-3 w-full flex_start flex-col gap-8 text-secondary">
        <SubHeader title={t("course_subjects")} alt={false} />

        {semesters.map((semester) => {
          // Pagination logic for each semester
          const currentPage = paginationState[semester.id]?.currentPage || 1;
          const totalSubjects = semester.subjects?.length || 0;
          const totalPages = Math.ceil(totalSubjects / ITEMS_PER_PAGE);
          const indexOfLastSubject = currentPage * ITEMS_PER_PAGE;
          const indexOfFirstSubject = indexOfLastSubject - ITEMS_PER_PAGE;
          const currentSubjects =
            semester.subjects?.slice(indexOfFirstSubject, indexOfLastSubject) ||
            [];

          return (
            <div key={semester.id} className="w-full">
              <h2 className="text-xl font-semibold mb-4">{semester.title}</h2>

              {currentSubjects && currentSubjects.length > 0 ? (
                <>
                  <div className="overflow-x-auto shadow-sm custom_scroll rounded-lg w-full">
                    <table className="w-full bg-white">
                      <thead>
                        <tr className="bg-golden text-white">
                          <th className="px-3 py-3 text-start sm:text-base text-sm">
                            {t("subject")}
                          </th>
                          <th className="px-3 py-3 text-start sm:text-base text-sm">
                            {t("code")}
                          </th>
                          <th className="px-3 py-3 min-w-[120px] text-start sm:text-base text-sm">
                            {t("theory_hours")}
                          </th>
                          <th className="px-3 py-3 text-start min-w-[130px] sm:text-base text-sm">
                            {t("practical_hours")}
                          </th>
                          <th className="px-3 py-3 text-start sm:text-base text-sm">
                            {t("ECTS")}
                          </th>
                          <th className="px-3 py-3 text-start min-w-[155px] sm:text-base text-sm">
                            {t("module_description")}
                          </th>
                          <th className="px-3 py-3 text-start sm:text-base text-sm">
                            {t("language")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentSubjects.map((subject) => (
                          <tr key={subject.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3 sm:text-sm text-xs text-blue-700 font-medium">
                              {subject.subject || subject.name}
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              {subject.code}
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              {formatHours(subject.theory_hours)}
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              {formatHours(subject.practical_hours)}
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              {subject.ects || "N/A"}
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              <button
                                onClick={() =>
                                  handleOpenModal(subject.module_description)
                                }
                                className="text-blue-600 hover:underline text-xs bg-blue-100 px-2 py-1 rounded"
                              >
                                View
                              </button>
                            </td>
                            <td className="px-3 py-3 sm:text-sm text-xs">
                              {subject.language || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(semester.id, page)}
                  />
                </>
              ) : (
                <div className="w-full bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">
                    No subjects available for this semester.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        description={selectedDescription}
      />
    </div>
  );
}
