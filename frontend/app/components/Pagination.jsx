import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, "...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          h-10 w-10 flex items-center justify-center
          border border-gray-300
          text-black
          hover:border-black
          disabled:opacity-40 disabled:cursor-not-allowed
          transition
          cursor-pointer
        "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`
            min-w-[40px] h-10 px-2
            text-sm font-medium
            transition
            cursor-pointer
            ${page === currentPage
              ? "bg-black text-white"
              : page === "..."
                ? "text-gray-400 cursor-default"
                : "border border-gray-300 text-black hover:border-black"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          h-10 w-10 flex items-center justify-center
          border border-gray-300
          text-black
          hover:border-black
          disabled:opacity-40 disabled:cursor-not-allowed
          transition
          cursor-pointer
        "
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
