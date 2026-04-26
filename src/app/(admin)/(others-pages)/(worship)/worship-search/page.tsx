import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorshipList from "@/components/worship/worship_list";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "찬양관리 > 찬양조회",
  description: "찬양을 조회하는 프로그램",
};

export default function BlankPage() {
  return (
   <div>
      <PageBreadcrumb pageTitle="찬양조회" />
      <div className="min-h-full rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-5">
        <div className="w-full">
          <WorshipList />
        </div>
      </div>
    </div>
  );
}
