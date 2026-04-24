import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AbcEditor from '@/components/abc/AbcEditor';
import { Metadata } from "next";
import React from 'react';
import { SheetData } from "@/types/types";

export const metadata: Metadata = {
  title: "찬양관리 > 찬양등록",
  description: "찬양을 등록하는 프로그램",
};

export default async function Worship() {

  const sheet:SheetData[] = [];

  return (
    <div>
      <PageBreadcrumb pageTitle="찬양등록" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-5">
        <div className="mx-auto w-full">
          <AbcEditor notationData = {sheet[0]}/>
        </div>
      </div>
    </div>
  );
}
