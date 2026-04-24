import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import WorshipList from "@/components/worship/worship_list" 
import ContiMngtList from "@/components/worship/conti_mngt_list" 

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

export default function BlankPage() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      </div>
    </div>
  );
}
