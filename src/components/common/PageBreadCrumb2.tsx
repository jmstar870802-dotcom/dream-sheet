import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  title: string;
  lyrics : string;
}

const PageBreadcrumb2: React.FC<BreadcrumbProps> = ({ title, lyrics }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 mb-2">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageName">
        {title}
      </h2>
      <div className="flex-col justify-end h-4">
         <span className="text-sm inline-block align-text-bottom">{lyrics}</span>
      </div>
    </div>
  );
};

export default PageBreadcrumb2;
