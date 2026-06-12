// 콘티 수정용 목록 테이블 컴포넌트
"use client";

import { ContiData, Meta } from "@/types/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { getPaginationRange } from "@/utils/pagination";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface ContiTableProps {
  data: ContiData[];
  meta: Meta;
  showNewButton?: boolean;
}

type SortKey = keyof Pick<ContiData, "contiDate" | "contiNote" | "contiLeader">;

function SortIcon({ active, dir }: { active: boolean; dir: string }) {
  return (
    <span className="ml-1 flex flex-col gap-[2px]">
      <span
        className={`block border-x-4 border-x-transparent border-b-4 ${
          active && dir === "asc"
            ? "border-b-gray-800 dark:border-b-gray-100"
            : "border-b-gray-300 dark:border-b-gray-600"
        }`}
      />
      <span
        className={`block border-x-4 border-x-transparent border-t-4 ${
          active && dir === "desc"
            ? "border-t-gray-800 dark:border-t-gray-100"
            : "border-t-gray-300 dark:border-t-gray-600"
        }`}
      />
    </span>
  );
}

export default function ContiTableUpdate({ data, meta, showNewButton = true }: ContiTableProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("contiNote") ?? "");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const currentSortKey = searchParams.get("sortKey") ?? "id";
  const currentSortDir = searchParams.get("sortDir") ?? "asc";
  const currentLimit = 20;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function handleSearch(value: string) {
    setSearchInput(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      updateParams({ contiNote: value, page: "1" });
    }, 500);
    setDebounceTimer(timer);
  }

  function handleSort(key: SortKey) {
    const newDir =
      currentSortKey === key && currentSortDir === "asc" ? "desc" : "asc";
    updateParams({ sortKey: key, sortDir: newDir, page: "1" });
  }

  function handlePage(page: number) {
    updateParams({ page: String(page) });
  }

  const pageNumbers = getPaginationRange(meta.page, meta.totalPages);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Controls */}
      <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <div className="relative max-w-[13rem]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              type="text"
              placeholder="예배 검색..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          {showNewButton && (
            <Link
              href="/conti-mngt/detail/new"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              신규
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th
                className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                onClick={() => handleSort("contiDate")}
              >
                <span className="flex items-center">
                  콘티일자
                  <SortIcon active={currentSortKey === "contiDate"} dir={currentSortDir} />
                </span>
              </th>
              <th
                className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                onClick={() => handleSort("contiNote")}
              >
                <span className="flex items-center">
                  예배
                  <SortIcon active={currentSortKey === "contiNote"} dir={currentSortDir} />
                </span>
              </th>
              <th
                className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                onClick={() => handleSort("contiLeader")}
              >
                <span className="flex items-center">
                  예배인도자
                  <SortIcon active={currentSortKey === "contiLeader"} dir={currentSortDir} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/conti-mngt/detail/${row.id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100">
                    {row.contiDate}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100">
                    {row.contiNote}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {row.contiLeader}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {meta.total > 0
            ? `${(meta.page - 1) * meta.limit + 1} – ${Math.min(meta.page * meta.limit, meta.total)} / 총 ${meta.total.toLocaleString()}건`
            : "결과 없음"}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePage(meta.page - 1)}
            disabled={!meta.hasPrev}
            className="w-8 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          {pageNumbers.map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
            ) : (
              <button
                key={n}
                onClick={() => handlePage(n as number)}
                className={`w-8 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  n === meta.page
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => handlePage(meta.page + 1)}
            disabled={!meta.hasNext}
            className="w-8 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}